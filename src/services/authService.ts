import { supabase, isSupabaseConfigured, localDb } from '../lib/supabase';
import type { Profile, UserRole, Employee } from '../types';

export interface AuthSession {
  user: Profile;
  employee?: Employee;
  token?: string;
}

const AUTH_STORAGE_KEY = 'dayflow_current_auth_session';
const PASSWORD_STORAGE_KEY = 'dayflow_local_passwords';

interface StoredPasswords {
  [email: string]: string;
}

const getStoredPasswords = (): StoredPasswords => {
  try {
    const data = localStorage.getItem(PASSWORD_STORAGE_KEY);

    if (!data) {
      return {};
    }

    return JSON.parse(data);
  } catch {
    return {};
  }
};

const saveStoredPasswords = (passwords: StoredPasswords): void => {
  localStorage.setItem(
    PASSWORD_STORAGE_KEY,
    JSON.stringify(passwords)
  );
};

const validatePassword = (
  password: string | undefined
): void => {
  if (!password || password.length < 6) {
    throw new Error(
      'Password must be at least 6 characters long.'
    );
  }
};

export const authService = {
  /**
   * Login an existing user.
   *
   * Uses Supabase Authentication when configured.
   * Otherwise uses the local demo database with locally
   * stored credentials.
   */
  async login(
    email: string,
    password?: string
  ): Promise<AuthSession> {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }

    if (!password) {
      throw new Error('Please enter your password.');
    }

    /*
     * ---------------------------------------------------------
     * SUPABASE AUTHENTICATION
     * ---------------------------------------------------------
     */
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

        if (error) {
          throw new Error(
            error.message || 'Invalid email or password.'
          );
        }

        if (!data?.user) {
          throw new Error(
            'Unable to authenticate the account.'
          );
        }

        const { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('email', trimmedEmail)
            .single();

        if (profileError || !profile) {
          throw new Error(
            'Your account was authenticated, but your Dayflow profile could not be found.'
          );
        }

        const { data: employee } =
          await supabase
            .from('employees')
            .select('*')
            .eq('email', trimmedEmail)
            .maybeSingle();

        const session: AuthSession = {
          user: profile,
          employee: employee || undefined,
          token: data.session?.access_token,
        };

        this.setStoredSession(session);

        return session;
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }

        throw new Error(
          'Unable to sign in. Please check your credentials.'
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * LOCAL / DEMO AUTHENTICATION
     * ---------------------------------------------------------
     */

    const profile = localDb.getProfileByEmail(trimmedEmail);

    if (!profile) {
      throw new Error(
        `No account found with email "${trimmedEmail}".`
      );
    }

    const passwords = getStoredPasswords();

    /*
     * Demo accounts created by the seed data use:
     *
     * password123
     *
     * If an existing seeded account has no locally stored
     * password yet, initialise it with the demo password.
     *
     * Newly registered users always have their own password.
     */
    if (!passwords[trimmedEmail]) {
      passwords[trimmedEmail] = 'password123';
      saveStoredPasswords(passwords);
    }

    if (passwords[trimmedEmail] !== password) {
      throw new Error(
        'Invalid email or password.'
      );
    }

    const employee =
      localDb.getEmployeeByEmail(trimmedEmail) ||
      localDb.getEmployeeByProfileId(profile.id);

    const session: AuthSession = {
      user: profile,
      employee: employee || undefined,
      token: `local-session-${profile.id}`,
    };

    this.setStoredSession(session);

    return session;
  },

  /**
   * Register a new Dayflow account.
   */
  async register(params: {
    employeeId: string;
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    department?: string;
    designation?: string;
    phone?: string;
  }): Promise<AuthSession> {
    const trimmedEmail = params.email.trim().toLowerCase();

    if (!params.fullName.trim()) {
      throw new Error('Please enter your full name.');
    }

    if (!params.employeeId.trim()) {
      throw new Error('Please enter your employee ID.');
    }

    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }

    validatePassword(params.password);

    /*
     * ---------------------------------------------------------
     * SUPABASE REGISTRATION
     * ---------------------------------------------------------
     */
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } =
          await supabase.auth.signUp({
            email: trimmedEmail,
            password: params.password!,
            options: {
              data: {
                full_name: params.fullName,
                role: params.role,
                employee_id: params.employeeId,
              },
            },
          });

        if (error) {
          throw new Error(error.message);
        }

        if (!data?.user) {
          throw new Error(
            'Unable to create your account.'
          );
        }

        /*
         * Email verification may be enabled in Supabase.
         * In that case, there may not be an active session yet.
         */
        if (!data.session) {
          throw new Error(
            'Registration successful. Please verify your email before signing in.'
          );
        }

        const { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('email', trimmedEmail)
            .single();

        if (profileError || !profile) {
          throw new Error(
            'Account created, but the Dayflow profile could not be loaded.'
          );
        }

        const { data: employee } =
          await supabase
            .from('employees')
            .select('*')
            .eq('email', trimmedEmail)
            .maybeSingle();

        const session: AuthSession = {
          user: profile,
          employee: employee || undefined,
          token: data.session?.access_token,
        };

        this.setStoredSession(session);

        return session;
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }

        throw new Error(
          'Unable to create the account.'
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * LOCAL / DEMO REGISTRATION
     * ---------------------------------------------------------
     */

    const existing =
      localDb.getProfileByEmail(trimmedEmail);

    if (existing) {
      throw new Error(
        `An account with email "${trimmedEmail}" already exists.`
      );
    }

    const newProfile: Profile = {
      id: `usr-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`,

      email: trimmedEmail,

      full_name: params.fullName.trim(),

      role: params.role,

      avatar_url:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString(),
    };

    localDb.saveProfile(newProfile);

    const newEmployee = localDb.saveEmployee({
      profile_id: newProfile.id,

      employee_id: params.employeeId.trim(),

      full_name: params.fullName.trim(),

      email: trimmedEmail,

      phone:
        params.phone ||
        '+1 (555) 000-1122',

      department:
        params.department ||
        'Engineering',

      designation:
        params.designation ||
        (
          params.role === 'ADMIN'
            ? 'HR Administrator'
            : 'Software Engineer'
        ),

      role: params.role,

      status: 'ACTIVE',

      employment_type: 'FULL_TIME',

      base_salary:
        params.role === 'ADMIN'
          ? 10000
          : 7500,
    });

    /*
     * Store the password for the local/demo environment.
     */
    const passwords = getStoredPasswords();

    passwords[trimmedEmail] = params.password!;

    saveStoredPasswords(passwords);

    const session: AuthSession = {
      user: newProfile,

      employee: newEmployee,

      token: `local-session-${newProfile.id}`,
    };

    this.setStoredSession(session);

    return session;
  },

  /**
   * Logout the current user.
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn(
          'Supabase sign out error:',
          err
        );
      }
    }

    localStorage.removeItem(
      AUTH_STORAGE_KEY
    );
  },

  /**
   * Return the currently stored session.
   *
   * IMPORTANT:
   * This function NEVER creates a default Admin session.
   *
   * If the user has not logged in, it returns null.
   */
  getCurrentSession(): AuthSession | null {
    try {
      const data =
        localStorage.getItem(
          AUTH_STORAGE_KEY
        );

      if (!data) {
        return null;
      }

      const session =
        JSON.parse(data) as AuthSession;

      if (
        !session ||
        !session.user ||
        !session.user.email
      ) {
        localStorage.removeItem(
          AUTH_STORAGE_KEY
        );

        return null;
      }

      return session;
    } catch (error) {
      console.error(
        'Failed to restore authentication session:',
        error
      );

      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );

      return null;
    }
  },

  /**
   * Store the current authenticated session.
   */
  setStoredSession(
    session: AuthSession
  ): void {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(session)
    );
  },

  /**
   * Update the currently authenticated user's profile.
   */
  updateCurrentProfile(
    updates: Partial<Profile>
  ): Profile {
    const session =
      this.getCurrentSession();

    if (!session) {
      throw new Error(
        'Not authenticated'
      );
    }

    const updatedUser = {
      ...session.user,
      ...updates,
      updated_at:
        new Date().toISOString(),
    };

    localDb.saveProfile(
      updatedUser
    );

    if (
      session.employee &&
      updates.full_name
    ) {
      const updatedEmp =
        localDb.saveEmployee({
          ...session.employee,

          full_name:
            updates.full_name,
        });

      session.employee =
        updatedEmp;
    }

    session.user =
      updatedUser;

    this.setStoredSession(
      session
    );

    return updatedUser;
  },
};
import { localDb } from '../lib/supabase';
import type { Notification } from '../types';

export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notifs = localDb.getNotifications(userId);
    return notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async markAsRead(notificationId: string): Promise<void> {
    localDb.markNotificationAsRead(notificationId);
  },

  async markAllAsRead(userId: string): Promise<void> {
    localDb.markAllNotificationsAsRead(userId);
  },

  async createNotification(payload: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Promise<Notification> {
    return localDb.createNotification(payload);
  }
};

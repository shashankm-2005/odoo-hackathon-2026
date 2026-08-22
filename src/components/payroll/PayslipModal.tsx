import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import {
  Printer,
  Download,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { PayrollRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { info, error } = useToast();

  /*
   * Keep basic modal keyboard behavior working.
   * Escape closes the payslip instead of affecting the page.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!record) return null;

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const employeeName = record.employee?.full_name || 'Employee';
  const employeeId = record.employee?.employee_id || 'N/A';
  const department = record.employee?.department || 'N/A';
  const designation = record.employee?.designation || 'N/A';

  const grossSalary =
    typeof record.gross_salary === 'number'
      ? record.gross_salary
      : record.basic_salary + record.allowances + record.bonuses;

  const totalDeductions =
    (record.deductions || 0) + (record.tax || 0);

  const netSalary =
    typeof record.net_salary === 'number'
      ? record.net_salary
      : grossSalary - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  /*
   * Generates a real PDF directly with jsPDF.
   * This does not depend on html2canvas or browser DOM rendering.
   */
  const handleDownload = () => {
    try {
      info(
        'Generating PDF',
        'Your payslip PDF is being prepared...'
      );

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;

      let y = 18;

      /*
       * Helper functions
       */
      const drawLine = (yPosition: number) => {
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
      };

      const drawRoundedBox = (
        x: number,
        yPosition: number,
        width: number,
        height: number,
        fillColor: [number, number, number],
        borderColor: [number, number, number] = fillColor
      ) => {
        doc.setFillColor(...fillColor);
        doc.setDrawColor(...borderColor);
        doc.roundedRect(
          x,
          yPosition,
          width,
          height,
          3,
          3,
          'FD'
        );
      };

      const writeLabelValue = (
        label: string,
        value: string,
        x: number,
        yPosition: number,
        valueWidth = 40
      ) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), x, yPosition);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);

        const lines = doc.splitTextToSize(value, valueWidth);
        doc.text(lines, x, yPosition + 5);
      };

      /*
       * HEADER
       */
      drawRoundedBox(
        margin,
        y,
        13,
        13,
        [15, 23, 42]
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(99, 102, 241);
      doc.text('D', margin + 4.2, y + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(15, 23, 42);
      doc.text('DAYFLOW HRMS', margin + 18, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Enterprise Workforce & Payroll Management',
        margin + 18,
        y + 11
      );

      /*
       * Statement reference
       */
      const statementReference =
        `PAY-${record.pay_period_year}-` +
        `${record.pay_period_month.substring(0, 3).toUpperCase()}-` +
        `${record.id.substring(record.id.length - 4)}`;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'STATEMENT REFERENCE',
        pageWidth - margin,
        y + 3,
        { align: 'right' }
      );

      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(
        statementReference,
        pageWidth - margin,
        y + 8,
        { align: 'right' }
      );

      doc.setFillColor(220, 252, 231);
      doc.setDrawColor(134, 239, 172);
      doc.roundedRect(
        pageWidth - margin - 18,
        y + 11,
        18,
        7,
        3,
        3,
        'FD'
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(22, 101, 52);
      doc.text(
        record.payment_status || 'PAID',
        pageWidth - margin - 9,
        y + 15.5,
        { align: 'center' }
      );

      y += 27;

      drawLine(y);

      y += 10;

      /*
       * EMPLOYEE INFORMATION
       */
      const infoBoxHeight = 43;

      drawRoundedBox(
        margin,
        y,
        contentWidth,
        infoBoxHeight,
        [248, 250, 252],
        [226, 232, 240]
      );

      const colWidth = contentWidth / 4;

      writeLabelValue(
        'Employee Name',
        employeeName,
        margin + 5,
        y + 9,
        colWidth - 8
      );

      writeLabelValue(
        'Employee ID',
        employeeId,
        margin + colWidth + 5,
        y + 9,
        colWidth - 8
      );

      writeLabelValue(
        'Department',
        department,
        margin + colWidth * 2 + 5,
        y + 9,
        colWidth - 8
      );

      writeLabelValue(
        'Designation',
        designation,
        margin + colWidth * 3 + 5,
        y + 9,
        colWidth - 8
      );

      writeLabelValue(
        'Pay Period',
        `${record.pay_period_month} ${record.pay_period_year}`,
        margin + 5,
        y + 25,
        colWidth - 8
      );

      writeLabelValue(
        'Payment Method',
        record.payment_method || 'Direct Bank Deposit',
        margin + colWidth + 5,
        y + 25,
        colWidth - 8
      );

      writeLabelValue(
        'Disbursement Date',
        record.payment_date || 'Processed',
        margin + colWidth * 2 + 5,
        y + 25,
        colWidth - 8
      );

      writeLabelValue(
        'Employment Type',
        'Full Time Regular',
        margin + colWidth * 3 + 5,
        y + 25,
        colWidth - 8
      );

      y += infoBoxHeight + 10;

      /*
       * EARNINGS AND DEDUCTIONS
       */
      const gap = 6;
      const tableWidth = (contentWidth - gap) / 2;
      const tableHeight = 72;

      /*
       * Earnings table
       */
      drawRoundedBox(
        margin,
        y,
        tableWidth,
        tableHeight,
        [255, 255, 255],
        [226, 232, 240]
      );

      doc.setFillColor(15, 23, 42);
      doc.roundedRect(
        margin,
        y,
        tableWidth,
        11,
        3,
        3,
        'F'
      );

      doc.rect(
        margin,
        y + 6,
        tableWidth,
        5,
        'F'
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(
        'Earnings / Additions',
        margin + 4,
        y + 7
      );

      doc.text(
        'Amount ($)',
        margin + tableWidth - 4,
        y + 7,
        { align: 'right' }
      );

      let rowY = y + 21;

      const earningsRows = [
        ['Basic Salary', record.basic_salary],
        ['Allowances (Housing & Travel)', record.allowances],
        ['Performance Bonus', record.bonuses],
      ];

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');

      earningsRows.forEach(([label, amount]) => {
        doc.setTextColor(71, 85, 105);
        doc.text(String(label), margin + 4, rowY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(
          formatCurrency(Number(amount)).replace('$', ''),
          margin + tableWidth - 4,
          rowY,
          { align: 'right' }
        );

        doc.setFont('helvetica', 'normal');
        rowY += 10;
      });

      doc.setDrawColor(226, 232, 240);
      doc.line(
        margin + 4,
        rowY - 4,
        margin + tableWidth - 4,
        rowY - 4
      );

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(
        'Total Gross Earnings',
        margin + 4,
        rowY + 4
      );

      doc.setTextColor(5, 150, 105);
      doc.text(
        formatCurrency(grossSalary).replace('$', ''),
        margin + tableWidth - 4,
        rowY + 4,
        { align: 'right' }
      );

      /*
       * Deductions table
       */
      const rightX = margin + tableWidth + gap;

      drawRoundedBox(
        rightX,
        y,
        tableWidth,
        tableHeight,
        [255, 255, 255],
        [226, 232, 240]
      );

      doc.setFillColor(15, 23, 42);
      doc.roundedRect(
        rightX,
        y,
        tableWidth,
        11,
        3,
        3,
        'F'
      );

      doc.rect(
        rightX,
        y + 6,
        tableWidth,
        5,
        'F'
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(
        'Deductions & Taxes',
        rightX + 4,
        y + 7
      );

      doc.text(
        'Amount ($)',
        rightX + tableWidth - 4,
        y + 7,
        { align: 'right' }
      );

      rowY = y + 21;

      const deductionRows = [
        ['Statutory Income Tax', record.tax],
        ['Healthcare & Benefits Plan', record.deductions],
        ['Other Withholdings', 0],
      ];

      deductionRows.forEach(([label, amount], index) => {
        doc.setTextColor(
          index === 2 ? 148 : 71,
          index === 2 ? 163 : 85,
          index === 2 ? 184 : 105
        );

        doc.text(String(label), rightX + 4, rowY);

        doc.setFont('helvetica', index === 2 ? 'normal' : 'bold');
        doc.setTextColor(
          index === 2 ? 148 : 15,
          index === 2 ? 163 : 23,
          index === 2 ? 184 : 42
        );

        doc.text(
          formatCurrency(Number(amount)).replace('$', ''),
          rightX + tableWidth - 4,
          rowY,
          { align: 'right' }
        );

        rowY += 10;
      });

      doc.setDrawColor(226, 232, 240);
      doc.line(
        rightX + 4,
        rowY - 4,
        rightX + tableWidth - 4,
        rowY - 4
      );

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(
        'Total Deductions',
        rightX + 4,
        rowY + 4
      );

      doc.setTextColor(225, 29, 72);
      doc.text(
        formatCurrency(totalDeductions).replace('$', ''),
        rightX + tableWidth - 4,
        rowY + 4,
        { align: 'right' }
      );

      y += tableHeight + 10;

      /*
       * NET PAY
       */
      drawRoundedBox(
        margin,
        y,
        contentWidth,
        30,
        [15, 23, 42]
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(165, 180, 252);
      doc.text(
        'TOTAL NET COMPENSATION CREDITED',
        margin + 6,
        y + 10
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Calculated as (Gross Earnings) - (Total Deductions & Tax)',
        margin + 6,
        y + 17
      );

      doc.setFont('courier', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(
        formatCurrency(netSalary),
        pageWidth - margin - 6,
        y + 17,
        { align: 'right' }
      );

      y += 40;

      /*
       * DISCLAIMER
       */
      drawRoundedBox(
        margin,
        y,
        contentWidth,
        23,
        [248, 250, 252],
        [226, 232, 240]
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text(
        '✓',
        margin + 6,
        y + 9
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);

      const disclaimer =
        'This is a computer-generated payroll advice document from Dayflow HRMS ' +
        'and carries authorized cryptographic certification. No physical signature is required.';

      const disclaimerLines = doc.splitTextToSize(
        disclaimer,
        contentWidth - 18
      );

      doc.text(
        disclaimerLines,
        margin + 14,
        y + 8
      );

      /*
       * FOOTER
       */
      y += 34;

      doc.setDrawColor(226, 232, 240);
      doc.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);

      doc.text(
        'DAYFLOW HRMS • Official Payroll Statement',
        margin,
        y + 7
      );

      doc.text(
        `Generated for ${employeeName}`,
        pageWidth - margin,
        y + 7,
        { align: 'right' }
      );

      /*
       * Save actual PDF to the user's Downloads folder.
       */
      const safeEmployeeName = employeeName
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const safeMonth = record.pay_period_month
        .replace(/[^a-zA-Z0-9]/g, '');

      const fileName =
        `Payslip-${safeEmployeeName}-${safeMonth}-${record.pay_period_year}.pdf`;

      doc.save(fileName);

      info(
        'Payslip Downloaded',
        `${employeeName}'s payslip PDF has been downloaded successfully.`
      );
    } catch (err) {
      console.error('Payslip PDF generation failed:', err);

      error(
        'Download Failed',
        'Unable to generate the payslip PDF. Please try again.'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payslip Statement"
      subtitle={`Pay Period: ${record.pay_period_month} ${record.pay_period_year}`}
      maxWidth="2xl"
    >
      <div
        id="printable-payslip"
        className="space-y-6 text-xs bg-white p-2"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">
                DAYFLOW HRMS
              </h2>

              <p className="text-[11px] text-slate-500 font-medium">
                Enterprise Workforce & Payroll Management
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Statement Reference
            </span>

            <span className="font-mono font-bold text-slate-800 text-xs">
              PAY-{record.pay_period_year}-
              {record.pay_period_month.substring(0, 3).toUpperCase()}-
              {record.id.substring(record.id.length - 4)}
            </span>

            <div className="mt-1">
              <StatusBadge status={record.payment_status} />
            </div>
          </div>
        </div>

        {/* Employee & Payment Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Employee Name
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {record.employee?.full_name}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Employee ID
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.employee?.employee_id}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Department
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.employee?.department}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Designation
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.employee?.designation}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Pay Period
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.pay_period_month} {record.pay_period_year}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Payment Method
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.payment_method}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Disbursement Date
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {record.payment_date || 'Processed'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Employment Type
            </span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              Full Time Regular
            </span>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between font-bold">
              <span>Earnings / Additions</span>
              <span>Amount ($)</span>
            </div>

            <div className="p-4 space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Basic Salary</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(record.basic_salary)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Allowances (Housing & Travel)</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(record.allowances)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Performance Bonus</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(record.bonuses)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Gross Earnings</span>
                <span className="text-emerald-600">
                  {formatCurrency(grossSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between font-bold">
              <span>Deductions & Taxes</span>
              <span>Amount ($)</span>
            </div>

            <div className="p-4 space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Statutory Income Tax</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(record.tax)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Healthcare & Benefits Plan</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(record.deductions)}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 italic">
                <span>Other Withholdings</span>
                <span>$0.00</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Deductions</span>
                <span className="text-rose-600">
                  {formatCurrency(totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
              Total Net Compensation Credited
            </span>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Calculated as (Gross Earnings) - (Total Deductions & Tax)
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              {formatCurrency(netSalary)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />

          <p>
            This is a computer-generated payroll advice document from Dayflow
            HRMS and carries authorized cryptographic certification. No
            physical signature is required.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
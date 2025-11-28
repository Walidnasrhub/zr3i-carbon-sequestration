import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  farmName: string;
  farmerName: string;
  area: number;
  treeCount: number;
  averageAge: number;
  reportDate: Date;
  annualCO2: number;
  monthlyEarnings: number;
  totalCredits: number;
  verificationStatus: string;
  soilType: string;
  irrigationType: string;
}

export async function generatePDFReport(
  reportData: ReportData,
  elementId?: string
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Carbon Sequestration Report', 20, 25);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Farm Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Farm Information', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const farmInfo: Array<[string, string]> = [
    ['Farm Name:', reportData.farmName],
    ['Farmer Name:', reportData.farmerName],
    ['Farm Area:', `${reportData.area} hectares`],
    ['Number of Trees:', reportData.treeCount.toString()],
    ['Average Tree Age:', `${reportData.averageAge} years`],
    ['Soil Type:', reportData.soilType],
    ['Irrigation Type:', reportData.irrigationType],
    ['Report Date:', reportData.reportDate.toLocaleDateString()],
  ];

  for (const [label, value] of farmInfo) {
    doc.text(label, 20, yPosition);
    doc.text(value, 100, yPosition);
    yPosition += 8;
  }

  yPosition += 5;

  // Carbon Metrics Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Carbon Metrics', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const metrics: Array<[string, string]> = [
    ['Annual CO₂ Sequestration:', `${reportData.annualCO2.toFixed(2)} tons`],
    ['Monthly Earnings:', `$${reportData.monthlyEarnings.toFixed(2)}`],
    ['Total Carbon Credits:', reportData.totalCredits.toString()],
    ['Verification Status:', reportData.verificationStatus],
  ];

  for (const [label, value] of metrics) {
    doc.text(label, 20, yPosition);
    doc.text(value, 100, yPosition);
    yPosition += 8;
  }

  yPosition += 5;

  // Environmental Impact Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Environmental Impact Equivalents', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const equivalents: Array<[string, string]> = [
    ['Equivalent Trees Planted:', Math.round(reportData.annualCO2 * 16.67).toString()],
    ['Cars Taken Off Road (1 year):', Math.round(reportData.annualCO2 / 4.6).toString()],
    ['Homes Powered (1 year):', Math.round(reportData.annualCO2 / 4.74).toString()],
    ['Flights Mitigated (NY-LA):', Math.round(reportData.annualCO2 / 0.9).toString()],
  ];

  for (const [label, value] of equivalents) {
    doc.text(label, 20, yPosition);
    doc.text(value, 100, yPosition);
    yPosition += 8;
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} | Zr3i Carbon Sequestration Services`,
    20,
    pageHeight - 10
  );

  // Save the PDF
  doc.save(`Carbon_Report_${reportData.farmName}_${new Date().getFullYear()}.pdf`);
}

export async function generateHTMLReport(reportData: ReportData): Promise<string> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">Carbon Sequestration Report</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Zr3i Carbon Sequestration Services</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">Farm Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 40%;">Farm Name:</td>
            <td style="padding: 8px;">${reportData.farmName}</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <td style="padding: 8px; font-weight: bold;">Farmer Name:</td>
            <td style="padding: 8px;">${reportData.farmerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Farm Area:</td>
            <td style="padding: 8px;">${reportData.area} hectares</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <td style="padding: 8px; font-weight: bold;">Number of Trees:</td>
            <td style="padding: 8px;">${reportData.treeCount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Average Tree Age:</td>
            <td style="padding: 8px;">${reportData.averageAge} years</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <td style="padding: 8px; font-weight: bold;">Soil Type:</td>
            <td style="padding: 8px;">${reportData.soilType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Irrigation Type:</td>
            <td style="padding: 8px;">${reportData.irrigationType}</td>
          </tr>
          <tr style="background: #f1f5f9;">
            <td style="padding: 8px; font-weight: bold;">Report Date:</td>
            <td style="padding: 8px;">${reportData.reportDate.toLocaleDateString()}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">Carbon Metrics</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #666; font-size: 12px;">Annual CO₂ Sequestration</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #10b981;">${reportData.annualCO2.toFixed(2)} tons</p>
          </div>
          <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <p style="margin: 0; color: #666; font-size: 12px;">Monthly Earnings</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #06b6d4;">$${reportData.monthlyEarnings.toFixed(2)}</p>
          </div>
          <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0; color: #666; font-size: 12px;">Total Carbon Credits</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #8b5cf6;">${reportData.totalCredits}</p>
          </div>
          <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #666; font-size: 12px;">Verification Status</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #f59e0b;">${reportData.verificationStatus}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #0f172a; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">Environmental Impact</h2>
        <p style="color: #666; margin-bottom: 15px;">Your farm's annual CO₂ sequestration is equivalent to:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 10px; background: #f1f5f9; margin-bottom: 8px; border-radius: 4px;">
            <strong>${Math.round(reportData.annualCO2 * 16.67)}</strong> trees planted
          </li>
          <li style="padding: 10px; background: #f1f5f9; margin-bottom: 8px; border-radius: 4px;">
            <strong>${Math.round(reportData.annualCO2 / 4.6)}</strong> cars taken off the road for one year
          </li>
          <li style="padding: 10px; background: #f1f5f9; margin-bottom: 8px; border-radius: 4px;">
            <strong>${Math.round(reportData.annualCO2 / 4.74)}</strong> homes powered for one year
          </li>
          <li style="padding: 10px; background: #f1f5f9; margin-bottom: 8px; border-radius: 4px;">
            <strong>${Math.round(reportData.annualCO2 / 0.9)}</strong> transatlantic flights mitigated
          </li>
        </ul>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #999; font-size: 12px;">
        <p>Generated on ${new Date().toLocaleDateString()} | Zr3i Carbon Sequestration Services</p>
      </div>
    </div>
  `;
  return html;
}

export function generateCSVReport(reportData: ReportData[]): string {
  const headers = [
    'Farm Name',
    'Farmer Name',
    'Area (ha)',
    'Tree Count',
    'Avg Age (years)',
    'Annual CO₂ (tons)',
    'Monthly Earnings ($)',
    'Total Credits',
    'Verification Status',
    'Report Date',
  ];

  const rows = reportData.map((data) => [
    data.farmName,
    data.farmerName,
    data.area,
    data.treeCount,
    data.averageAge,
    data.annualCO2.toFixed(2),
    data.monthlyEarnings.toFixed(2),
    data.totalCredits,
    data.verificationStatus,
    data.reportDate.toLocaleDateString(),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csv;
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

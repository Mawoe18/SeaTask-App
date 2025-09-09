import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import fontkit from '@pdf-lib/fontkit';

interface AlcatelMaintenanceFormData {
  customerName: string;
  officeLocation: string;
  quarterYear: string;
  systemModel: string;
  release: string;
  maintenanceItems: Record<string, { equipped?: string; remark: string }>;
  systemApps: Record<string, string>;
  extensionLines: {
    voip: string;
    ipSoftphone: string;
    digital: string;
    analogue: string;
    connected: string;
    working: string;
    faulty: string;
    faultyNumbers: string;
    diagnosis: string;
  };
  hoursSpent: string;
  customerRepName: string;
  customerDate: string;
  customerPosition: string;
  seatecRepName: string;
  seatecDate: string;
  seatecPosition: string;
  customerSignature: string;
  seatecSignature: string;
}

export async function generateAlcatelMaintenancePDF(
  formData: AlcatelMaintenanceFormData,
  savePath: string
): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  // Load Calibri-like fonts
  const calibriFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const calibriBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Load custom font for logo
  let logoFont;
  try {
    const fontAsset = Asset.fromModule(require('../../assets/fonts/gill-sans-nova-heavy.ttf'));
    await fontAsset.downloadAsync();
    const fontUri = fontAsset.localUri;
    if (fontUri) {
      const fontBytes = await FileSystem.readAsStringAsync(fontUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fontUint8Array = Uint8Array.from(atob(fontBytes), c => c.charCodeAt(0));
      logoFont = await pdfDoc.embedFont(fontUint8Array);
      console.log('Custom font loaded successfully');
    } else {
      throw new Error('Font asset localUri is null');
    }
  } catch (error) {
    console.log('Custom font not available, using fallback:', error);
    logoFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  // Colors
  const primaryBlue = rgb(36 / 255, 131 / 255, 197 / 255);
  const blackColor = rgb(0, 0, 0);
  const borderColor = rgb(0.75, 0.75, 0.75);

  // Add company logo without "SINCE 1980"
  const logoText = "seatec";
  const logoSize = 36;
  const logoWidth = logoFont.widthOfTextAtSize(logoText, logoSize);
  const logoX = width - logoWidth - 50;

  page.drawText(logoText, {
    x: logoX,
    y: height - 45,
    size: logoSize,
    font: logoFont,
    color: primaryBlue,
  });

  // Set initial y position
  let y = height - 70;

  // Helper to draw dotted line
  const drawDottedLine = (startX: number, endX: number, yPos: number) => {
    const dotSpacing = 3;
    for (let x = startX; x < endX; x += dotSpacing * 2) {
      page.drawCircle({
        x: Math.min(x, endX - 1),
        y: yPos,
        size: 0.5,
        color: blackColor,
      });
    }
  };

  // Text wrapping function that returns line count with different widths for first and subsequent lines
  const wrapTextToFitLine = (text: string, font: any, fontSize: number, firstLineWidth: number, subsequentLineWidth: number): { lines: string[], count: number } => {
    const lines: string[] = [];
    const words = text.split(' ');
    let currentLine = '';
    let isFirstLine = true;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const maxWidth = isFirstLine ? firstLineWidth : subsequentLineWidth;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
          isFirstLine = false;
        } else {
          // Handle very long words that don't fit even on a single line
          let tempWord = word;
          while (tempWord.length > 0) {
            const currentMaxWidth = isFirstLine ? firstLineWidth : subsequentLineWidth;
            let i = tempWord.length;
            while (i > 0 && font.widthOfTextAtSize(tempWord.substring(0, i), fontSize) > currentMaxWidth) {
              i--;
            }
            lines.push(tempWord.substring(0, i));
            tempWord = tempWord.substring(i);
            isFirstLine = false;
          }
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return { lines, count: lines.length };
  };

  // Title - centered
  const title1 = "SERVICE AND ROUTINE MAINTENANCE PROCEDURE FORM";
  const title1Width = calibriBoldFont.widthOfTextAtSize(title1, 16);
  page.drawText(title1, { x: (width - title1Width) / 2, y, size: 16, font: calibriBoldFont, color: blackColor });
  y -= 20;

  const title2 = "[ALCATEL-LUCENT ENTERPRISE TELEPHONE SYSTEM]";
  const title2Width = calibriBoldFont.widthOfTextAtSize(title2, 14);
  page.drawText(title2, { x: (width - title2Width) / 2, y, size: 14, font: calibriBoldFont, color: blackColor });
  y -= 30;

  // Customer Information - no dotted lines, bold blue values
  page.drawText("CUSTOMER:", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.customerName || ''}`, { x: 135, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText("OFFICE LOC:", { x: width / 2 - 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.officeLocation || ''}`, { x: width / 2 + 25, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText("QUARTER:", { x: width - 150, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.quarterYear || ''}`, { x: width - 85, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 20;

  // System Model
  page.drawText("SYSTEM MODEL:", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(`[${formData.systemModel === 'OXO' ? 'X' : ' '}] OXO`, { x: 160, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(`[${formData.systemModel === 'OXE' ? 'X' : ' '}] OXE`, { x: 230, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText("RELEASE:", { x: 300, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.release || ''}`, { x: 370, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 25;

  // Pre-calculate wrapping for variable fields in Section B
  const faultyNumbersText = `ii) List of faulty Extension numbers: `;
  const faultyNumbersLabelWidth = calibriFont.widthOfTextAtSize(faultyNumbersText, 12);
  const faultyFirstLineWidth = width - 50 - (50 + faultyNumbersLabelWidth + 5);
  const faultySubsequentLineWidth = width - 50 - 50; // Full width from left margin to right margin
  const { lines: faultyLinesList, count: faultyLines } = wrapTextToFitLine(
    formData.extensionLines.faultyNumbers || '',
    calibriBoldFont,
    12,
    faultyFirstLineWidth,
    faultySubsequentLineWidth
  );

  const diagnosisText = `iii) Diagnosis Report: (Faulty Cabling / Faulty Phones): `;
  const diagnosisLabelWidth = calibriFont.widthOfTextAtSize(diagnosisText, 12);
  const diagnosisFirstLineWidth = width - 50 - (50 + diagnosisLabelWidth + 5);
  const diagnosisSubsequentLineWidth = width - 50 - 50; // Full width from left margin to right margin
  const { lines: diagnosisLinesList, count: diagnosisLines } = wrapTextToFitLine(
    formData.extensionLines.diagnosis || '',
    calibriBoldFont,
    12,
    diagnosisFirstLineWidth,
    diagnosisSubsequentLineWidth
  );

// Calculate extra lines from wrapping - improved logic
const nominalVariableLines = 1 + 1; // ii) 1 line, iii) 1 line (base)
const actualFaultyLines = Math.max(faultyLines, 1);
const actualDiagnosisLines = (formData.extensionLines.diagnosis && formData.extensionLines.diagnosis.trim()) ? 
  Math.max(diagnosisLines, 1) : 1; // Only 1 line if empty

const totalVariableLines = actualFaultyLines + actualDiagnosisLines;
let extra = totalVariableLines - nominalVariableLines;

// Decide min diagnosis lines based on content
let minDiagnosisLines = (formData.extensionLines.diagnosis && formData.extensionLines.diagnosis.trim()) ? 
  Math.max(diagnosisLines, 1) : 1; // Only minimum if there's content

// Adjust extra with effective min
extra = actualFaultyLines - 1 + minDiagnosisLines - 1;

// Decide spacing for fixed sections - tighter spacing to prevent overlap
let sectionSpacing = (extra > 2) ? 16 : (extra > 0) ? 17 : 18;

  // Section A
  page.drawText("A.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("ITEM    DESCRIPTION", { x: 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("REMARKS", { x: 480, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= 15;

  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= sectionSpacing;

  const maintenanceItems = [
    { id: 1, desc: "System Backup", hasEquipped: false },
    { id: 2, desc: "Switch off the system/Restart", hasEquipped: false },
    { id: 3, desc: "Remove, Clean, Re-assemble all Electronic Boards / Operator Console", hasEquipped: false },
    { id: 4, desc: "Test / Diagnosis of Phones", hasEquipped: false },
    { id: 5, desc: "Check Rectifier / Automatic Power Back-up", hasEquipped: false },
    { id: 6, desc: "Check condition of Power CPU Board", hasEquipped: false },
    { id: 7, desc: "Check condition of SIP trunk lines:", hasEquipped: true },
    { id: 8, desc: "Check condition of analogue trunk lines:", hasEquipped: true },
    { id: 9, desc: "Check condition of ISDN trunks (T0/T2):", hasEquipped: true },
    { id: 10, desc: "Check tie-line / Option Boards when applicable", hasEquipped: false },
    { id: 11, desc: "Check System Programming / Applications", hasEquipped: false },
  ];

  maintenanceItems.forEach(item => {
    const itemData = formData.maintenanceItems[`item_${item.id}`];
    const equipped = itemData?.equipped || '';
    const remark = mapRemark(itemData?.remark || '', item.id);
    const baseDesc = item.desc;
    page.drawText(`${item.id}.`, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
    let currentX = 70;
    const baseDescWidth = calibriFont.widthOfTextAtSize(baseDesc, 12);
    page.drawText(baseDesc, { x: currentX, y, size: 12, font: calibriFont, color: blackColor });
    currentX += baseDescWidth;
    if (item.hasEquipped) {
      const equippedLabel = " Equipped ";
      const equippedLabelWidth = calibriFont.widthOfTextAtSize(equippedLabel, 12);
      page.drawText(equippedLabel, { x: currentX, y, size: 12, font: calibriFont, color: blackColor });
      currentX += equippedLabelWidth;
      page.drawText(equipped, { x: currentX, y, size: 12, font: calibriBoldFont, color: primaryBlue });
      currentX += calibriBoldFont.widthOfTextAtSize(equipped, 12);
      page.drawText(".", { x: currentX, y, size: 12, font: calibriFont, color: blackColor });
    }
    page.drawText(remark, { x: 480, y, size: 12, font: calibriBoldFont, color: primaryBlue });
    y -= sectionSpacing;
  });
  y -= 10;

  // System Applications
  page.drawText("System Applications:", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= sectionSpacing;

  const systemAppsData = [
    { label: "I. Voice Mail Status", key: "voiceMail" },
    { label: "II. Call Accounting Status", key: "callAccounting" },
    { label: "III. Auto Attendant", key: "autoAttendant" },
    { label: "IV. Call Centre", key: "callCentre" },
  ];

  systemAppsData.forEach(app => {
    const remark = mapRemark(formData.systemApps[app.key]);
    page.drawText(app.label, { x: 70, y, size: 12, font: calibriFont, color: blackColor });
    page.drawText(remark, { x: 480, y, size: 12, font: calibriBoldFont, color: primaryBlue });
    y -= sectionSpacing;
  });
  y -= 20;

  // Section B
  page.drawText("B.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("Check Extension Lines Equipped:", { x: 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= 18;

  // First line with extension types - no dotted lines
  const voipText = `VoIP: `;
  page.drawText(voipText, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.voip || '', { x: 50 + calibriFont.widthOfTextAtSize(voipText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });

  const ipSoftText = `IP Softphones: `;
  page.drawText(ipSoftText, { x: 180, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.ipSoftphone || '', { x: 180 + calibriFont.widthOfTextAtSize(ipSoftText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });

  const digitalText = `Digital: `;
  page.drawText(digitalText, { x: 340, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.digital || '', { x: 340 + calibriFont.widthOfTextAtSize(digitalText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });

  const analogText = `Analog: `;
  page.drawText(analogText, { x: 450, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.analogue || '', { x: 450 + calibriFont.widthOfTextAtSize(analogText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 18;

  // Second line with Connected, Working, Faulty - no dotted lines
  const connectedText = `i) Connected: `;
  page.drawText(connectedText, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.connected || '', { x: 50 + calibriFont.widthOfTextAtSize(connectedText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });

  const workingText = `Working: `;
  page.drawText(workingText, { x: 200, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.working || '', { x: 200 + calibriFont.widthOfTextAtSize(workingText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });

  const faultyText = `Faulty: `;
  page.drawText(faultyText, { x: 350, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.extensionLines.faulty || '', { x: 350 + calibriFont.widthOfTextAtSize(faultyText, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 18;

  // Faulty extension numbers line - with dotted line and wrapping
  page.drawText(faultyNumbersText, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  drawDottedLine(50 + faultyNumbersLabelWidth + 5, width - 50, y - 5);
  let faultyY = y;
  faultyLinesList.forEach((line, index) => {
    if (index > 0) {
      faultyY -= 18; // Consistent line spacing
      drawDottedLine(50, width - 50, faultyY - 5);
    }
    page.drawText(line, { x: (index === 0 ? 50 + faultyNumbersLabelWidth + 5 : 50), y: faultyY, size: 12, font: calibriBoldFont, color: primaryBlue });
  });
  y = faultyY - 18;

  // Diagnosis Report line - with dotted lines and wrapping
  page.drawText(diagnosisText, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  drawDottedLine(50 + diagnosisLabelWidth + 5, width - 50, y - 5);
  let diagnosisY = y;

  // Only draw content lines if there's actual content
  if (diagnosisLinesList.length > 0 && formData.extensionLines.diagnosis && formData.extensionLines.diagnosis.trim()) {
    diagnosisLinesList.forEach((line, index) => {
      if (index > 0) {
        diagnosisY -= 18; // Consistent line spacing
        drawDottedLine(50, width - 50, diagnosisY - 5);
      }
      page.drawText(line, { x: (index === 0 ? 50 + diagnosisLabelWidth + 5 : 50), y: diagnosisY, size: 12, font: calibriBoldFont, color: primaryBlue });
    });

    // Only add extra lines if there's content and we need more space
    let currentDiagnosisLines = diagnosisLinesList.length;
    while (currentDiagnosisLines < minDiagnosisLines) {
      diagnosisY -= 18;
      drawDottedLine(50, width - 50, diagnosisY - 5);
      currentDiagnosisLines++;
    }
  }

  // Adjust spacing before Section C based on content
  const spacingBeforeC = (formData.extensionLines.diagnosis && formData.extensionLines.diagnosis.trim()) ? -18 : -15;
  y = diagnosisY + spacingBeforeC;

  // Add minimum required lines for diagnosis report
  let currentDiagnosisLines = diagnosisLinesList.length;
  while (currentDiagnosisLines < minDiagnosisLines) {
    diagnosisY -= 18;
    drawDottedLine(50, width - 50, diagnosisY - 5);
    currentDiagnosisLines++;
  }
  y = diagnosisY - 20;

  // Section C
  page.drawText("C.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(`Hours spent on the Job: `, { x: 70, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.hoursSpent || '', { x: 70 + calibriFont.widthOfTextAtSize(`Hours spent on the Job: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 25;

  // Calculate minimum required space for signatures section
  const signatureSectionHeight = 140; // Height needed for the entire signature section
  const footerHeight = 50; // Height for footer
  const minY = footerHeight + 10; // Minimum Y position above footer

  // Check if we need to adjust positioning
  if (y - signatureSectionHeight < minY) {
    // If content is too long, we might need a second page or adjust spacing
    console.warn('Content might overflow the page');
    y = Math.max(y, minY + signatureSectionHeight);
  }

  // Signatures section - ensure it doesn't overlap with footer
  const signatureY = Math.max(y - signatureSectionHeight, minY + signatureSectionHeight);
  y = signatureY;

  // Signatures
  page.drawText("D.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("CUSTOMER REPRESENTATIVE", { x: 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("E.", { x: width / 2 + 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("SEATEC REPRESENTATIVE", { x: width / 2 + 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= 20;

  page.drawText(`Date Commenced: `, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.customerDate || '', { x: 50 + calibriFont.widthOfTextAtSize(`Date Commenced: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText(`Date Completed: `, { x: width / 2 + 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.seatecDate || '', { x: width / 2 + 50 + calibriFont.widthOfTextAtSize(`Date Completed: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 15;

  page.drawText(`Full Name: `, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.customerRepName || '', { x: 50 + calibriFont.widthOfTextAtSize(`Full Name: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText(`Tech. Personnel(s): `, { x: width / 2 + 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.seatecRepName || '', { x: width / 2 + 50 + calibriFont.widthOfTextAtSize(`Tech. Personnel(s): `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 15;

  page.drawText(`Position: `, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.customerPosition || '', { x: 50 + calibriFont.widthOfTextAtSize(`Position: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText(`Position: `, { x: width / 2 + 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.seatecPosition || '', { x: width / 2 + 50 + calibriFont.widthOfTextAtSize(`Position: `, 12), y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 15;

  page.drawText(`Signed for Customer:`, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(`Signed for SEATEC:`, { x: width / 2 + 50, y, size: 12, font: calibriFont, color: blackColor });
  y -= 10;

  const containerWidth = 200;
  const containerHeight = 50;
  const customerContainerX = 50;
  const customerContainerY = y - containerHeight;
  const seatecContainerX = width / 2 + 50;
  const seatecContainerY = y - containerHeight;

  // page.drawLine({
  //   start: { x: customerContainerX, y: customerContainerY + 5 },
  //   end: { x: customerContainerX + containerWidth, y: customerContainerY + 5 },
  //   thickness: 1,
  //   color: blackColor,
  // });
  // page.drawLine({
  //   start: { x: seatecContainerX, y: customerContainerY + 5 },
  //   end: { x: seatecContainerX + containerWidth, y: customerContainerY + 5 },
  //   thickness: 1,
  //   color: blackColor,
  // });

  const drawSignatureInContainer = async (
    signatureData: string,
    containerX: number,
    containerY: number,
    containerWidth: number,
    containerHeight: number
  ) => {
    try {
      const base64Data = signatureData.replace(/^data:image\/[^;]+;base64,/, '');
      const signatureBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      let signatureImage;
      try {
        signatureImage = await pdfDoc.embedPng(signatureBytes);
      } catch (pngError) {
        try {
          signatureImage = await pdfDoc.embedJpg(signatureBytes);
        } catch (jpgError) {
          console.error('Could not embed signature as PNG or JPG:', jpgError);
          return;
        }
      }

      const availableWidth = containerWidth - 2;
      const availableHeight = containerHeight - 6;
      const aspectRatio = signatureImage.width / signatureImage.height;

      let sigWidth = availableWidth;
      let sigHeight = sigWidth / aspectRatio;

      if (sigHeight > availableHeight) {
        sigHeight = availableHeight;
        sigWidth = sigHeight * aspectRatio;
        if (sigWidth < availableWidth * 0.8) {
          sigWidth = availableWidth * 0.9;
        }
      }

      const signatureCenterX = containerX + (containerWidth / 2);
      const signatureX = signatureCenterX - (sigWidth / 2);
      const signatureYPos = containerY + (availableHeight / 2) + (sigHeight / 2) - 5;

      page.drawImage(signatureImage, {
        x: signatureX,
        y: signatureYPos - sigHeight,
        width: sigWidth,
        height: sigHeight,
        opacity: 1.0,
      });
    } catch (error) {
      console.error('Error embedding signature:', error);
    }
  };

  if (formData.customerSignature) {
    await drawSignatureInContainer(
      formData.customerSignature,
      customerContainerX,
      customerContainerY,
      containerWidth,
      containerHeight
    );
  }

  if (formData.seatecSignature) {
    await drawSignatureInContainer(
      formData.seatecSignature,
      seatecContainerX,
      seatecContainerY,
      containerWidth,
      containerHeight
    );
  }

  // Footer positioning - ensure it's at the bottom and doesn't overlap with content
  const actualFooterHeight = 40;
  const footerY = Math.max(customerContainerY - 20, actualFooterHeight);

  const footerText1 = "Empowering You to Win with IT";
  const footerWidth1 = calibriBoldFont.widthOfTextAtSize(footerText1, 10);
  page.drawText(footerText1, {
    x: (width - footerWidth1) / 2,
    y: footerY,
    size: 10,
    font: calibriBoldFont,
    color: primaryBlue,
  });

  const footerText2 = "IT Infrastructure Services | Business Software | Connectivity";
  const footerWidth2 = calibriBoldFont.widthOfTextAtSize(footerText2, 12);
  page.drawText(footerText2, {
    x: (width - footerWidth2) / 2,
    y: footerY - 12,
    size: 12,
    font: calibriBoldFont,
    color: primaryBlue,
  });

  const footerText3 = "info@seatectelecom.com; 0271441810; www.seatectelecom.com";
  const footerWidth3 = calibriFont.widthOfTextAtSize(footerText3, 9);
  page.drawText(footerText3, {
    x: (width - footerWidth3) / 2,
    y: footerY - 22,
    size: 9,
    font: calibriFont,
    color: primaryBlue,
  });

  const address = "Location: Plot No. A603, Heavy Industrial Area, Accra Road, Tema, Ghana ";
  const addressWidth = calibriFont.widthOfTextAtSize(address, 8);
  page.drawText(address, {
    x: (width - addressWidth) / 2,
    y: footerY - 30,
    size: 8,
    font: calibriFont,
    color: primaryBlue,
  });

  const base64Data = await pdfDoc.saveAsBase64();
  await FileSystem.writeAsStringAsync(savePath, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return savePath;
}

function mapRemark(value: string, itemId?: number): string {
  // For the first 4 items in Section A, use Done/Not Done
  if (itemId && itemId <= 4) {
    switch (value) {
      case 'done':
      case 'checked':
      case 'Checked':
        return 'Done';
      case 'not_done':
      case 'not_checked':
        return 'Not Done';
      case 'na':
        return 'N/A';
      default:
        return '';
    }
  }

  // For items 5-11 and System Applications, use the original mapping
  switch (value) {
    case 'done':
    case 'checked':
    case 'Checked':
      return 'Checked';
    case 'not_done':
    case 'not_checked':
      return 'Not Checked';
    case 'na':
      return 'N/A';
    default:
      return '';
  }
}

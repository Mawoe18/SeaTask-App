// cctvMaintenanceTemplate.tsx
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import fontkit from '@pdf-lib/fontkit';

interface CCTVMaintenanceFormData {
  customerName: string;
  officeLocation: string;
  periodType: string;
  subPeriod: string;
  year: string;
  cctvModel: string;
  maintenanceItems: Record<string, string>;
  addOnFeatures: Record<string, string>;
  cameraStatus: {
    poe: string;
    nonPoe: string;
    total: string;
    dome: { working: string; faulty: string; total: string };
    bullet: { working: string; faulty: string; total: string };
    ptz: { working: string; faulty: string; total: string };
    camera360: { working: string; faulty: string; total: string };
  };
  hoursSpent: string;
  specialRemarks: string;
  customerRepName: string;
  customerDate: string;
  customerPosition: string;
  seatecRepName: string;
  seatecDate: string;
  seatecPosition: string;
  customerSignature: string;
  seatecSignature: string;
}

export async function generateCCTVMaintenancePDF(
  formData: CCTVMaintenanceFormData,
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
    y: height - 65,
    size: logoSize,
    font: logoFont,
    color: primaryBlue,
  });

  // Set initial y position with increased space below logo
  let y = height - 80;

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

  const title2 = "CCTV SYSTEM";
  const title2Width = calibriBoldFont.widthOfTextAtSize(title2, 14);
  page.drawText(title2, { x: (width - title2Width) / 2, y, size: 14, font: calibriBoldFont, color: blackColor });
  y -= 25;

  // Customer Information - no dotted lines, bold blue values, increased spacing
  page.drawText("CUSTOMER:", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.customerName || ''}`, { x: 135, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText("OFFICE LOC:", { x: width / 2 - 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText(` ${formData.officeLocation || ''}`, { x: width / 2 + 25, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 20;

  // Period and CCTV Model on one line
  let periodX = 50;
  page.drawText("Period: ", { x: periodX, y, size: 12, font: calibriBoldFont, color: blackColor });
  periodX += calibriBoldFont.widthOfTextAtSize("Period: ", 12);
  page.drawText(`${formData.subPeriod || ''}, ${formData.periodType || ''}, ${formData.year || ''}`, { x: periodX, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  periodX += calibriBoldFont.widthOfTextAtSize(`${formData.subPeriod || ''}, ${formData.periodType || ''}, ${formData.year || ''}`, 12) + 30;
  page.drawText("CCTV Model: ", { x: periodX, y, size: 12, font: calibriBoldFont, color: blackColor });
  periodX += calibriBoldFont.widthOfTextAtSize("CCTV Model: ", 12);
  page.drawText(formData.cctvModel || '', { x: periodX, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 20;

  // Section A with reduced spacing
  page.drawText("A.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("ITEM    DESCRIPTION", { x: 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("REMARKS", { x: 480, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= 15;

  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15; // Reduced spacing

  const maintenanceItems = [
    { id: 1, desc: "Switch off whole system" },
    { id: 2, desc: "Disconnect and clean Hard disk" },
    { id: 3, desc: "Clean and re-assemble NVR" },
    { id: 4, desc: "Cleaning of cameras" },
    { id: 5, desc: "Check hard disk" },
    { id: 6, desc: "Check remote and mouse" },
    { id: 7, desc: "Check camera connections, angles and focus" },
    { id: 8, desc: "Check recording duration, resolution and streams" },
    { id: 9, desc: "Check VMS software – viewing and playback" },
    { id: 10, desc: "Check Internet connection to NVR" },
    { id: 11, desc: "Check PoE switch" },
    { id: 12, desc: "Check power backup" },
    { id: 13, desc: "Check add-on features" },
  ];

  const addOnFeatures = [
    { label: "Audio", key: "audio" },
    { label: "Pan, Tilt and zoom", key: "ptz" },
    { label: "Smart Analytics", key: "smartAnalytics" },
  ];

  maintenanceItems.forEach(item => {
    const remark = mapRemark(formData.maintenanceItems[`item_${item.id}`] || '', item.id);
    page.drawText(`${item.id}.`, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
    page.drawText(item.desc, { x: 70, y, size: 12, font: calibriFont, color: blackColor });
    page.drawText(remark, { x: 480, y, size: 12, font: calibriBoldFont, color: primaryBlue });

    if (item.id === 13) {
      y -= 15;
      addOnFeatures.forEach(feature => {
        const featureRemark = mapRemark(formData.addOnFeatures[feature.key] || '', item.id);
        page.drawText(`• ${feature.label}`, { x: 50, y, size: 12, font: calibriFont, color: blackColor });
        page.drawText(featureRemark, { x: 480, y, size: 12, font: calibriBoldFont, color: primaryBlue });
        y -= 15;
      });
    } else {
      y -= 15;
    }
  });
  y -= 10;

  // Section 14 - Connected Cameras, regular font
  page.drawText("14. Connected Cameras", { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  y -= 15;

  page.drawText("POE:", { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.cameraStatus.poe || '', { x: 100, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText("Non POE:", { x: 200, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.cameraStatus.nonPoe || '', { x: 270, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  page.drawText("Total:", { x: 370, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(formData.cameraStatus.total || '', { x: 420, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 15;

  // Camera Status Table - using the reference style (simple rectangle instead of rounded)
  const tableTopY = y;
  const colStarts = [50, 190, 308, 426, 544]; // Widths: 140, 118, 118, 118
  const rowHeight = 20;
  const numRows = 4; // 4 camera types
  const tableHeight = (numRows + 1) * rowHeight; // +1 for header
  const tableBottomY = tableTopY - tableHeight;

  // Draw the main table border as a simple rectangle
  const tableLeft = colStarts[0];
  const tableWidth = colStarts[4] - colStarts[0];
  
  page.drawRectangle({
    x: tableLeft,
    y: tableBottomY,
    width: tableWidth,
    height: tableHeight,
    borderColor: borderColor,
    borderWidth: 1,
  });

  // Draw internal vertical lines
  for (let i = 1; i < 4; i++) {
    page.drawLine({
      start: { x: colStarts[i], y: tableTopY },
      end: { x: colStarts[i], y: tableBottomY },
      thickness: 1,
      color: borderColor,
    });
  }

  // Draw internal horizontal lines
  let currentY = tableTopY - rowHeight;
  for (let i = 1; i <= numRows; i++) {
    page.drawLine({
      start: { x: tableLeft, y: currentY },
      end: { x: tableLeft + tableWidth, y: currentY },
      thickness: 1,
      color: borderColor,
    });
    currentY -= rowHeight;
  }

  // Draw header centered and moved down a little more
  y = tableTopY - (rowHeight / 2) - 1.5; // Moved down more to be contained in their boxes
  const headers = ["Camera Type", "Working", "Faulty", "Total"];
  headers.forEach((header, i) => {
    const textWidth = calibriBoldFont.widthOfTextAtSize(header, 12);
    const colWidth = colStarts[i + 1] - colStarts[i];
    const textX = colStarts[i] + (colWidth - textWidth) / 2;
    page.drawText(header, { x: textX, y, size: 12, font: calibriBoldFont, color: blackColor });
  });

  // Draw rows centered
  y -= rowHeight;
  const cameraTypes = [
    { name: "Dome Camera", data: formData.cameraStatus.dome },
    { name: "Bullet Camera", data: formData.cameraStatus.bullet },
    { name: "PTZ Camera", data: formData.cameraStatus.ptz },
    { name: "360 Camera", data: formData.cameraStatus.camera360 },
  ];

  cameraTypes.forEach(camera => {
    y -= rowHeight / 2 - 2; // Adjust for centering
    let cellTexts = [camera.name, camera.data.working || '', camera.data.faulty || '', camera.data.total || ''];
    cellTexts.forEach((text, i) => {
      const textWidth = calibriBoldFont.widthOfTextAtSize(text, 12);
      const colWidth = colStarts[i + 1] - colStarts[i];
      const textX = colStarts[i] + (colWidth - textWidth) / 2;
      const color = i === 0 ? blackColor : primaryBlue;
      const fontToUse = i === 0 ? calibriFont : calibriBoldFont;
      page.drawText(text, { x: textX, y, size: 12, font: fontToUse, color });
    });
    y -= rowHeight / 2 + 2;
  });
  y = tableBottomY - 25;

  // Hours Spent - Fixed: Answer bolded and shifted to the left
  page.drawText("15. Hours spent on the Job:", { x: 50, y, size: 12, font: calibriFont, color: blackColor });
  page.drawText(` ${formData.hoursSpent || ''}`, { x: 215, y, size: 12, font: calibriBoldFont, color: primaryBlue });
  y -= 25;

  // Special Remarks with wrapping - FIXED VERSION
  const remarksText = "B. Any Special Remarks:";
  page.drawText(remarksText, { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  
  const remarksLabelWidth = calibriBoldFont.widthOfTextAtSize(remarksText, 12);
  const remarksFirstLineWidth = width - 50 - (50 + remarksLabelWidth + 5);
  const remarksSubsequentLineWidth = width - 50 - 50;

  // Check if special remarks is empty or just whitespace
  const specialRemarksContent = (formData.specialRemarks || '').trim();
  
  if (!specialRemarksContent) {
    // Case 2: Empty remarks - show "NA" with only one dotted line
    const naText = "NA";
    const naStartX = 50 + remarksLabelWidth + 5;
    
    // Draw the dotted line starting after the semicolon
    drawDottedLine(naStartX, width - 50, y - 5);
    
    // Draw "NA" text
    page.drawText(naText, { 
      x: naStartX, 
      y: y, 
      size: 12, 
      font: calibriBoldFont, 
      color: primaryBlue 
    });
    
    y -= 15; // Move down for one line only
  } else {
    // Case 1: Has content - wrap text and draw dotted lines starting after semicolon
    const { lines: remarksLinesList, count: remarksLines } = wrapTextToFitLine(
      specialRemarksContent,
      calibriBoldFont,
      12,
      remarksFirstLineWidth,
      remarksSubsequentLineWidth
    );

    let remarksY = y; // Start at the same Y position as the question
    remarksLinesList.forEach((line, index) => {
      if (index === 0) {
        // First line: dotted line starts after the semicolon
        const firstLineStartX = 50 + remarksLabelWidth + 5;
        drawDottedLine(firstLineStartX, width - 50, remarksY - 5);
        page.drawText(line, { 
          x: firstLineStartX, 
          y: remarksY, 
          size: 12, 
          font: calibriBoldFont, 
          color: primaryBlue 
        });
      } else {
        // Subsequent lines: dotted line starts from the beginning (x: 50)
        drawDottedLine(50, width - 50, remarksY - 5);
        page.drawText(line, { 
          x: 50, 
          y: remarksY, 
          size: 12, 
          font: calibriBoldFont, 
          color: primaryBlue 
        });
      }
      remarksY -= 15;
    });

    // Limit to 2 lines total - add empty dotted lines if needed
    let currentRemarksLines = remarksLinesList.length;
    while (currentRemarksLines < 2) {
      drawDottedLine(50, width - 50, remarksY - 5);
      remarksY -= 15;
      currentRemarksLines++;
    }
    
    y = remarksY;
  }
  
  y -= 5; // Small gap after remarks section

  // Signatures section
  page.drawText("D.", { x: 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("CUSTOMER REPRESENTATIVE", { x: 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("E.", { x: width / 2 + 50, y, size: 12, font: calibriBoldFont, color: blackColor });
  page.drawText("SEATEC REPRESENTATIVE", { x: width / 2 + 70, y, size: 12, font: calibriBoldFont, color: blackColor });
  y -= 15;

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
  const footerHeight = 50;
  const minSpaceAboveFooter = 15;
  const signatureBottomY = customerContainerY;
  
  let footerY = Math.max(signatureBottomY - minSpaceAboveFooter - footerHeight, 45);
  
  if (footerY < 45) {
    footerY = 45;
  }

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

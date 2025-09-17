import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import fontkit from '@pdf-lib/fontkit';

interface WorkOrderFormData {
  customerName: string;
  equipmentModel: string;
  customModel: string;
  location: string;
  natureComplaint: string;
  customComplaint: string;
  workDone1: string;
  workDone2: string;
  workDone3: string;
  workDone4: string;
  representativeName: string;
  representativePosition: string;
  hoursSpent: string;
  repDate: string;
  techPersonnel1: string;
  techPersonnel2: string;
  techPersonnel3: string;
  material1: string;
  material2: string;
  material3: string;
  material4: string;
  customerRemarks: string;
  custRepName: string;
  custRepPosition: string;
  custRepContact: string;
  custRepDate: string;
  signature: string;
}

export async function generateWorkOrderPDF(
  formData: WorkOrderFormData, 
  savePath: string
): Promise<string> {
  try {
    console.log('[PDF] Starting PDF generation');
    
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    
    // Load Calibri-like fonts for content (using Helvetica as fallback)
    const calibriFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const calibriBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Load custom font for logo - using same approach as Alcatel template
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

    // Add company logo - without "SINCE 1980" like in Alcatel template
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

    // Track total lines used for dynamic space management
    let totalLinesUsed = 0;

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

    // Text wrapping function that returns line count
    const wrapTextToFitLine = (text: string, font: any, fontSize: number, maxWidth: number): { lines: string[], count: number } => {
      const lines: string[] = [];
      const words = text.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            let tempWord = word;
            while (tempWord.length > 0) {
              let i = tempWord.length;
              while (i > 0 && font.widthOfTextAtSize(tempWord.substring(0, i), fontSize) > maxWidth) {
                i--;
              }
              lines.push(tempWord.substring(0, i));
              tempWord = tempWord.substring(i);
            }
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return { lines, count: lines.length };
    };

    // Helper to draw field with line counting
    const drawField = (label: string, value: string | null = null, useInputColor: boolean = true): number => {
      const labelText = `${label}:`;
      const labelWidth = calibriFont.widthOfTextAtSize(labelText, 12);
      
      page.drawText(labelText, {
        x: 50,
        y,
        size: 12,
        font: calibriFont,
        color: blackColor
      });

      const underlineStartX = 50 + labelWidth + 5;
      const underlineEndX = width - 50;
      const availableWidth = underlineEndX - underlineStartX - 10;
      
      drawDottedLine(underlineStartX, underlineEndX, y - 5);

      let lineCount = 1;
      if (value) {
        const { lines } = wrapTextToFitLine(value, calibriBoldFont, 12, availableWidth);
        lineCount = lines.length;
        lines.forEach((line, index) => {
          if (index === 0) {
            page.drawText(line, {
              x: underlineStartX + 5,
              y,
              size: 12,
              font: useInputColor ? calibriBoldFont : calibriFont,
              color: useInputColor ? primaryBlue : blackColor
            });
          } else {
            y -= 20;
            drawDottedLine(50, underlineEndX, y - 5);
            page.drawText(line, {
              x: 50,
              y,
              size: 12,
              font: useInputColor ? calibriBoldFont : calibriFont,
              color: useInputColor ? primaryBlue : blackColor
            });
          }
        });
      }

      y -= 20;
      totalLinesUsed += lineCount;
      return lineCount;
    };

    // Title
    const titleText = "CUSTOMER'S WORK ORDER FORM";
    page.drawText(titleText, {
      x: 50,
      y,
      size: 18,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 30;
    totalLinesUsed += 2; // Approximate for title and spacing

    // Customer Information Section
    drawField("NAME OF CUSTOMER", formData.customerName);
    const equipmentModel = formData.equipmentModel === 'Other' 
      ? formData.customModel 
      : formData.equipmentModel;
    drawField("EQUIPMENT MODEL", equipmentModel);
    drawField("LOCATION", formData.location);
    y -= 15;
    totalLinesUsed += 1; // For spacing

    // Nature of Complaint Section
    page.drawText("NATURE OF COMPLAINT", {
      x: 50,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 15;
    totalLinesUsed += 1;

    const complaintLineWidth = width - 100;
    let complaintLinesUsed = 0;
    
    const complaint = formData.natureComplaint === 'Other' 
      ? formData.customComplaint 
      : formData.natureComplaint;
    
    if (complaint) {
      const { lines, count } = wrapTextToFitLine(complaint, calibriBoldFont, 12, complaintLineWidth);
      complaintLinesUsed = count;
      lines.forEach(line => {
        drawDottedLine(50, width - 50, y - 5);
        page.drawText(line, {
          x: 50,
          y,
          size: 12,
          font: calibriBoldFont,
          color: primaryBlue
        });
        y -= 20;
      });
      if (count < 2) {
        drawDottedLine(50, width - 50, y - 5);
        y -= 20;
        complaintLinesUsed++;
      }
    } else {
      for (let i = 0; i < 2; i++) {
        drawDottedLine(50, width - 50, y - 5);
        y -= 20;
        complaintLinesUsed++;
      }
    }
    totalLinesUsed += complaintLinesUsed;
    y -= 10;
    totalLinesUsed += 1;

    // Nature of Work Done Section
    page.drawText("NATURE OF WORK DONE", {
      x: 50,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 15;
    totalLinesUsed += 1;

    const workItems = [
      formData.workDone1,
      formData.workDone2,
      formData.workDone3,
      formData.workDone4
    ].filter(item => item); // Filter out empty items

    const workItemLineWidth = width - 120;
    let workLinesUsed = 0;
    let workItemNumber = 1;

    workItems.forEach((item) => {
      const { lines, count } = wrapTextToFitLine(item, calibriBoldFont, 12, workItemLineWidth);
      workLinesUsed += count;
      lines.forEach((line, lineIndex) => {
        if (lineIndex === 0) {
          page.drawText(`${workItemNumber}.`, {
            x: 50,
            y,
            size: 12,
            font: calibriFont,
            color: blackColor
          });
          page.drawText(line, {
            x: 70,
            y,
            size: 12,
            font: calibriBoldFont,
            color: primaryBlue
          });
        } else {
          page.drawText(line, {
            x: 70,
            y,
            size: 12,
            font: calibriBoldFont,
            color: primaryBlue
          });
        }
        drawDottedLine(70, width - 50, y - 5);
        y -= 20;
      });
      workItemNumber++;
    });

    // Add empty lines only if needed
    const minWorkLines = 5;
    while (workLinesUsed < minWorkLines && workItemNumber <= minWorkLines) {
      page.drawText(`${workItemNumber}.`, {
        x: 50,
        y,
        size: 12,
        font: calibriFont,
        color: blackColor
      });
      drawDottedLine(70, width - 50, y - 5);
      y -= 20;
      workLinesUsed++;
      workItemNumber++;
    }
    totalLinesUsed += workLinesUsed;
    y -= 15;
    totalLinesUsed += 1;

    // SEATEC Representative Section
    page.drawText("SEATEC'S REPRESENTATIVE", {
      x: 50,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 20;
    totalLinesUsed += 1;

    drawField("FULL NAME", formData.representativeName);
    drawField("POSITION", formData.representativePosition);
    drawField("HOURS SPENT ON JOB", formData.hoursSpent);
    drawField("DATE", formData.repDate);
    y -= 18;
    totalLinesUsed += 1;

    // Other Technical Personnel and Materials Used
    const leftX = 50;
    const rightX = width / 2 + 20;
    const columnWidth = (width / 2) - 80;

    page.drawText("OTHER TECHNICAL PERSONNEL:", {
      x: leftX,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });

    page.drawText("MATERIALS USED:", {
      x: rightX,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 15;
    totalLinesUsed += 1;

    const techPersonnel = [
      formData.techPersonnel1,
      formData.techPersonnel2,
      formData.techPersonnel3
    ].filter(p => p);

    let materials = [
      formData.material1,
      formData.material2,
      formData.material3
    ];
    if (formData.material4) materials.push(formData.material4);
    materials = materials.filter(m => m);

    let techPersonnelLinesUsed = 0;
    let materialsLinesUsed = 0;
    const maxRows = Math.max(3, techPersonnel.length, materials.length);

    for (let i = 0; i < maxRows; i++) {
      const currentY = y;
      let maxLinesThisRow = 1;

      if (i < techPersonnel.length) {
        page.drawText(`${i + 1}.`, {
          x: leftX,
          y: currentY,
          size: 12,
          font: calibriFont,
          color: blackColor
        });
        const { lines, count } = wrapTextToFitLine(techPersonnel[i], calibriBoldFont, 12, columnWidth - 30);
        techPersonnelLinesUsed += count;
        lines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: leftX + 20,
            y: currentY - (lineIndex * 20),
            size: 12,
            font: calibriBoldFont,
            color: primaryBlue
          });
          maxLinesThisRow = Math.max(maxLinesThisRow, count);
        });
        drawDottedLine(leftX + 20, rightX - 30, currentY - 5);
      }

      if (i < materials.length) {
        page.drawText(`${i + 1}.`, {
          x: rightX,
          y: currentY,
          size: 12,
          font: calibriFont,
          color: blackColor
        });
        const { lines, count } = wrapTextToFitLine(materials[i], calibriBoldFont, 12, columnWidth - 30);
        materialsLinesUsed += count;
        lines.forEach((line, lineIndex) => {
          page.drawText(line, {
            x: rightX + 20,
            y: currentY - (lineIndex * 20),
            size: 12,
            font: calibriBoldFont,
            color: primaryBlue
          });
          maxLinesThisRow = Math.max(maxLinesThisRow, count);
        });
        drawDottedLine(rightX + 20, width - 50, currentY - 5);
      }

      for (let j = 1; j < maxLinesThisRow; j++) {
        if (i < techPersonnel.length) {
          drawDottedLine(leftX + 20, rightX - 30, currentY - 5 - (j * 20));
        }
        if (i < materials.length) {
          drawDottedLine(rightX + 20, width - 50, currentY - 5 - (j * 20));
        }
      }

      y -= (maxLinesThisRow * 20);
      totalLinesUsed += maxLinesThisRow;
    }

    y -= 10;
    totalLinesUsed += 1;

    // Customer Remarks Section
    page.drawText("CUSTOMER'S REMARKS:", {
      x: 50,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 15;
    totalLinesUsed += 1;

    const remarksLineWidth = width - 100;
    let remarksLinesUsed = 0;

    if (formData.customerRemarks) {
      const { lines, count } = wrapTextToFitLine(formData.customerRemarks, calibriBoldFont, 12, remarksLineWidth);
      remarksLinesUsed = count;
      lines.forEach(line => {
        drawDottedLine(50, width - 50, y - 5);
        page.drawText(line, {
          x: 50,
          y,
          size: 12,
          font: calibriBoldFont,
          color: primaryBlue
        });
        y -= 20;
      });
    }

    // Add empty lines only if needed
    const minRemarksLines = 3;
    while (remarksLinesUsed < minRemarksLines) {
      drawDottedLine(50, width - 50, y - 5);
      y -= 20;
      remarksLinesUsed++;
    }
    totalLinesUsed += remarksLinesUsed;

    // Customer Representative Section
    page.drawText("CUSTOMER REPRESENTATIVE", {
      x: 50,
      y,
      size: 12,
      font: calibriBoldFont,
      color: blackColor
    });
    y -= 15;
    totalLinesUsed += 1;

    drawField("FULL NAME", formData.custRepName);
    drawField("POSITION", formData.custRepPosition);
    drawField("CONTACT", formData.custRepContact);
    y -= 10;
    totalLinesUsed += 1;

    // Dynamic Space Adjustment
    const SIGNATURE_Y_OFFSET = 120; // Adjustable signature position - increase to move signature up
    const signatureY = SIGNATURE_Y_OFFSET; // Fixed signature position
    const minYBeforeSignature = signatureY + 50; // Ensure space for signature container
    const availableLines = Math.floor((y - minYBeforeSignature) / 20);
    const extraLines = totalLinesUsed - (Math.floor((height - 70 - minYBeforeSignature) / 20));

    if (extraLines > 0 && availableLines < extraLines) {
      // Reclaim unused lines from Nature of Work Done
      const unusedWorkLines = minWorkLines - workItems.length;
      if (unusedWorkLines > 0) {
        const linesToRemove = Math.min(unusedWorkLines, extraLines);
        workLinesUsed -= linesToRemove;
        totalLinesUsed -= linesToRemove;
        y -= linesToRemove * 20; // Adjust y to reflect removed lines
      }

      // Reclaim unused lines from Customer Remarks
      const unusedRemarksLines = minRemarksLines - (formData.customerRemarks ? wrapTextToFitLine(formData.customerRemarks, calibriBoldFont, 12, remarksLineWidth).count : 0);
      if (unusedRemarksLines > 0) {
        const linesToRemove = Math.min(unusedRemarksLines, extraLines - (minWorkLines - workLinesUsed));
        remarksLinesUsed -= linesToRemove;
        totalLinesUsed -= linesToRemove;
        y -= linesToRemove * 20;
      }

      // Reduce spacing if still needed
      if (totalLinesUsed > (height - 70 - minYBeforeSignature) / 20) {
        const reduceSpacingSections = [
          "Customer Information",
          "Nature of Complaint",
          "Nature of Work Done",
          "SEATEC Representative",
          "Other Technical Personnel/Materials",
          "Customer Remarks",
          "Customer Representative"
        ];
        const spacingReduction = 5; // Reduce from 20 to 15
        reduceSpacingSections.forEach(section => {
          y -= spacingReduction;
          totalLinesUsed -= 0.25; // Approximate line reduction
        });
      }
    }

    // Ensure y doesn't go below signature
    if (y < minYBeforeSignature) {
      y = minYBeforeSignature;
    }

    // Signature Section - Updated to match Alcatel template style
    const signatureContainerWidth = 200;
    const signatureContainerHeight = 50;
    const signatureContainerX = 150;
    const signatureContainerY = signatureY - signatureContainerHeight;

    const dateStartX = 450;
    const dateEndX = width - 50;

    page.drawText("SIGNATURE:", {
      x: 50,
      y: signatureY,
      size: 12,
      font: calibriFont,
      color: blackColor
    });

    page.drawText("DATE:", {
      x: 400,
      y: signatureY,
      size: 12,
      font: calibriFont,
      color: blackColor
    });

    drawDottedLine(dateStartX, dateEndX, signatureY - 5);

    if (formData.custRepDate) {
      page.drawText(formData.custRepDate, {
        x: dateStartX + 5,
        y: signatureY,
        size: 12,
        font: calibriBoldFont,
        color: primaryBlue
      });
    }

    // Helper function to draw signature in container - matching Alcatel template approach
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

    if (formData.signature) {
      try {
        console.log('[PDF] Processing signature image');
        await drawSignatureInContainer(
          formData.signature,
          signatureContainerX,
          signatureContainerY,
          signatureContainerWidth,
          signatureContainerHeight
        );
        console.log('[PDF] Signature added successfully');
      } catch (error) {
        console.error('[PDF] Error embedding signature:', error);
      }
    }

    // Footer
    const footerY = 45;
    
    const footerText1 = "Empowering You to Win with IT";
    const footerWidth1 = calibriBoldFont.widthOfTextAtSize(footerText1, 10);
    page.drawText(footerText1, {
      x: (width - footerWidth1) / 2,
      y: footerY,
      size: 10,
      font: calibriBoldFont,
      color: primaryBlue
    });

    const footerText2 = "IT Infrastructure Services | Business Software | Connectivity";
    const footerWidth2 = calibriBoldFont.widthOfTextAtSize(footerText2, 12);
    page.drawText(footerText2, {
      x: (width - footerWidth2) / 2,
      y: footerY - 12,
      size: 12,
      font: calibriBoldFont,
      color: primaryBlue
    });

    const footerText3 = "info@seatectelecom.com; 0271441810; www.seatectelecom.com";
    const footerWidth3 = calibriFont.widthOfTextAtSize(footerText3, 9);
    page.drawText(footerText3, {
      x: (width - footerWidth3) / 2,
      y: footerY - 22,
      size: 9,
      font: calibriFont,
      color: primaryBlue
    });

    const address = "Location: Plot No. A603, Heavy Industrial Area, Accra Road, Tema, Ghana";
    const addressWidth = calibriFont.widthOfTextAtSize(address, 8);
    page.drawText(address, {
      x: (width - addressWidth) / 2,
      y: footerY - 30,
      size: 8,
      font: calibriFont,
      color: primaryBlue
    });

    // Save to Expo's document directory
    console.log('[PDF] Saving PDF to:', savePath);
    const base64Data = await pdfDoc.saveAsBase64();
    await FileSystem.writeAsStringAsync(savePath, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('[PDF] PDF generation completed successfully');
    return savePath;
    
  } catch (error) {
    console.error('[PDF] PDF generation failed:', error);
    throw error;
  }
}

// Helper function for backward compatibility
function splitTextIntoLines(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// uccMaintenanceTemplate.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import fontkit from '@pdf-lib/fontkit';
import { UCCFormData } from '../../app/maintenance/UCCForm'; // Adjust path as needed

export async function generateUCCMaintenancePDF(
  formData: UCCFormData,
  savePath: string
): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  let page = pdfDoc.addPage([595, 842]); // A4 size
  let currentPageNumber = 1;
  const { width, height } = page.getSize();
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Load custom font for logo if available
  let logoFont = helveticaBold; // Fallback
  try {
    const fontAsset = Asset.fromModule(require('../../assets/fonts/gill-sans-nova-heavy.ttf'));
    await fontAsset.downloadAsync();
    const fontUri = fontAsset.localUri;
    if (fontUri) {
      const fontBytes = await FileSystem.readAsStringAsync(fontUri, { encoding: FileSystem.EncodingType.Base64 });
      const fontUint8Array = Uint8Array.from(atob(fontBytes), c => c.charCodeAt(0));
      logoFont = await pdfDoc.embedFont(fontUint8Array);
    }
  } catch (error) {
    console.log('Custom font not loaded, using fallback:', error);
  }

  // Colors
  const blackColor = rgb(0, 0, 0);
  const primaryBlue = rgb(36 / 255, 131 / 255, 197 / 255);
  const borderColor = rgb(0.75, 0.75, 0.75);

  // Helper function for dotted lines
  const drawDottedLine = (page: any, startX: number, endX: number, yPos: number, color = blackColor) => {
    const dotSpacing = 3;
    for (let x = startX; x < endX; x += dotSpacing * 2) {
      page.drawCircle({
        x: Math.min(x, endX - 1),
        y: yPos - 5,
        size: 0.5,
        color,
      });
    }
  };

  // Helper for wrapping text with different widths for first and subsequent lines
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
          // Handle very long words
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

  // Helper to add new page if needed and draw header/footer
  const addNewPageIfNeeded = (requiredHeight: number, margin = 80) => {
    if (y - requiredHeight < margin) {
      drawFooter(page, height);
      page = pdfDoc.addPage([595, 842]);
      currentPageNumber++;
      y = height - 60; // Only logo, no title on subsequent pages
      drawSubsequentPageLogo(page, width, height);
    }
  };

  // Draw header with logo and title (first page only)
  const drawHeader = (page: any, width: number, height: number) => {
    // Logo positioned higher up
    const logoText = "seatec";
    const logoSize = 36;
    const logoWidth = logoFont.widthOfTextAtSize(logoText, logoSize);
    const logoX = width - logoWidth - 50;
    page.drawText(logoText, { x: logoX, y: height - 45, size: logoSize, font: logoFont, color: primaryBlue });

    // Title - only on first page
    let titleY = height - 70;
    const titleLines = [
      'SERVICE AND ROUTINE MAINTENANCE PROCEDURE FORM',
      '[ALCATEL-LUCENT ENTERPRISE WIRED / WIRELESS NETWORK,',
      'IP SURVEILLANCE, CONFERENCE ROOM AUDIO VISUAL/P.A. AND DSTV SYSTEMS]'
    ];
    titleLines.forEach((line, index) => {
      const size = index === 0 ? 14 : 12;
      const fontToUse = index === 0 ? helveticaBold : helvetica;
      const textWidth = fontToUse.widthOfTextAtSize(line, size);
      page.drawText(line, { x: (width - textWidth) / 2, y: titleY, size, font: fontToUse, color: blackColor });
      titleY -= size + 5;
    });
  };

  // Draw only logo on subsequent pages
  const drawSubsequentPageLogo = (page: any, width: number, height: number) => {
    const logoText = "seatec";
    const logoSize = 36;
    const logoWidth = logoFont.widthOfTextAtSize(logoText, logoSize);
    const logoX = width - logoWidth - 50;
    page.drawText(logoText, { x: logoX, y: height - 45, size: logoSize, font: logoFont, color: primaryBlue });
  };

  // Draw footer
  const drawFooter = (page: any, height: number) => {
    const footerY = 30; // Reduced footer height
    const footerText1 = "Empowering You to Win with IT";
    const footerWidth1 = helveticaBold.widthOfTextAtSize(footerText1, 10);
    page.drawText(footerText1, {
      x: (width - footerWidth1) / 2,
      y: footerY + 15,
      size: 10,
      font: helveticaBold,
      color: primaryBlue,
    });

    const footerText2 = "IT Infrastructure Services | Business Software | Connectivity";
    const footerWidth2 = helveticaBold.widthOfTextAtSize(footerText2, 10);
    page.drawText(footerText2, {
      x: (width - footerWidth2) / 2,
      y: footerY,
      size: 10,
      font: helveticaBold,
      color: primaryBlue,
    });

    const footerText3 = "info@seatectelecom.com; 0271441810; www.seatectelecom.com";
    const footerWidth3 = helvetica.widthOfTextAtSize(footerText3, 9);
    page.drawText(footerText3, {
      x: (width - footerWidth3) / 2,
      y: footerY - 12,
      size: 9,
      font: helvetica,
      color: primaryBlue,
    });

    const address = "Location: Plot No. A603, Heavy Industrial Area, Accra Road, Tema, Ghana";
    const addressWidth = helvetica.widthOfTextAtSize(address, 8);
    page.drawText(address, {
      x: (width - addressWidth) / 2,
      y: footerY - 22,
      size: 8,
      font: helvetica,
      color: primaryBlue,
    });
  };

  // Initial header on first page
  drawHeader(page, width, height);
  let y = height - 140; // Adjusted starting y position

  // Customer info - no overlaps, proper spacing
  addNewPageIfNeeded(20);
  page.drawText('CUSTOMER:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText(` ${formData.customerName || ''}`, { x: 135, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('OFFICE LOC.:', { x: width / 2 - 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText(` ${formData.officeLocation || ''}`, { x: width / 2 + 25, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('PERIOD:', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText(` ${formData.subPeriod || ''} ${formData.periodType || ''}, ${formData.year || ''}`, { x: width - 85, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 25;

  // Maintenance Frequency
  addNewPageIfNeeded(20);
  page.drawText('MAINTENANCE FREQUENCY: ', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  const freqStartX = 50 + helveticaBold.widthOfTextAtSize('MAINTENANCE FREQUENCY: ', 12);
  page.drawText('MONTHLY ', { x: freqStartX, y, size: 12, font: helvetica, color: blackColor });
  page.drawRectangle({ x: freqStartX + 55, y: y + 1, width: 10, height: 10, borderWidth: 1, borderColor: blackColor });
  if (formData.periodType === 'Monthly') page.drawText('X', { x: freqStartX + 58, y: y + 1, size: 10, font: helveticaBold, color: blackColor });
  
  const quarterlyStartX = freqStartX + 90;
  page.drawText('QUARTERLY ', { x: quarterlyStartX, y, size: 12, font: helvetica, color: blackColor });
  page.drawRectangle({ x: quarterlyStartX + 65, y: y + 1, width: 10, height: 10, borderWidth: 1, borderColor: blackColor });
  if (formData.periodType === 'Quarterly') page.drawText('X', { x: quarterlyStartX + 68, y: y + 1, size: 10, font: helveticaBold, color: blackColor });
  
  const biannualStartX = quarterlyStartX + 100;
  page.drawText('BI-ANNUAL ', { x: biannualStartX, y, size: 12, font: helvetica, color: blackColor });
  page.drawRectangle({ x: biannualStartX + 65, y: y + 1, width: 10, height: 10, borderWidth: 1, borderColor: blackColor });
  if (formData.periodType === 'Bi-annual') page.drawText('X', { x: biannualStartX + 68, y: y + 1, size: 10, font: helveticaBold, color: blackColor });
  y -= 25;

  // Section A: LAN/WAN Infrastructure
  addNewPageIfNeeded(20);
  page.drawText('SECTION A: LAN/WAN INFRASTRUCTURE', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 20;

  // Table header for Section A
  page.drawText('COMPONENT', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 150, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  // Section A tasks with proper content and spacing
  const sectionATasksList = [
    { component: 'Core Switch', desc: 'Check LED indicators for port/link/activity status', remark: formData.sectionATasks?.coreSwitch || '' },
    { component: 'Access Switches', desc: 'Check all network switches for uptime, port activity, and temperature', remark: formData.sectionATasks?.accessSwitches || '' },
    { component: 'Wired Data Points', desc: 'Test connectivity on random data points', remark: formData.sectionATasks?.wiredDataPoints || '' },
    { component: 'Patch Panels', desc: 'Check for error/discard packets on interfaces', remark: formData.sectionATasks?.patchPanels || '' },
    { component: 'Network Cabinets', desc: 'Clean ports, air vents and fans for dust or oxidation', remark: formData.sectionATasks?.networkCabinets || '' },
    { component: 'Wi-Fi Access Points', desc: 'Check Wi-Fi signal coverage and performance', remark: formData.sectionATasks?.wifiAccessPoints || '' },
    { component: 'Rack Management', desc: 'Ensure proper labeling and cable management in rack', remark: formData.sectionATasks?.rackManagement || '' },
    { component: 'System Upgrade Checks', desc: 'Check for firmware updates or patching needs', remark: formData.sectionATasks?.systemUpgrade || '' },
    { component: '', desc: 'Inspect Mounting and Cabling for Physical Integrity', remark: formData.sectionATasks?.physicalIntegrity || '' }
  ];

  sectionATasksList.forEach((task, index) => {
    addNewPageIfNeeded(15);
    
    // Component column - bold
    page.drawText(task.component, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    
    // Description column - bold
    page.drawText(task.desc, { x: 150, y, size: 12, font: helveticaBold, color: blackColor });
    
    // Status/Remarks column - direct from formData, bold blue
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    
    y -= 12; // Reduced spacing between content
  });

  y -= 20;

  // Network totals - with dotted lines and proper formatting
  addNewPageIfNeeded(40);
  page.drawText('Total No. of Wired Data Ports:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 250, 300, y);
  page.drawText(formData.networkStatus?.wiredPorts?.total || '', { x: 250, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Working:', { x: 310, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 370, 420, y);
  page.drawText(formData.networkStatus?.wiredPorts?.working || '', { x: 370, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Faulty:', { x: 430, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 480, width - 50, y);
  page.drawText(formData.networkStatus?.wiredPorts?.faulty || '', { x: 480, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 18;

  addNewPageIfNeeded(20);
  page.drawText('Total No. of Wireless Access Point:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 270, 320, y);
  page.drawText(formData.networkStatus?.wirelessAP?.total || '', { x: 270, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Working:', { x: 330, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 390, 440, y);
  page.drawText(formData.networkStatus?.wirelessAP?.working || '', { x: 390, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Faulty:', { x: 450, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 500, width - 50, y);
  page.drawText(formData.networkStatus?.wirelessAP?.faulty || '', { x: 500, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 25;

  // Section B: CCTV - IP Surveillance System
  addNewPageIfNeeded(20);
  page.drawText('SECTION B: CCTV - IP SURVEILLANCE SYSTEM', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 20;

  // NVR subsection
  addNewPageIfNeeded(20);
  page.drawText('NVR', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for NVR
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const nvrTasks = [
    { desc: 'Verify recording for all camera channels', remark: formData.sectionBTasks?.nvrRecording || '' },
    { desc: 'Check Disk(s) health and available storage space', remark: formData.sectionBTasks?.nvrDiskHealth || '' },
    { desc: 'Confirm date/time synchronization', remark: formData.sectionBTasks?.nvrDateSync || '' },
    { desc: 'Update firmware and backup configuration', remark: formData.sectionBTasks?.nvrFirmware || '' },
    { desc: 'Clean fan and inspect for overheating', remark: formData.sectionBTasks?.nvrCleanFan || '' },
  ];

  nvrTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // IP Cameras subsection
  addNewPageIfNeeded(20);
  page.drawText('IP Cameras', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for IP Cameras
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const ipCameraTasks = [
    { desc: 'Check live video feed and Image clarity', remark: formData.sectionBTasks?.ipLiveFeed || '' },
    { desc: 'Clean camera lens and check for obstructions', remark: formData.sectionBTasks?.ipCleanLens || '' },
    { desc: 'Inspect Cabling and RJ45 connectors', remark: formData.sectionBTasks?.ipInspectCabling || '' },
    { desc: 'Confirm motion detection or event triggers', remark: formData.sectionBTasks?.ipMotionDetection || '' },
    { desc: 'Validate PoE functionality or power supply status', remark: formData.sectionBTasks?.ipPoe || '' },
  ];

  ipCameraTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Camera totals
  addNewPageIfNeeded(20);
  page.drawText('Total No. of IP Camera: Dome:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 220, 270, y);
  page.drawText(formData.cameraStatus?.dome || '', { x: 220, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Bullet:', { x: 280, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 340, 390, y);
  page.drawText(formData.cameraStatus?.bullet || '', { x: 340, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('PTZ:', { x: 400, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 440, 490, y);
  page.drawText(formData.cameraStatus?.ptz || '', { x: 440, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 18;

  addNewPageIfNeeded(20);
  page.drawText('Working:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 100, 150, y);
  page.drawText(formData.cameraStatus?.working || '', { x: 100, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Faulty:', { x: 160, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 210, 260, y);
  page.drawText(formData.cameraStatus?.faulty || '', { x: 210, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 25;

  // Disk totals
  addNewPageIfNeeded(20);
  page.drawText('Total No. of Disk Storage: HDD:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 220, 270, y);
  page.drawText(formData.diskStatus?.hdd || '', { x: 220, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('SSD:', { x: 280, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 320, 370, y);
  page.drawText(formData.diskStatus?.ssd || '', { x: 320, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Working:', { x: 380, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 440, 490, y);
  page.drawText(formData.diskStatus?.working || '', { x: 440, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Faulty:', { x: 500, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 560, width - 50, y);
  page.drawText(formData.diskStatus?.faulty || '', { x: 560, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 25;

  // Section C: DSTV System
  addNewPageIfNeeded(20);
  page.drawText('SECTION C: DSTV SYSTEM (Decoders, Dish, Cabling)', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 20;

  // DSTV Dish subsection
  addNewPageIfNeeded(20);
  page.drawText('DSTV Dish', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for DSTV Dish
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const dstvDishTasks = [
    { desc: 'Inspect alignment and mounting stability', remark: formData.sectionCTasks?.dstvAlignment || '' },
    { desc: 'Clean surface and check for rust or corrosion', remark: formData.sectionCTasks?.dstvCleanSurface || '' },
    { desc: 'Inspect dish alignment and LNB', remark: formData.sectionCTasks?.dstvInspectLNB || '' },
  ];

  dstvDishTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Decoder subsection
  addNewPageIfNeeded(20);
  page.drawText('Decoder', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Decoder
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const decoderTasks = [
    { desc: 'Confirm decoder is booting and operating correctly', remark: formData.sectionCTasks?.decoderBooting || '' },
    { desc: 'Confirm all channels are accessible and decoder responsive', remark: formData.sectionCTasks?.decoderChannels || '' },
    { desc: 'Check for firmware updates and signal quality', remark: formData.sectionCTasks?.decoderFirmware || '' },
    { desc: 'Inspect HDMI/AV output and remote-control functionality', remark: formData.sectionCTasks?.decoderHdmi || '' },
  ];

  decoderTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Cabling subsection
  addNewPageIfNeeded(20);
  page.drawText('Cabling', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Cabling
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const cablingTasks = [
    { desc: 'Inspect coaxial connections and F-connectors', remark: formData.sectionCTasks?.cablingCoaxial || '' },
    { desc: 'Check for water ingress or wear on exposed cabling', remark: formData.sectionCTasks?.cablingWaterIngress || '' },
  ];

  cablingTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Decoder totals
  addNewPageIfNeeded(20);
  page.drawText('Total No. of Decoder:', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 200, 250, y);
  page.drawText(formData.decoderStatus?.total || '', { x: 200, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Working:', { x: 260, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 320, 370, y);
  page.drawText(formData.decoderStatus?.working || '', { x: 320, y, size: 12, font: helveticaBold, color: primaryBlue });
  
  page.drawText('Faulty:', { x: 380, y, size: 12, font: helveticaBold, color: blackColor });
  drawDottedLine(page, 440, width - 50, y);
  page.drawText(formData.decoderStatus?.faulty || '', { x: 440, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 25;

  // Section D: Conference Room AV System
  addNewPageIfNeeded(20);
  page.drawText('SECTION D: CONFERENCE ROOM AV SYSTEM (Audio, Display, Control System – for 3 Rooms)', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 20;

  // Display System subsection
  addNewPageIfNeeded(20);
  page.drawText('Display System', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Display System
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const displayTasks = [
    { desc: 'Test screen/projector Image clarity and brightness', remark: formData.sectionDTasks?.displayClarity || '' },
    { desc: 'Test display projection/TV functionality', remark: formData.sectionDTasks?.displayFunctionality || '' },
    { desc: 'Check input sources (HDMI, VGA, Wireless Casting)', remark: formData.sectionDTasks?.displayInputs || '' },
    { desc: 'Test video conferencing platform (Zoom, Teams, etc.)', remark: formData.sectionDTasks?.displayVC || '' },
    { desc: 'Clean display surface and filters', remark: formData.sectionDTasks?.displayClean || '' },
  ];

  displayTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Audio System subsection
  addNewPageIfNeeded(20);
  page.drawText('Audio System', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Audio System
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const audioTasks = [
    { desc: 'Check microphones (wired/wireless)', remark: formData.sectionDTasks?.audioMics || '' },
    { desc: 'Inspect microphone and speaker performance', remark: formData.sectionDTasks?.audioPerformance || '' },
    { desc: 'Test ceiling/panel speakers and mixer levels', remark: formData.sectionDTasks?.audioSpeakers || '' },
    { desc: 'Verify DSP processing and mute controls', remark: formData.sectionDTasks?.audioDsp || '' },
  ];

  audioTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Control System subsection
  addNewPageIfNeeded(20);
  page.drawText('Control System', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Control System
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const controlTasks = [
    { desc: 'Verify control panel or touchpad functions properly', remark: formData.sectionDTasks?.controlPanel || '' },
    { desc: 'Test touch panel or remote-control interface', remark: formData.sectionDTasks?.controlTouch || '' },
    { desc: 'Confirm programmed presets and switching automation', remark: formData.sectionDTasks?.controlPresets || '' },
    { desc: 'Validate network connectivity (IP-based Control)', remark: formData.sectionDTasks?.controlNetwork || '' },
  ];

  controlTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 20;

  // Connectivity subsection
  addNewPageIfNeeded(20);
  page.drawText('Connectivity', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;

  // Table header for Connectivity
  page.drawText('MAINTENANCE TASK DESCRIPTION', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('STATUS / REMARKS', { x: width - 150, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 15;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: borderColor });
  y -= 15;

  const connectivityTasks = [
    { desc: 'Check all input ports and connectivity with laptops', remark: formData.sectionDTasks?.connectPorts || '' },
    { desc: 'Test conference call systems (VC platforms, USB integration)', remark: formData.sectionDTasks?.connectCallSystems || '' },
    { desc: 'Inspect cabling and patch points (HD-BaseT, Audio links)', remark: formData.sectionDTasks?.connectCabling || '' },
    { desc: 'Confirm firmware is up to date on all equipment', remark: formData.sectionDTasks?.connectFirmware || '' },
  ];

  connectivityTasks.forEach((task, index) => {
    addNewPageIfNeeded(15);
    page.drawText(task.desc, { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
    drawDottedLine(page, width - 150, width - 50, y);
    const remarkText = task.remark || '';
    page.drawText(remarkText, { x: width - 150, y, size: 12, font: helveticaBold, color: primaryBlue });
    y -= 12;
  });

  y -= 25;

  // Pre-calculate wrapping for diagnosis report like in Alcatel template
  const diagnosisText = `Diagnosis Report (Faulty Cabling / Faulty Device): `;
  const diagnosisLabelWidth = helvetica.widthOfTextAtSize(diagnosisText, 12);
  const diagnosisFirstLineWidth = width - 50 - (50 + diagnosisLabelWidth + 5);
  const diagnosisSubsequentLineWidth = width - 50 - 50;
  const { lines: diagnosisLinesList } = wrapTextToFitLine(
    formData.diagnosisReport || '',
    helveticaBold,
    12,
    diagnosisFirstLineWidth,
    diagnosisSubsequentLineWidth
  );

  // Diagnosis Report with proper wrapping
  addNewPageIfNeeded(40);
  page.drawText(diagnosisText, { x: 50, y, size: 12, font: helvetica, color: blackColor });
  drawDottedLine(page, 50 + diagnosisLabelWidth + 5, width - 50, y);
  let diagnosisY = y;

  diagnosisLinesList.forEach((line, index) => {
    if (index > 0) {
      diagnosisY -= 18;
      drawDottedLine(page, 50, width - 50, diagnosisY);
    }
    page.drawText(line, { x: (index === 0 ? 50 + diagnosisLabelWidth + 5 : 50), y: diagnosisY, size: 12, font: helveticaBold, color: primaryBlue });
  });
  y = diagnosisY - 25;

  // Hours spent
  addNewPageIfNeeded(20);
  page.drawText('Hours spent on the Job:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  const hoursX = 50 + helvetica.widthOfTextAtSize('Hours spent on the Job:', 12) + 5;
  drawDottedLine(page, hoursX, width - 50, y);
  page.drawText(formData.hoursSpent || '', { x: hoursX, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 40;

  // Signatures section - following Alcatel template pattern
  addNewPageIfNeeded(150);
  page.drawText('E.', { x: 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('CUSTOMER REPRESENTATIVE', { x: 70, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('F.', { x: width / 2 + 50, y, size: 12, font: helveticaBold, color: blackColor });
  page.drawText('SEATEC REPRESENTATIVE', { x: width / 2 + 70, y, size: 12, font: helveticaBold, color: blackColor });
  y -= 20;

  page.drawText('Date Commenced:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.customerDate || '', { x: 50 + helvetica.widthOfTextAtSize('Date Commenced:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });

  page.drawText('Date Completed:', { x: width / 2 + 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.seatecDate || '', { x: width / 2 + 50 + helvetica.widthOfTextAtSize('Date Completed:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 15;

  page.drawText('Full Name:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.customerRepName || '', { x: 50 + helvetica.widthOfTextAtSize('Full Name:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });

  page.drawText('Tech. Personnel(s):', { x: width / 2 + 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.seatecRepName || '', { x: width / 2 + 50 + helvetica.widthOfTextAtSize('Tech. Personnel(s):', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 15;

  page.drawText('Position:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.customerPosition || '', { x: 50 + helvetica.widthOfTextAtSize('Position:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });

  page.drawText('Position:', { x: width / 2 + 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.seatecPosition || '', { x: width / 2 + 50 + helvetica.widthOfTextAtSize('Position:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });
  y -= 15;

  page.drawText('Signed for Customer:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  drawDottedLine(page, 170, width / 2 - 50, y);
  page.drawText('Signed for SEATEC:', { x: width / 2 + 50, y, size: 12, font: helvetica, color: blackColor });
  drawDottedLine(page, width / 2 + 160, width - 50, y);
  y -= 10;

  // Signature containers
  const containerWidth = 200;
  const containerHeight = 50;
  const customerContainerX = 50;
  const customerContainerY = y - containerHeight;
  const seatecContainerX = width / 2 + 50;
  const seatecContainerY = y - containerHeight;

  if (formData.customerSignature) {
    await drawSignatureInContainer(
      pdfDoc,
      page,
      formData.customerSignature,
      customerContainerX,
      customerContainerY,
      containerWidth,
      containerHeight
    );
  }

  if (formData.seatecSignature) {
    await drawSignatureInContainer(
      pdfDoc,
      page,
      formData.seatecSignature,
      seatecContainerX,
      seatecContainerY,
      containerWidth,
      containerHeight
    );
  }

  y = customerContainerY - 20;

  page.drawText('Contact:', { x: 50, y, size: 12, font: helvetica, color: blackColor });
  page.drawText(formData.customerContact || '', { x: 50 + helvetica.widthOfTextAtSize('Contact:', 12) + 5, y, size: 12, font: helveticaBold, color: primaryBlue });

  // Draw footer on last page
  drawFooter(page, height);

  const base64 = await pdfDoc.saveAsBase64();
  await FileSystem.writeAsStringAsync(savePath, base64, { encoding: FileSystem.EncodingType.Base64 });
  return savePath;
}

async function drawSignatureInContainer(pdfDoc: PDFDocument, page: any, signatureData: string, containerX: number, containerY: number, containerWidth: number, containerHeight: number) {
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
        console.error('Could not embed signature:', jpgError);
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
}

function mapRemark(value: string): string {
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
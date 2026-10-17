import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Linking, Platform } from 'react-native';
import QRCodeGenerator from 'qrcode';
import { CustomizationOptions, EyeStyle, LogoPreset, ModuleShape } from '@/types/qr';

export type ExportFormat = 'png' | 'svg' | 'pdf';

export interface QRExportOptions {
  qrRef?: React.RefObject<any>;
  payloadValue?: string;
  typeLabel?: string;
  fgColor?: string;
  bgColor?: string;
  presetId?: string;
  options?: CustomizationOptions;
}

export interface ExportResult {
  success: boolean;
  message: string;
  fileUri?: string;
}

export interface SVGExportOptions {
  fgColor?: string;
  bgColor?: string;
  moduleShape?: ModuleShape;
  eyeStyle?: EyeStyle;
  logo?: LogoPreset;
  size?: number;
  quietZone?: number;
}

/**
 * Creates a fully styled, authentic SVG markup string matching the live QR Code
 */
export function generateSVGContent(
  payloadValue: string,
  options?: SVGExportOptions
): string {
  const safePayload = payloadValue || 'https://qrlab.me';
  const fgColor = options?.fgColor || '#1E2A38';
  const bgColor = options?.bgColor || '#FFFFFF';
  const moduleShape = options?.moduleShape || 'rounded';
  const eyeStyle = options?.eyeStyle || 'rounded';
  const logo = options?.logo || 'none';
  const hasLogo = logo && logo !== 'none';
  const ecl = hasLogo ? 'H' : 'M';

  let qrData: any = null;
  try {
    const qr = QRCodeGenerator.create(safePayload, { errorCorrectionLevel: ecl });
    qrData = qr.modules;
  } catch {
    const fallbackQr = QRCodeGenerator.create('https://qrlab.me', { errorCorrectionLevel: 'M' });
    qrData = fallbackQr.modules;
  }

  const numModules = qrData?.size || 25;
  const cellSize = 12;
  const qrSize = numModules * cellSize;
  const quietZone = options?.quietZone ?? 24;
  const totalSize = qrSize + quietZone * 2;

  const logoSize = hasLogo ? qrSize * 0.22 : 0;
  const logoMargin = 4;
  const logoTotalSize = logoSize + logoMargin * 2;
  const logoModules = hasLogo ? Math.ceil(logoTotalSize / cellSize) : 0;
  const centerModule = Math.floor(numModules / 2);
  const logoStart = centerModule - Math.floor(logoModules / 2);
  const logoEnd = logoStart + logoModules - 1;

  const isEye = (r: number, c: number) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= numModules - 7) return true;
    if (r >= numModules - 7 && c < 7) return true;
    return false;
  };

  const isLogo = (r: number, c: number) => {
    if (!hasLogo) return false;
    return r >= logoStart && r <= logoEnd && c >= logoStart && c <= logoEnd;
  };

  const elements: string[] = [];

  // 1. Data Modules
  for (let r = 0; r < numModules; r++) {
    for (let c = 0; c < numModules; c++) {
      if (isEye(r, c) || isLogo(r, c)) continue;
      if (qrData.data[r * numModules + c] !== 1) continue;

      const x = quietZone + c * cellSize;
      const y = quietZone + r * cellSize;

      if (moduleShape === 'dots') {
        elements.push(
          `<circle cx="${(x + cellSize / 2).toFixed(2)}" cy="${(y + cellSize / 2).toFixed(2)}" r="${(cellSize * 0.44).toFixed(2)}" fill="${fgColor}"/>`
        );
      } else if (moduleShape === 'rounded') {
        elements.push(
          `<rect x="${(x + cellSize * 0.05).toFixed(2)}" y="${(y + cellSize * 0.05).toFixed(2)}" width="${(cellSize * 0.9).toFixed(2)}" height="${(cellSize * 0.9).toFixed(2)}" rx="${(cellSize * 0.35).toFixed(2)}" ry="${(cellSize * 0.35).toFixed(2)}" fill="${fgColor}"/>`
        );
      } else {
        elements.push(
          `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellSize + 0.1).toFixed(2)}" height="${(cellSize + 0.1).toFixed(2)}" fill="${fgColor}"/>`
        );
      }
    }
  }

  // 2. Eyes (Finder Patterns)
  const renderEye = (r0: number, c0: number) => {
    const x = quietZone + c0 * cellSize;
    const y = quietZone + r0 * cellSize;
    const eyeSize = 7 * cellSize;

    if (eyeStyle === 'circle') {
      return [
        `<circle cx="${(x + eyeSize / 2).toFixed(2)}" cy="${(y + eyeSize / 2).toFixed(2)}" r="${(eyeSize / 2).toFixed(2)}" fill="${fgColor}"/>`,
        `<circle cx="${(x + eyeSize / 2).toFixed(2)}" cy="${(y + eyeSize / 2).toFixed(2)}" r="${((5 * cellSize) / 2).toFixed(2)}" fill="${bgColor}"/>`,
        `<circle cx="${(x + eyeSize / 2).toFixed(2)}" cy="${(y + eyeSize / 2).toFixed(2)}" r="${((3 * cellSize) / 2).toFixed(2)}" fill="${fgColor}"/>`,
      ].join('\n    ');
    } else if (eyeStyle === 'rounded') {
      return [
        `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${eyeSize.toFixed(2)}" height="${eyeSize.toFixed(2)}" rx="${(cellSize * 2.2).toFixed(2)}" ry="${(cellSize * 2.2).toFixed(2)}" fill="${fgColor}"/>`,
        `<rect x="${(x + cellSize).toFixed(2)}" y="${(y + cellSize).toFixed(2)}" width="${(5 * cellSize).toFixed(2)}" height="${(5 * cellSize).toFixed(2)}" rx="${(cellSize * 1.5).toFixed(2)}" ry="${(cellSize * 1.5).toFixed(2)}" fill="${bgColor}"/>`,
        `<rect x="${(x + 2 * cellSize).toFixed(2)}" y="${(y + 2 * cellSize).toFixed(2)}" width="${(3 * cellSize).toFixed(2)}" height="${(3 * cellSize).toFixed(2)}" rx="${(cellSize * 1.0).toFixed(2)}" ry="${(cellSize * 1.0).toFixed(2)}" fill="${fgColor}"/>`,
      ].join('\n    ');
    } else {
      return [
        `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${eyeSize.toFixed(2)}" height="${eyeSize.toFixed(2)}" fill="${fgColor}"/>`,
        `<rect x="${(x + cellSize).toFixed(2)}" y="${(y + cellSize).toFixed(2)}" width="${(5 * cellSize).toFixed(2)}" height="${(5 * cellSize).toFixed(2)}" fill="${bgColor}"/>`,
        `<rect x="${(x + 2 * cellSize).toFixed(2)}" y="${(y + 2 * cellSize).toFixed(2)}" width="${(3 * cellSize).toFixed(2)}" height="${(3 * cellSize).toFixed(2)}" fill="${fgColor}"/>`,
      ].join('\n    ');
    }
  };

  const eyes = [
    renderEye(0, 0),
    renderEye(0, numModules - 7),
    renderEye(numModules - 7, 0),
  ];

  // 3. Center Badge Logo
  let logoMarkup = '';
  if (hasLogo) {
    const logoX = quietZone + (qrSize - logoSize) / 2;
    const logoY = quietZone + (qrSize - logoSize) / 2;
    const bgX = logoX - logoMargin;
    const bgY = logoY - logoMargin;
    const bgSize = logoSize + logoMargin * 2;
    const iconScale = (logoSize * 0.65) / 24;
    const iconOffset = (logoSize - logoSize * 0.65) / 2;

    let vectorPath = '';
    if (logo === 'star') {
      vectorPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
    } else if (logo === 'shield') {
      vectorPath = 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z';
    } else if (logo === 'heart') {
      vectorPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
    } else {
      // 'qrlab', 'qrstudio' or default
      vectorPath = 'M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm0 5h3v3h-3v-3zm-5-5h3v8h-3v-8z';
    }

    logoMarkup = `
  <g id="qr-center-logo">
    <rect x="${bgX.toFixed(2)}" y="${bgY.toFixed(2)}" width="${bgSize.toFixed(2)}" height="${bgSize.toFixed(2)}" rx="8" ry="8" fill="${bgColor}" stroke="${fgColor}" stroke-opacity="0.15" stroke-width="1"/>
    <g transform="translate(${(logoX + iconOffset).toFixed(2)}, ${(logoY + iconOffset).toFixed(2)}) scale(${iconScale.toFixed(4)})">
      <path d="${vectorPath}" fill="${fgColor}"/>
    </g>
  </g>`;
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%">`,
    '  <!-- QRLab Authentic Vector Export -->',
    `  <rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" rx="16"/>`,
    '  <g id="qr-eyes">',
    `    ${eyes.join('\n    ')}`,
    '  </g>',
    '  <g id="qr-modules">',
    `    ${elements.join('\n    ')}`,
    '  </g>',
    logoMarkup,
    '</svg>',
  ].join('\n');
}

/**
 * Converts an SVG string into a high-resolution base64 PNG in browser environments
 */
export function svgToPNGWeb(
  svgString: string,
  size: number = 1024,
  bgColor: string = '#FFFFFF'
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window context is required for canvas conversion.'));
    }

    const img = new window.Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          return reject(new Error('Failed to get 2D canvas context'));
        }

        // Draw solid background so pixels are never transparent/black
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl.replace(/^data:image\/png;base64,/, ''));
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Extracts base64 encoded PNG data with guaranteed solid white background
 */
export async function getQRBase64(
  qrRef?: React.RefObject<any>,
  exportOptions?: {
    payloadValue?: string;
    fgColor?: string;
    bgColor?: string;
    moduleShape?: ModuleShape;
    eyeStyle?: EyeStyle;
    logo?: LogoPreset;
  }
): Promise<string> {
  const payloadValue = exportOptions?.payloadValue || 'https://qrlab.me';
  const fgColor = exportOptions?.fgColor || '#1E2A38';
  const bgColor = exportOptions?.bgColor || '#FFFFFF';

  // 1. On Web, generate ultra-high-resolution PNG from vector SVG with canvas
  if (Platform.OS === 'web') {
    try {
      const svg = generateSVGContent(payloadValue, {
        fgColor,
        bgColor,
        moduleShape: exportOptions?.moduleShape || 'rounded',
        eyeStyle: exportOptions?.eyeStyle || 'rounded',
        logo: exportOptions?.logo || 'none',
      });
      return await svgToPNGWeb(svg, 1024, bgColor);
    } catch {
      // Fallback to qrcode package
      return new Promise((resolve, reject) => {
        QRCodeGenerator.toDataURL(
          payloadValue,
          {
            color: { dark: fgColor, light: bgColor },
            width: 1024,
            margin: 2,
          },
          (err, url) => {
            if (err || !url) return reject(err || new Error('Failed to generate PNG'));
            resolve(url.replace(/^data:image\/png;base64,/, ''));
          }
        );
      });
    }
  }

  // 2. On Native, try Svg ref first (which has solid backgroundColor)
  if (qrRef?.current && typeof qrRef.current.toDataURL === 'function') {
    try {
      const data = await new Promise<string>((resolve, reject) => {
        qrRef.current.toDataURL((b64: string) => {
          if (b64) {
            resolve(b64.replace(/^data:image\/png;base64,/, ''));
          } else {
            reject(new Error('Empty PNG returned from native SVG ref'));
          }
        });
      });
      return data;
    } catch {
      // Fallback if native ref capture fails
    }
  }

  // 3. Native fallback: pure JS QRCodeGenerator with solid light background
  return new Promise((resolve, reject) => {
    QRCodeGenerator.toDataURL(
      payloadValue,
      {
        color: { dark: fgColor, light: bgColor },
        width: 1024,
        margin: 2,
      },
      (err, url) => {
        if (err || !url) return reject(err || new Error('Failed to export QR PNG data'));
        resolve(url.replace(/^data:image\/png;base64,/, ''));
      }
    );
  });
}

/**
 * Saves base64 PNG or text content to a temporary cache file on native device
 */
export async function writeTempFile(
  content: string,
  filename: string,
  isBase64: boolean = true
): Promise<string> {
  if (Platform.OS === 'web') {
    return `data:${isBase64 ? 'image/png;base64,' : 'image/svg+xml;utf8,'}${encodeURIComponent(content)}`;
  }

  const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
  const fileUri = `${cacheDir}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: isBase64 ? FileSystem.EncodingType.Base64 : FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}

/**
 * Removes a temporary file from cache
 */
export async function cleanupTempFile(fileUri?: string): Promise<void> {
  if (!fileUri || Platform.OS === 'web' || fileUri.startsWith('data:')) return;
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch {
    // Silently ignore cleanup errors
  }
}

/**
 * Saves QR Image directly to Device Storage / Files via native file export
 */
export async function saveToFile(
  qrRef?: React.RefObject<any>,
  exportOptions?: {
    payloadValue?: string;
    fgColor?: string;
    bgColor?: string;
    moduleShape?: ModuleShape;
    eyeStyle?: EyeStyle;
    logo?: LogoPreset;
  }
): Promise<ExportResult> {
  let tempUri: string | undefined;
  try {
    const base64Data = await getQRBase64(qrRef, exportOptions);

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${base64Data}`;
      link.download = `QRStudio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true, message: 'High-resolution QR code downloaded to computer.' };
    }

    const tempFilename = `qrlab-export-${Date.now()}.png`;
    tempUri = await writeTempFile(base64Data, tempFilename, true);

    const sharingAvailable = await Sharing.isAvailableAsync();
    if (sharingAvailable) {
      await Sharing.shareAsync(tempUri, {
        mimeType: 'image/png',
        dialogTitle: 'Save QR Image',
        UTI: 'public.png',
      });
      await cleanupTempFile(tempUri);
      return {
        success: true,
        message: 'Opened system save options (select Save to Files)',
      };
    }

    await cleanupTempFile(tempUri);
    return {
      success: false,
      message: 'System file saving is not supported on this device.',
    };
  } catch (error: any) {
    if (tempUri) await cleanupTempFile(tempUri);
    return {
      success: false,
      message: error?.message || 'Failed to save QR code.',
    };
  }
}

/**
 * Shares QR Code via WhatsApp (direct deep link or share sheet)
 */
export async function shareToWhatsApp(
  qrRef?: React.RefObject<any>,
  payloadValue: string = '',
  exportOptions?: {
    fgColor?: string;
    bgColor?: string;
    moduleShape?: ModuleShape;
    eyeStyle?: EyeStyle;
    logo?: LogoPreset;
  }
): Promise<ExportResult> {
  let tempUri: string | undefined;
  try {
    const textMsg = `Scan QR Code (${payloadValue})`;

    if (Platform.OS === 'web') {
      const waWebUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
      window.open(waWebUrl, '_blank');
      return { success: true, message: 'Opening WhatsApp Web...' };
    }

    const base64Data = await getQRBase64(qrRef, { payloadValue, ...exportOptions });
    tempUri = await writeTempFile(base64Data, `qrlab-whatsapp-${Date.now()}.png`, true);

    const waDeepLink = `whatsapp://send?text=${encodeURIComponent(textMsg)}`;
    const canOpenWA = await Linking.canOpenURL(waDeepLink);

    const sharingAvailable = await Sharing.isAvailableAsync();
    if (sharingAvailable) {
      await Sharing.shareAsync(tempUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share QR Code on WhatsApp',
        UTI: 'public.png',
      });
      await cleanupTempFile(tempUri);
      return { success: true, message: 'Shared QR Code via WhatsApp!' };
    } else if (canOpenWA) {
      await Linking.openURL(waDeepLink);
      await cleanupTempFile(tempUri);
      return { success: true, message: 'Opened WhatsApp with QR Code link.' };
    } else {
      await cleanupTempFile(tempUri);
      return { success: false, message: 'WhatsApp is not installed on this device.' };
    }
  } catch (error: any) {
    if (tempUri) await cleanupTempFile(tempUri);
    return {
      success: false,
      message: error?.message || 'Failed to share to WhatsApp.',
    };
  }
}

/**
 * Shares QR Code via Instagram (direct deep link or share sheet)
 */
export async function shareToInstagram(
  qrRef?: React.RefObject<any>,
  exportOptions?: {
    payloadValue?: string;
    fgColor?: string;
    bgColor?: string;
    moduleShape?: ModuleShape;
    eyeStyle?: EyeStyle;
    logo?: LogoPreset;
  }
): Promise<ExportResult> {
  let tempUri: string | undefined;
  try {
    if (Platform.OS === 'web') {
      window.open('https://www.instagram.com', '_blank');
      return { success: true, message: 'Opening Instagram...' };
    }

    const base64Data = await getQRBase64(qrRef, exportOptions);
    tempUri = await writeTempFile(base64Data, `qrlab-instagram-${Date.now()}.png`, true);

    const igDeepLink = 'instagram://app';
    const canOpenIG = await Linking.canOpenURL(igDeepLink);

    const sharingAvailable = await Sharing.isAvailableAsync();
    if (sharingAvailable) {
      await Sharing.shareAsync(tempUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share QR Code on Instagram',
        UTI: 'public.png',
      });
      await cleanupTempFile(tempUri);
      return { success: true, message: 'Shared QR Code for Instagram!' };
    } else if (canOpenIG) {
      await Linking.openURL(igDeepLink);
      await cleanupTempFile(tempUri);
      return { success: true, message: 'Opened Instagram App.' };
    } else {
      await cleanupTempFile(tempUri);
      return { success: false, message: 'Instagram is not installed on this device.' };
    }
  } catch (error: any) {
    if (tempUri) await cleanupTempFile(tempUri);
    return {
      success: false,
      message: error?.message || 'Failed to share to Instagram.',
    };
  }
}

/**
 * General System Share Sheet for any format (PNG, SVG, PDF)
 */
export async function shareGeneral(
  qrRef?: React.RefObject<any>,
  format: ExportFormat = 'png',
  payloadValue: string = '',
  fgColor: string = '#1E2A38',
  customOptions?: CustomizationOptions
): Promise<ExportResult> {
  let tempUri: string | undefined;
  const bgColor = customOptions?.bgColor || '#FFFFFF';

  try {
    // 1. Web Export Handling
    if (Platform.OS === 'web') {
      if (format === 'svg') {
        const svgContent = generateSVGContent(payloadValue, {
          fgColor,
          bgColor,
          moduleShape: customOptions?.moduleShape || 'rounded',
          eyeStyle: customOptions?.eyeStyle || 'rounded',
          logo: customOptions?.logo || 'none',
        });
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QRLab-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return { success: true, message: 'SVG vector file downloaded.' };
      }

      // Web PNG / PDF
      const base64Data = await getQRBase64(qrRef, {
        payloadValue,
        fgColor,
        bgColor,
        moduleShape: customOptions?.moduleShape,
        eyeStyle: customOptions?.eyeStyle,
        logo: customOptions?.logo,
      });

      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: 'QRLab Code',
            text: payloadValue,
            url: window.location.href,
          });
          return { success: true, message: 'Shared successfully!' };
        } catch {
          // Fall through to file download
        }
      }

      const link = document.createElement('a');
      link.href = `data:image/png;base64,${base64Data}`;
      link.download = `QRLab-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true, message: 'Downloaded QR code image file.' };
    }

    // 2. Native Device Export Handling
    let isBase64 = true;
    let content = '';
    let ext = 'png';
    let mimeType = 'image/png';

    if (format === 'svg') {
      ext = 'svg';
      mimeType = 'image/svg+xml';
      isBase64 = false;
      content = generateSVGContent(payloadValue, {
        fgColor,
        bgColor,
        moduleShape: customOptions?.moduleShape || 'rounded',
        eyeStyle: customOptions?.eyeStyle || 'rounded',
        logo: customOptions?.logo || 'none',
      });
    } else {
      ext = 'png';
      mimeType = 'image/png';
      isBase64 = true;
      content = await getQRBase64(qrRef, {
        payloadValue,
        fgColor,
        bgColor,
        moduleShape: customOptions?.moduleShape,
        eyeStyle: customOptions?.eyeStyle,
        logo: customOptions?.logo,
      });
    }

    tempUri = await writeTempFile(content, `qrlab-code-${Date.now()}.${ext}`, isBase64);

    const sharingAvailable = await Sharing.isAvailableAsync();
    if (!sharingAvailable) {
      await cleanupTempFile(tempUri);
      return { success: false, message: 'Sharing system is not available on this device.' };
    }

    await Sharing.shareAsync(tempUri, {
      mimeType,
      dialogTitle: `Share QR Code (${format.toUpperCase()})`,
      UTI: format === 'svg' ? 'public.svg-image' : 'public.png',
    });

    await cleanupTempFile(tempUri);
    return { success: true, message: `Exported and shared ${format.toUpperCase()}!` };
  } catch (error: any) {
    if (tempUri) await cleanupTempFile(tempUri);
    return {
      success: false,
      message: error?.message || 'Failed to share QR Code.',
    };
  }
}

/**
 * Opens plain text in the phone's default text editor (e.g. Notes, Keep, Files, TextEdit)
 */
export async function openInDefaultTextEditor(text: string): Promise<ExportResult> {
  let tempUri: string | undefined;
  try {
    const textContent = text || 'Plain text content from QRLab';

    if (Platform.OS === 'web') {
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scanned-text-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, message: 'Downloaded plain text file.' };
    }

    const tempFilename = `scanned-note-${Date.now()}.txt`;
    tempUri = await writeTempFile(textContent, tempFilename, false);

    const sharingAvailable = await Sharing.isAvailableAsync();
    if (sharingAvailable) {
      await Sharing.shareAsync(tempUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Open with Phone Text Editor',
        UTI: 'public.plain-text',
      });
      await cleanupTempFile(tempUri);
      return {
        success: true,
        message: 'Opened in phone text editor choices.',
      };
    }

    await cleanupTempFile(tempUri);
    return {
      success: false,
      message: 'Sharing plain text is not supported on this device.',
    };
  } catch (error: any) {
    if (tempUri) await cleanupTempFile(tempUri);
    return {
      success: false,
      message: error?.message || 'Failed to open text in default editor.',
    };
  }
}

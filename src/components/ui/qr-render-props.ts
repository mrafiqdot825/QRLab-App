import { C } from '@/constants/design';
import type { EyeStyle, LogoPreset, ModuleShape } from '@/types/qr';

import type { CustomStyledQRCodeProps } from './custom-styled-qr-code';

/** The visual settings that decide how a code is drawn. */
export interface QRLook {
  fgColor?: string;
  bgColor?: string;
  moduleShape: ModuleShape;
  eyeStyle: EyeStyle;
  logo: LogoPreset;
}

/** Size of the large preview on Create. Exports copy its proportions. */
export const PREVIEW_QR_SIZE = 184;

/**
 * Props for CustomStyledQRCode shared by the preview and the export snapshot,
 * so both draw the same code. `unit` scales the fixed-size details (quiet zone,
 * logo margin) when drawing larger than the preview.
 */
export function qrRenderProps(look: QRLook, size: number, unit = 1): Omit<CustomStyledQRCodeProps, 'value'> {
  const background = look.bgColor || C.white;
  const showLogo = !!look.logo && look.logo !== 'none';
  const quiet = look.moduleShape === 'dots' ? 4 : look.moduleShape === 'rounded' ? 2 : 0;

  return {
    size,
    color: look.fgColor ?? C.ink,
    backgroundColor: background,
    moduleShape: look.moduleShape,
    eyeStyle: look.eyeStyle,
    logoPreset: look.logo,
    quietZone: quiet * unit,
    ...(showLogo
      ? {
          logoSize: size * 0.24,
          logoBackgroundColor: background,
          logoMargin: 2 * unit,
          logoRadius: look.eyeStyle === 'circle' ? 9999 : look.eyeStyle === 'square' ? 0 : size * 0.04,
          ecl: 'H' as const,
        }
      : { ecl: 'M' as const }),
  };
}

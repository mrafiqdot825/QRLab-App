/**
 * QRLab design tokens — "Two-tone" direction.
 * A near-black block across the top of every screen, white body, Onest type,
 * and green used only for status.
 */
export const C = {
  brand: '#111114',
  ink: '#111114',
  muted: '#6B6B73',
  strong: '#4F4F57',
  inactive: '#75757D',
  border: '#E6E6E9',
  soft: '#F3F3F5',
  tint: '#F0F0F2',
  dashed: '#C8C8CE',
  white: '#FFFFFF',
  switchOff: '#D4D4D8',

  // On the black block
  onBlock: '#FFFFFF',
  onBlockMuted: 'rgba(255,255,255,0.74)',
  onBlockFill: 'rgba(255,255,255,0.16)',
  onBlockFillSubtle: 'rgba(255,255,255,0.12)',

  // Status
  okBg: '#E7F6EC',
  okText: '#166534',
  okDot: '#16A34A',
  warnBg: '#FDF2E3',
  warnText: '#8A4B0F',
  errorText: '#B42318',

  scrim: 'rgba(10,10,12,0.5)',
} as const;

export const FONT = {
  regular: 'Onest_400Regular',
  medium: 'Onest_500Medium',
  semibold: 'Onest_600SemiBold',
  bold: 'Onest_700Bold',
} as const;

export type FontWeight = keyof typeof FONT;

export const PAD = 20;
export const BLOCK_RADIUS = 28;
export const TAB_BAR_HEIGHT = 58;
export const CTA_BAR_HEIGHT = 72;

/** Space between the top safe-area inset and the first header row. */
export const HEADER_GAP = 12;

export const SHADOW_CARD = '0px 14px 32px -16px rgba(0,0,0,0.30)';
export const SHADOW_FLOAT = '0px 6px 14px -4px rgba(0,0,0,0.35)';

/** Colours offered for the QR code itself. First entry is the default. */
export const QR_COLORS = [
  { id: 'black', label: 'Black', value: '#111114' },
  { id: 'indigo', label: 'Indigo', value: '#372EFF' },
  { id: 'navy', label: 'Navy', value: '#1A2A56' },
  { id: 'forest', label: 'Forest', value: '#1B3B2B' },
  { id: 'violet', label: 'Violet', value: '#2D1B4E' },
  { id: 'plum', label: 'Plum', value: '#4A0F3A' },
  { id: 'oxblood', label: 'Oxblood', value: '#4A1810' },
  { id: 'umber', label: 'Umber', value: '#3A2805' },
] as const;

export const DEFAULT_QR_COLOR = QR_COLORS[0].value;

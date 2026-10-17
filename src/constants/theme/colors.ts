// Morrow Design System tokens for QRLab
export const Palette = {
  // Morrow Tokens
  canvas: '#FBEDE6',          // App background (warm peach cream)
  surface: '#FDF6F2',         // Screen / large surface
  card: '#FFFFFF',            // Cards, inputs
  ink: '#1A1416',             // Headlines, primary text
  inkMuted: '#6B6468',        // Secondary text, captions
  plum: '#4A0F3A',            // Active nav pill, italic accent words, primary buttons
  plumLight: '#6A1B54',       // Hover/Pressed state
  plumSubtle: 'rgba(74, 15, 58, 0.08)',
  sage: '#C9D8BE',            // Pastel tile / chart color
  butter: '#FBE9A8',          // Pastel tile / chart color
  peach: '#F7B9A5',           // Pastel tile / chart color
  lavender: '#D9D4F5',        // Pastel tile / chart color
  periwinkle: '#AFC0F5',      // Pastel tile / chart color
  leaf: '#8FA67F',            // Decorative accents

  // System & Compatibility Aliases
  background: '#FBEDE6',       // Canvas
  cardBackground: '#FFFFFF',   // Card
  border: 'rgba(74, 15, 58, 0.08)', // Subtle plum border
  primaryText: '#1A1416',      // Ink
  secondaryText: '#6B6468',    // Ink Muted
  accent: '#4A0F3A',           // Plum
  accentHover: '#6A1B54',
  accentPressed: '#380B2C',
  disabledBg: '#F3E5DE',
  disabledText: '#A1989E',
  cyan: '#4A0F3A',             // Compatibility alias -> plum
  softBlue: '#AFC0F5',         // Compatibility alias -> periwinkle
  iceBlue: '#D9D4F5',          // Compatibility alias -> lavender
  emerald: '#8FA67F',          // Success/leaf
  amber: '#E59B3C',            // Warm butter/amber
  coral: '#E27D60',            // Warm peach/coral
  onPrimary: '#FFFFFF',
  success: '#8FA67F',
  error: '#D32F2F',
  warning: '#E59B3C',
} as const;

export interface AppScheme {
  background: string;
  secondaryBackground: string;
  surface: string;
  glassSurface: string;
  glassSurfaceHigh: string;
  glassSurfaceSubtle: string;
  border: string;
  hairline: string;
  hairlineSubtle: string;
  specularTop: string;
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
  accent: string;
  disabledBg: string;
  disabledText: string;
  glowPrimary: string;
  glowSecondary: string;
  glowTertiary: string;
  // Explicit Morrow tokens
  canvas: string;
  card: string;
  ink: string;
  inkMuted: string;
  plum: string;
  sage: string;
  butter: string;
  peach: string;
  lavender: string;
  periwinkle: string;
  leaf: string;
}

export const MorrowScheme: AppScheme = {
  background: '#FBEDE6',
  secondaryBackground: '#FDF6F2',
  surface: '#FFFFFF',
  glassSurface: 'rgba(255, 255, 255, 0.94)',
  glassSurfaceHigh: 'rgba(255, 255, 255, 0.98)',
  glassSurfaceSubtle: 'rgba(253, 246, 242, 0.85)',
  border: 'rgba(74, 15, 58, 0.08)',
  hairline: 'rgba(74, 15, 58, 0.06)',
  hairlineSubtle: 'rgba(74, 15, 58, 0.04)',
  specularTop: 'rgba(255, 255, 255, 0.95)',
  primaryText: '#1A1416',
  secondaryText: '#6B6468',
  tertiaryText: '#9A9297',
  accent: '#4A0F3A',
  disabledBg: '#F3E5DE',
  disabledText: '#A1989E',
  glowPrimary: 'rgba(247, 185, 165, 0.35)', // Warm peach glow
  glowSecondary: 'rgba(201, 216, 190, 0.25)', // Sage glow
  glowTertiary: 'rgba(217, 212, 245, 0.30)', // Lavender glow
  canvas: '#FBEDE6',
  card: '#FFFFFF',
  ink: '#1A1416',
  inkMuted: '#6B6468',
  plum: '#4A0F3A',
  sage: '#C9D8BE',
  butter: '#FBE9A8',
  peach: '#F7B9A5',
  lavender: '#D9D4F5',
  periwinkle: '#AFC0F5',
  leaf: '#8FA67F',
};

/** Compatibility aliases */
export const AliceBlueScheme = MorrowScheme;
export const MidnightScheme = MorrowScheme;

export const GlassColors = {
  ...MorrowScheme,
  accentBlue: Palette.accent,
  accentEmerald: Palette.emerald,
  accentOrange: Palette.amber,
  success: Palette.success,
  error: Palette.error,
} as const;



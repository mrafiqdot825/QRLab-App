import { Platform } from 'react-native';
import { GlassColors } from './theme/colors';
export * from './theme/tokens';

export const LiquidGlassColors = GlassColors;

export const CinematicPresets = [
  {
    id: 'plum-editorial',
    name: 'Morrow Plum',
    gradient: ['#FFFFFF', '#FDF6F2', '#FBEDE6'] as const,
    qrColor: '#4A0F3A',
    qrBg: '#FFFFFF',
    accentColor: '#4A0F3A',
    glowColor: 'rgba(74, 15, 58, 0.08)',
  },
  {
    id: 'ocean-blue',
    name: 'Periwinkle Breeze',
    gradient: ['#FDF6F2', '#EAF0FC', '#AFC0F5'] as const,
    qrColor: '#1A2A56',
    qrBg: '#FFFFFF',
    accentColor: '#4A0F3A',
    glowColor: 'rgba(175, 192, 245, 0.15)',
  },
  {
    id: 'aurora',
    name: 'Sage Botanical',
    gradient: ['#FDF6F2', '#E8EFE3', '#C9D8BE'] as const,
    qrColor: '#1B3B2B',
    qrBg: '#FFFFFF',
    accentColor: '#8FA67F',
    glowColor: 'rgba(201, 216, 190, 0.15)',
  },
  {
    id: 'luxury-gold',
    name: 'Butter Cream',
    gradient: ['#FFFFFF', '#FDF8E8', '#FBE9A8'] as const,
    qrColor: '#3A2805',
    qrBg: '#FFFFFF',
    accentColor: '#E59B3C',
    glowColor: 'rgba(251, 233, 168, 0.15)',
  },
  {
    id: 'sunset',
    name: 'Warm Peach',
    gradient: ['#FFFFFF', '#FDF0EB', '#F7B9A5'] as const,
    qrColor: '#4A1810',
    qrBg: '#FFFFFF',
    accentColor: '#E27D60',
    glowColor: 'rgba(247, 185, 165, 0.15)',
  },
  {
    id: 'lavender',
    name: 'Soft Lavender',
    gradient: ['#FFFFFF', '#F5F3FC', '#D9D4F5'] as const,
    qrColor: '#2D1B4E',
    qrBg: '#FFFFFF',
    accentColor: '#4A0F3A',
    glowColor: 'rgba(217, 212, 245, 0.15)',
  },
  {
    id: 'monochrome',
    name: 'Deep Ink',
    gradient: ['#FFFFFF', '#FDF6F2', '#F5ECE7'] as const,
    qrColor: '#1A1416',
    qrBg: '#FFFFFF',
    accentColor: '#1A1416',
    glowColor: 'rgba(26, 20, 22, 0.08)',
  },
];

export type PresetId = typeof CinematicPresets[number]['id'];

export const Fonts = Platform.select({
  ios: {
    sans: 'DM Sans',
    serif: 'Georgia',
    rounded: 'DM Sans',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Newsreader', 'Georgia', 'Times New Roman', serif",
    rounded: "'DM Sans', 'Inter', sans-serif",
    mono: 'monospace',
  },
});

export const BottomTabInset = Platform.select({ ios: 70, android: 90 }) ?? 70;
export const MaxContentWidth = 1100;

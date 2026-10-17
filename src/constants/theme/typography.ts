import { Platform } from 'react-native';

export const Typography = {
  // UI Sans (body, labels, buttons, nav)
  family: Platform.select({
    ios: 'DM Sans',
    default: 'Inter',
    web: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  }),
  // Display Serif (headlines, wordmark, hero text)
  serifFamily: Platform.select({
    ios: 'Georgia',
    default: 'serif',
    web: "'Newsreader', 'Georgia', 'Times New Roman', serif",
  }),
  roundedFamily: Platform.select({
    ios: 'DM Sans',
    default: 'Inter',
    web: "'DM Sans', 'Inter', sans-serif",
  }),
  sizes: {
    display: 38,
    h2: 24,
    cardTitle: 18,
    body: 15,
    caption: 12,
    eyebrow: 13,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
} as const;


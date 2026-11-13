import { QRType } from '@/types/qr';

export interface QRTemplate {
  id: string;
  category: string;
  title: string;
  desc: string;
  type: QRType;
  /** Dark tint used for the template's preview code. */
  qrColor: string;
  sampleValue: string;
}

export const TEMPLATE_CATEGORIES: string[] = [
  'All',
  'Business',
  'Restaurant',
  'Portfolio',
  'Resume',
  'Events',
  'WiFi',
  'Payments',
  'Social',
];

/** Display name for a category id. */
export function categoryLabel(category: string): string {
  return category === 'WiFi' ? 'Wi‑Fi' : category;
}

export const TEMPLATES_LIST: QRTemplate[] = [
  {
    id: '1',
    category: 'Business',
    title: 'Executive Digital Card',
    desc: 'Share contact information, company details, and phone number instantly.',
    type: 'vcard',
    qrColor: '#1A2A56',
    sampleValue: 'BEGIN:VCARD\nN:Alex Morgan\nORG:Liquid Studio\nEND:VCARD',
  },
  {
    id: '2',
    category: 'Restaurant',
    title: 'Digital Menu Portal',
    desc: 'Instant QR menu for tables and bar counters with zero contact.',
    type: 'url',
    qrColor: '#111114',
    sampleValue: 'https://qrlab.me/menu-demo',
  },
  {
    id: '3',
    category: 'Portfolio',
    title: 'Design Showcase Link',
    desc: 'Direct clients to your Behance, Dribbble, or GitHub portfolio.',
    type: 'url',
    qrColor: '#3B2A8F',
    sampleValue: 'https://qrlab.me/portfolio',
  },
  {
    id: '4',
    category: 'Resume',
    title: 'Interactive CV',
    desc: 'Attach your PDF resume and LinkedIn profile to physical prints.',
    type: 'url',
    qrColor: '#3A3F47',
    sampleValue: 'https://qrlab.me/cv-alex',
  },
  {
    id: '5',
    category: 'Events',
    title: 'VIP Pass & RSVP',
    desc: 'Scan code for event entry ticket, location coordinates, and time.',
    type: 'text',
    qrColor: '#4A1810',
    sampleValue: 'EVENT: VIP Design Summit 2026',
  },
  {
    id: '6',
    category: 'WiFi',
    title: 'Cafe Guest Network',
    desc: 'One-tap zero typing guest Wi-Fi access for customers.',
    type: 'wifi',
    qrColor: '#0B5E3C',
    sampleValue: 'WIFI:S:CafeGuest_5G;T:WPA;P:Welcome2026!;;',
  },
  {
    id: '7',
    category: 'Payments',
    title: 'Quick Checkout Pay',
    desc: 'Accept instant customer payments via PayPal, Venmo, or UPI.',
    type: 'url',
    qrColor: '#14532D',
    sampleValue: 'https://qrlab.me/pay-checkout',
  },
  {
    id: '8',
    category: 'Social',
    title: 'Multi-Link Hub',
    desc: 'Connect all social channels into one QR code landing page.',
    type: 'url',
    qrColor: '#4C1D95',
    sampleValue: 'https://qrlab.me/socials-all',
  },
];

import { QRType } from '@/types/qr';

export interface QRTemplate {
  id: string;
  category: string;
  title: string;
  desc: string;
  type: QRType;
  icon: string;
  gradient: [string, string];
  color: string;
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

export const TEMPLATES_LIST: QRTemplate[] = [
  {
    id: '1',
    category: 'Business',
    title: 'Executive Digital Card',
    desc: 'Share contact information, company details, and phone number instantly.',
    type: 'vcard',
    icon: 'briefcase-outline',
    gradient: ['#EFF6FF', '#DBEAFE'],
    color: '#2563EB',
    sampleValue: 'BEGIN:VCARD\nN:Alex Morgan\nORG:Liquid Studio\nEND:VCARD',
  },
  {
    id: '2',
    category: 'Restaurant',
    title: 'Digital Menu Portal',
    desc: 'Instant QR menu for tables and bar counters with zero contact.',
    type: 'url',
    icon: 'restaurant-outline',
    gradient: ['#FFF7ED', '#FFEDD5'],
    color: '#F59E0B',
    sampleValue: 'https://qrlab.me/menu-demo',
  },
  {
    id: '3',
    category: 'Portfolio',
    title: 'Design Showcase Link',
    desc: 'Direct clients to your Behance, Dribbble, or GitHub portfolio.',
    type: 'url',
    icon: 'code-slash-outline',
    gradient: ['#F5F3FF', '#EDE9FE'],
    color: '#7C3AED',
    sampleValue: 'https://qrlab.me/portfolio',
  },
  {
    id: '4',
    category: 'Resume',
    title: 'Interactive CV',
    desc: 'Attach your PDF resume and LinkedIn profile to physical prints.',
    type: 'url',
    icon: 'document-text-outline',
    gradient: ['#F8FAFC', '#E2E8F0'],
    color: '#475569',
    sampleValue: 'https://qrlab.me/cv-alex',
  },
  {
    id: '5',
    category: 'Events',
    title: 'VIP Pass & RSVP',
    desc: 'Scan code for event entry ticket, location coordinates, and time.',
    type: 'text',
    icon: 'calendar-outline',
    gradient: ['#FEF2F2', '#FEE2E2'],
    color: '#EF4444',
    sampleValue: 'EVENT: VIP Design Summit 2026',
  },
  {
    id: '6',
    category: 'WiFi',
    title: 'Cafe Guest Network',
    desc: 'One-tap zero typing guest Wi-Fi access for customers.',
    type: 'wifi',
    icon: 'wifi-outline',
    gradient: ['#ECFDF5', '#D1FAE5'],
    color: '#10B981',
    sampleValue: 'WIFI:S:CafeGuest_5G;T:WPA;P:Welcome2026!;;',
  },
  {
    id: '7',
    category: 'Payments',
    title: 'Quick Checkout Pay',
    desc: 'Accept instant customer payments via PayPal, Venmo, or UPI.',
    type: 'url',
    icon: 'wallet-outline',
    gradient: ['#F0FDF4', '#BBF7D0'],
    color: '#16A34A',
    sampleValue: 'https://qrlab.me/pay-checkout',
  },
  {
    id: '8',
    category: 'Social',
    title: 'Multi-Link Hub',
    desc: 'Connect all social channels into one QR code landing page.',
    type: 'url',
    icon: 'share-social-outline',
    gradient: ['#FAF5FF', '#E9D5FF'],
    color: '#9333EA',
    sampleValue: 'https://qrlab.me/socials-all',
  },
];

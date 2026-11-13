import type { IconName } from '@/components/ds/controls';
import type { QRType } from '@/types/qr';

export interface QRTypeConfig {
  id: QRType;
  /** Short label for pills and tiles. */
  label: string;
  icon: IconName;
}

/** Order used by the Create screen's type pills and the Home quick-create grid. */
export const QR_TYPES: readonly QRTypeConfig[] = [
  { id: 'url', label: 'Link', icon: 'link-outline' },
  { id: 'wifi', label: 'Wi‑Fi', icon: 'wifi-outline' },
  { id: 'vcard', label: 'Contact', icon: 'person-outline' },
  { id: 'text', label: 'Text', icon: 'text-outline' },
  { id: 'email', label: 'Email', icon: 'mail-outline' },
  { id: 'phone', label: 'Phone', icon: 'call-outline' },
];

export const QR_TYPE_LABEL: Record<QRType, string> = {
  url: 'Link',
  wifi: 'Wi‑Fi',
  vcard: 'Contact',
  text: 'Text',
  email: 'Email',
  phone: 'Phone',
};

export function isQRType(value: unknown): value is QRType {
  return typeof value === 'string' && value in QR_TYPE_LABEL;
}

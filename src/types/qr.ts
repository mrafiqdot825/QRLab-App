import { PresetId } from '@/constants/theme';

export type { PresetId };

export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';


export interface WIFIConfig {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface VCardConfig {
  name: string;
  phone?: string;
  email?: string;
  organization?: string;
  title?: string;
  url?: string;
}

export interface EmailConfig {
  to: string;
  subject?: string;
  body?: string;
}

export interface PhoneConfig {
  number: string;
}

export type ModuleShape = 'square' | 'rounded' | 'dots';
export type EyeStyle = 'square' | 'rounded' | 'circle';
export type LogoPreset = 'none' | 'qrlab' | 'qrstudio' | 'star' | 'heart' | 'shield';

export interface CustomizationOptions {
  fgColor?: string;
  bgColor: string;
  moduleShape: ModuleShape;
  eyeStyle: EyeStyle;
  logo: LogoPreset;
  padding: number;
}

export interface QRCodeRef {
  toDataURL: (callback: (data: string) => void) => void;
}

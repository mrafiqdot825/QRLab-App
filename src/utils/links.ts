import { Alert, Linking, Platform } from 'react-native';

import { APP_CONFIG } from '@/config/app.config';
import { Logger } from '@/services/logger/logger.service';

export const DEVELOPER_SITE = 'https://mrafiq.vercel.app/';

/** Opens the user's mail app addressed to support, falling back to Gmail on the web. */
export async function openSupportEmail(): Promise<void> {
  const email = APP_CONFIG.supportEmail;
  const subject = encodeURIComponent('QRLab App Support & Inquiry');
  const mailtoUrl = `mailto:${email}?subject=${subject}`;
  const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;

  try {
    if (Platform.OS === 'web') {
      window.open(mailtoUrl, '_blank') || window.open(webGmailUrl, '_blank');
      return;
    }
    if (await Linking.canOpenURL(mailtoUrl)) {
      await Linking.openURL(mailtoUrl);
    } else {
      // Simulators and some devices have no mail client.
      await Linking.openURL(webGmailUrl);
    }
  } catch {
    try {
      await Linking.openURL(webGmailUrl);
    } catch (err) {
      Logger.info('Could not launch mail client, showing fallback dialog:', err);
      Alert.alert('Support email', `Contact support at:\n${email}`, [{ text: 'OK' }]);
    }
  }
}

/** Opens an external URL in the browser. */
export async function openExternal(url: string, title = 'link'): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return true;
    }
    await Linking.openURL(url);
    return true;
  } catch (err) {
    Logger.error(`Failed to open link ${url}:`, err);
    Alert.alert('Open link', `Unable to open ${title} (${url})`);
    return false;
  }
}

/** A short, readable version of a QR payload for captions. */
export function displayPayload(payload: string): string {
  const v = payload.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  if (v.startsWith('mailto:')) return v.slice(7).split('?')[0];
  if (v.startsWith('tel:')) return v.slice(4);
  return v.replace(/\s+/g, ' ');
}

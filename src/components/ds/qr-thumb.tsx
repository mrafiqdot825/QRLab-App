import React from 'react';
import { View } from 'react-native';

import { CustomStyledQRCode } from '@/components/ui/custom-styled-qr-code';
import { C } from '@/constants/design';

/** Small decorative QR used in cards and lists. Hidden from screen readers. */
export const QrThumb = React.memo(function QrThumb({
  value,
  size,
  color = C.ink,
  backgroundColor = 'transparent',
}: {
  value: string;
  size: number;
  color?: string;
  backgroundColor?: string;
}) {
  return (
    <View aria-hidden>
      <CustomStyledQRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        moduleShape="rounded"
        eyeStyle="rounded"
        ecl="M"
      />
    </View>
  );
});

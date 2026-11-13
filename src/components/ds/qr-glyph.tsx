import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

/** The QRLab mark: three finder squares and a few modules. */
export const QrGlyph = React.memo(function QrGlyph({
  size = 24,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <View aria-hidden>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x={3} y={3} width={7} height={7} rx={1.5} fill={color} />
        <Rect x={14} y={3} width={7} height={7} rx={1.5} fill={color} />
        <Rect x={3} y={14} width={7} height={7} rx={1.5} fill={color} />
        <Rect x={14} y={14} width={3} height={3} fill={color} />
        <Rect x={18} y={18} width={3} height={3} fill={color} />
        <Rect x={18} y={14} width={3} height={3} fill={color} />
        <Rect x={14} y={18} width={3} height={3} fill={color} />
      </Svg>
    </View>
  );
});

import { Image, ImageProps, ImageStyle } from 'expo-image';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps } from 'react-native';

export interface ImageBackgroundProps extends ViewProps {
  source: ImageProps['source'];
  imageStyle?: StyleProp<ImageStyle>;
  contentFit?: ImageProps['contentFit'];
  transition?: ImageProps['transition'];
  children?: React.ReactNode;
}

/**
 * Modern drop-in replacement for React Native's deprecated ImageBackground.
 * Uses a View container with an absolutely positioned hardware-accelerated expo-image.
 * See: https://reactnative.dev/docs/imagebackground
 */
export const ImageBackground = React.memo(function ImageBackground({
  source,
  style,
  imageStyle,
  contentFit = 'cover',
  transition,
  children,
  ...props
}: ImageBackgroundProps) {
  return (
    <View style={style} {...props}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFill, styles.image, imageStyle]}
        contentFit={contentFit}
        transition={transition}
      />
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    zIndex: -1,
  },
});

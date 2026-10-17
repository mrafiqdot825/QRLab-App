import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface BotanicalProps {
  size?: number;
  color?: string;
  className?: string;
  opacity?: number;
}

/**
 * Elegant botanical stem and leaves in Morrow editorial style
 */
export const BotanicalBranch: React.FC<BotanicalProps> = React.memo(
  ({ size = 80, opacity = 0.85 }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        style={{ opacity }}
      >
        {/* Soft background glow circles */}
        <Circle cx="50" cy="50" r="38" fill="#F7B9A5" fillOpacity="0.25" />
        <Circle cx="65" cy="35" r="24" fill="#C9D8BE" fillOpacity="0.35" />

        {/* Delicate botanical ink stem */}
        <Path
          d="M25 85 C35 65 48 45 78 20"
          stroke="#1A1416"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Leaf 1 (top right - sage) */}
        <Path
          d="M78 20 C72 12 60 14 62 25 C64 36 76 30 78 20 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <Path d="M68 22 C72 20 76 20 78 20" stroke="#1A1416" strokeWidth="1" />

        {/* Leaf 2 (mid left - sage) */}
        <Path
          d="M48 48 C36 44 34 32 44 32 C54 32 52 44 48 48 Z"
          fill="#8FA67F"
          fillOpacity="0.75"
          stroke="#1A1416"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <Path d="M42 36 C45 40 48 45 48 48" stroke="#1A1416" strokeWidth="1" />

        {/* Leaf 3 (mid right - peach) */}
        <Path
          d="M58 38 C68 34 76 42 70 50 C64 58 56 46 58 38 Z"
          fill="#F7B9A5"
          stroke="#1A1416"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <Path d="M60 41 C64 45 68 46 70 50" stroke="#1A1416" strokeWidth="1" />

        {/* Leaf 4 (bottom left - soft leaf) */}
        <Path
          d="M38 68 C28 66 26 56 34 54 C42 52 42 64 38 68 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
);
BotanicalBranch.displayName = 'BotanicalBranch';

/**
 * Botanical single leaf for tiles
 */
export const BotanicalLeafSingle: React.FC<BotanicalProps> = React.memo(
  ({ size = 48, opacity = 0.9 }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        style={{ opacity }}
      >
        <Path
          d="M15 50 C25 35 35 25 50 12"
          stroke="#1A1416"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Path
          d="M50 12 C40 8 30 14 34 26 C38 38 48 30 50 12 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.3"
        />
        <Path
          d="M32 32 C20 30 18 20 26 18 C34 16 34 28 32 32 Z"
          fill="#8FA67F"
          fillOpacity="0.75"
          stroke="#1A1416"
          strokeWidth="1.3"
        />
      </Svg>
    );
  }
);
BotanicalLeafSingle.displayName = 'BotanicalLeafSingle';

/**
 * Botanical small flower for tiles
 */
export const BotanicalFlower: React.FC<BotanicalProps> = React.memo(
  ({ size = 48, opacity = 0.9 }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        style={{ opacity }}
      >
        {/* Stem */}
        <Path
          d="M30 52 C30 40 30 32 30 26"
          stroke="#1A1416"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <Path
          d="M30 42 C22 40 20 34 24 32 C28 30 30 38 30 42 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.2"
        />
        <Path
          d="M30 36 C38 34 40 28 36 26 C32 24 30 32 30 36 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.2"
        />
        {/* Petals */}
        <Circle cx="30" cy="20" r="6" fill="#F7B9A5" stroke="#1A1416" strokeWidth="1.3" />
        <Circle cx="24" cy="18" r="5" fill="#FBE9A8" stroke="#1A1416" strokeWidth="1.2" />
        <Circle cx="36" cy="18" r="5" fill="#FBE9A8" stroke="#1A1416" strokeWidth="1.2" />
        <Circle cx="26" cy="24" r="5" fill="#F7B9A5" stroke="#1A1416" strokeWidth="1.2" />
        <Circle cx="34" cy="24" r="5" fill="#F7B9A5" stroke="#1A1416" strokeWidth="1.2" />
        {/* Center */}
        <Circle cx="30" cy="20" r="2.5" fill="#1A1416" />
      </Svg>
    );
  }
);
BotanicalFlower.displayName = 'BotanicalFlower';

/**
 * Botanical crescent moon with leaves for Sleep / Relax tile
 */
export const BotanicalCrescent: React.FC<BotanicalProps> = React.memo(
  ({ size = 48, opacity = 0.9 }) => {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        style={{ opacity }}
      >
        {/* Crescent */}
        <Path
          d="M38 12 C44 20 44 32 36 40 C30 46 22 47 16 44 C28 47 38 38 36 24 C35 19 32 15 38 12 Z"
          fill="#F7B9A5"
          stroke="#1A1416"
          strokeWidth="1.3"
        />
        {/* Delicate twig */}
        <Path
          d="M20 50 C26 40 32 34 44 26"
          stroke="#1A1416"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <Path
          d="M28 42 C20 40 22 32 28 32 C34 32 32 40 28 42 Z"
          fill="#C9D8BE"
          stroke="#1A1416"
          strokeWidth="1.2"
        />
      </Svg>
    );
  }
);
BotanicalCrescent.displayName = 'BotanicalCrescent';


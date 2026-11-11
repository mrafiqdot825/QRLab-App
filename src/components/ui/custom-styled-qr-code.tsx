import React, { useMemo } from 'react';
import Svg, { Rect, Circle, G, Image, Path, SvgProps } from 'react-native-svg';
import QRCodeGenerator from 'qrcode';
import { EyeStyle, LogoPreset, ModuleShape } from '@/types/qr';

export interface CustomStyledQRCodeProps extends SvgProps {
  value: string;
  size: number;
  color?: string;
  backgroundColor?: string;
  moduleShape?: ModuleShape;
  eyeStyle?: EyeStyle;
  logo?: any;
  logoPreset?: LogoPreset;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoRadius?: number;
  quietZone?: number;
  ecl?: 'L' | 'M' | 'Q' | 'H';
  getRef?: (ref: any) => void;
}

export const CustomStyledQRCode: React.FC<CustomStyledQRCodeProps> = React.memo(({
  value = '',
  size = 200,
  color = '#1E2D3E',
  backgroundColor = '#FFFFFF',
  moduleShape = 'square',
  eyeStyle = 'square',
  logo,
  logoPreset = 'none',
  logoSize = size * 0.2,
  logoBackgroundColor = '#FFFFFF',
  logoMargin = 2,
  logoRadius = 0,
  quietZone = 0,
  ecl = 'H',
  getRef,
  ...svgProps
}) => {
  const qrData = useMemo(() => {
    try {
      const qr = QRCodeGenerator.create(value || 'https://qrlab.me', {
        errorCorrectionLevel: ecl,
      });
      return qr.modules;
    } catch {
      return null;
    }
  }, [value, ecl]);

  const numModules = qrData?.size || 0;
  const cellSize = size / (numModules || 1);

  // Determine logo bounds in matrix grid if logo exists
  const showLogo = !!logo || (!!logoPreset && logoPreset !== 'none');
  const logoTotalSize = logoSize + logoMargin * 2;
  const logoModules = showLogo && cellSize > 0 ? Math.ceil(logoTotalSize / cellSize) : 0;
  const centerModule = Math.floor(numModules / 2);
  const logoStart = centerModule - Math.floor(logoModules / 2);
  const logoEnd = logoStart + logoModules - 1;

  // Single consolidated SVG path for all QR data modules instead of 500+ React nodes
  const dataPathString = useMemo(() => {
    if (!qrData || numModules === 0) return '';

    const isEyeCell = (row: number, col: number) => {
      if (row < 7 && col < 7) return true;
      if (row < 7 && col >= numModules - 7) return true;
      if (row >= numModules - 7 && col < 7) return true;
      return false;
    };

    const isLogoCell = (row: number, col: number) => {
      if (!showLogo) return false;
      return (
        row >= logoStart &&
        row <= logoEnd &&
        col >= logoStart &&
        col <= logoEnd
      );
    };

    let d = '';

    if (moduleShape === 'dots') {
      const r = cellSize * 0.44;
      const d2 = (r * 2).toFixed(2);
      const rf = r.toFixed(2);

      for (let row = 0; row < numModules; row++) {
        for (let col = 0; col < numModules; col++) {
          if (isEyeCell(row, col) || isLogoCell(row, col)) continue;
          if (qrData.data[row * numModules + col] !== 1) continue;

          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;
          d += `M${(cx - r).toFixed(2)},${cy.toFixed(2)}a${rf},${rf} 0 1,0 ${d2},0a${rf},${rf} 0 1,0 -${d2},0 `;
        }
      }
    } else if (moduleShape === 'rounded') {
      const rx = cellSize * 0.35;
      const ry = cellSize * 0.35;
      const w = cellSize * 0.9;
      const h = cellSize * 0.9;
      const rxf = rx.toFixed(2);
      const ryf = ry.toFixed(2);
      const wf = (w - 2 * rx).toFixed(2);
      const hf = (h - 2 * ry).toFixed(2);

      for (let row = 0; row < numModules; row++) {
        for (let col = 0; col < numModules; col++) {
          if (isEyeCell(row, col) || isLogoCell(row, col)) continue;
          if (qrData.data[row * numModules + col] !== 1) continue;

          const x = col * cellSize + cellSize * 0.05;
          const y = row * cellSize + cellSize * 0.05;
          d += `M${(x + rx).toFixed(2)},${y.toFixed(2)}h${wf}a${rxf},${ryf} 0 0 1 ${rxf},${ryf}v${hf}a${rxf},${ryf} 0 0 1 -${rxf},${ryf}h-${wf}a${rxf},${ryf} 0 0 1 -${rxf},-${ryf}v-${hf}a${rxf},${ryf} 0 0 1 ${rxf},-${ryf}z `;
        }
      }
    } else {
      const s = (cellSize + 0.05).toFixed(2);

      for (let row = 0; row < numModules; row++) {
        for (let col = 0; col < numModules; col++) {
          if (isEyeCell(row, col) || isLogoCell(row, col)) continue;
          if (qrData.data[row * numModules + col] !== 1) continue;

          const x = (col * cellSize).toFixed(2);
          const y = (row * cellSize).toFixed(2);
          d += `M${x},${y}h${s}v${s}h-${s}z `;
        }
      }
    }

    return d;
  }, [qrData, numModules, cellSize, moduleShape, showLogo, logoStart, logoEnd]);

  if (!qrData) return null;

  // Render a single Eye (Finder Pattern) at position (r0, c0)
  const renderEye = (r0: number, c0: number, key: string) => {
    const x = c0 * cellSize;
    const y = r0 * cellSize;
    const eyeSize = 7 * cellSize;

    if (eyeStyle === 'circle') {
      return (
        <G key={key}>
          <Circle
            cx={x + eyeSize / 2}
            cy={y + eyeSize / 2}
            r={eyeSize / 2}
            fill={color}
          />
          <Circle
            cx={x + eyeSize / 2}
            cy={y + eyeSize / 2}
            r={(5 * cellSize) / 2}
            fill={backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor}
          />
          <Circle
            cx={x + eyeSize / 2}
            cy={y + eyeSize / 2}
            r={(3 * cellSize) / 2}
            fill={color}
          />
        </G>
      );
    }

    if (eyeStyle === 'rounded') {
      return (
        <G key={key}>
          <Rect
            x={x}
            y={y}
            width={eyeSize}
            height={eyeSize}
            rx={cellSize * 2.2}
            ry={cellSize * 2.2}
            fill={color}
          />
          <Rect
            x={x + cellSize}
            y={y + cellSize}
            width={5 * cellSize}
            height={5 * cellSize}
            rx={cellSize * 1.5}
            ry={cellSize * 1.5}
            fill={backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor}
          />
          <Rect
            x={x + 2 * cellSize}
            y={y + 2 * cellSize}
            width={3 * cellSize}
            height={3 * cellSize}
            rx={cellSize * 1.0}
            ry={cellSize * 1.0}
            fill={color}
          />
        </G>
      );
    }

    // Square Eye
    return (
      <G key={key}>
        <Rect x={x} y={y} width={eyeSize} height={eyeSize} fill={color} />
        <Rect
          x={x + cellSize}
          y={y + cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          fill={backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor}
        />
        <Rect
          x={x + 2 * cellSize}
          y={y + 2 * cellSize}
          width={3 * cellSize}
          height={3 * cellSize}
          fill={color}
        />
      </G>
    );
  };

  // Render Logo if present
  const renderLogo = () => {
    if (!showLogo) return null;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;
    const bgX = logoX - logoMargin;
    const bgY = logoY - logoMargin;
    const bgSize = logoSize + logoMargin * 2;
    const iconScale = (logoSize * 0.65) / 24;
    const iconOffset = (logoSize - logoSize * 0.65) / 2;

    const renderVectorIcon = () => {
      if (logoPreset === 'star') {
        return (
          <G transform={`translate(${logoX + iconOffset}, ${logoY + iconOffset}) scale(${iconScale})`}>
            <Path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={color}
            />
          </G>
        );
      }
      if (logoPreset === 'shield') {
        return (
          <G transform={`translate(${logoX + iconOffset}, ${logoY + iconOffset}) scale(${iconScale})`}>
            <Path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
              fill={color}
            />
          </G>
        );
      }
      if (logoPreset === 'heart') {
        return (
          <G transform={`translate(${logoX + iconOffset}, ${logoY + iconOffset}) scale(${iconScale})`}>
            <Path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={color}
            />
          </G>
        );
      }

      // Official QRLab brand emblem vector geometry:
      // 3 corner finder eye boxes + creative dot matrix in 4th quadrant
      return (
        <G transform={`translate(${logoX + iconOffset}, ${logoY + iconOffset}) scale(${iconScale})`}>
          {/* Top-left finder eye */}
          <Rect x="2" y="2" width="8" height="8" rx="1.8" fill={color} />
          <Rect x="4" y="4" width="4" height="4" rx="0.8" fill={logoBackgroundColor || '#FFFFFF'} />
          <Rect x="5" y="5" width="2" height="2" rx="0.4" fill={color} />

          {/* Top-right finder eye */}
          <Rect x="14" y="2" width="8" height="8" rx="1.8" fill={color} />
          <Rect x="16" y="4" width="4" height="4" rx="0.8" fill={logoBackgroundColor || '#FFFFFF'} />
          <Rect x="17" y="5" width="2" height="2" rx="0.4" fill={color} />

          {/* Bottom-left finder eye */}
          <Rect x="2" y="14" width="8" height="8" rx="1.8" fill={color} />
          <Rect x="4" y="16" width="4" height="4" rx="0.8" fill={logoBackgroundColor || '#FFFFFF'} />
          <Rect x="5" y="17" width="2" height="2" rx="0.4" fill={color} />

          {/* Bottom-right modern data dots cluster */}
          <Rect x="14" y="14" width="3.2" height="3.2" rx="0.8" fill={color} />
          <Rect x="18.8" y="14" width="3.2" height="3.2" rx="0.8" fill={color} />
          <Rect x="14" y="18.8" width="3.2" height="3.2" rx="0.8" fill={color} />
          <Rect x="18.8" y="18.8" width="3.2" height="3.2" rx="0.8" fill={color} />
          <Rect x="16.4" y="16.4" width="3.2" height="3.2" rx="0.6" fill={color} />
        </G>
      );
    };

    return (
      <G key="logo-group">
        <Rect
          x={bgX}
          y={bgY}
          width={bgSize}
          height={bgSize}
          rx={logoRadius}
          ry={logoRadius}
          fill={logoBackgroundColor}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.18}
        />
        {logo ? (
          <Image
            x={logoX}
            y={logoY}
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid slice"
            href={logo}
          />
        ) : (
          renderVectorIcon()
        )}
      </G>
    );
  };

  const svgTotalSize = size + quietZone * 2;

  return (
    <Svg
      ref={getRef}
      width={size}
      height={size}
      viewBox={`${-quietZone} ${-quietZone} ${svgTotalSize} ${svgTotalSize}`}
      {...svgProps}
    >
      {/* Background */}
      {backgroundColor && backgroundColor !== 'transparent' && (
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={svgTotalSize}
          height={svgTotalSize}
          fill={backgroundColor}
        />
      )}

      {/* 3 Eyes */}
      {renderEye(0, 0, 'eye-tl')}
      {renderEye(0, numModules - 7, 'eye-tr')}
      {renderEye(numModules - 7, 0, 'eye-bl')}

      {/* Consolidated Data Path (1 single native SVG node instead of 500+ Rect/Circle nodes) */}
      {dataPathString ? (
        <Path d={dataPathString} fill={color} />
      ) : null}

      {/* Center Logo */}
      {renderLogo()}
    </Svg>
  );
});

CustomStyledQRCode.displayName = 'CustomStyledQRCode';

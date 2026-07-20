import React, { ReactElement } from 'react';

type SignatureConfig = {
  size: number;
  opacity: number;
};

const defaultConfig: SignatureConfig = {
  size: 200,
  opacity: 0.05,
};

export function getCategorySignature(
  slug: string | undefined,
  color: string,
  config?: Partial<SignatureConfig>
): ReactElement | null {
  if (!slug) return null;

  const { size, opacity } = { ...defaultConfig, ...config };
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: `${size}px`,
    height: `${size}px`,
    opacity: `${opacity}`,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  };

  switch (slug) {
    case 'mindset':
      return (
        <div style={baseStyle}>
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: `${size * 0.9}px`,
            height: `${size * 0.9}px`,
            border: `2px solid ${color}`,
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: `${size * 0.6}px`,
            height: `${size * 0.6}px`,
            border: `2px solid ${color}`,
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            border: `2px solid ${color}`,
            borderRadius: '50%',
          }} />
        </div>
      );

    case 'karir':
      return (
        <div style={baseStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ width: '20px', height: '40px', backgroundColor: color }} />
            <div style={{ width: '20px', height: '70px', backgroundColor: color }} />
            <div style={{ width: '20px', height: '100px', backgroundColor: color }} />
            <div style={{ width: '20px', height: '140px', backgroundColor: color }} />
          </div>
        </div>
      );

    case 'keuangan':
      return (
        <div style={baseStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '24px', height: '60px', backgroundColor: color }} />
            <div style={{ width: '24px', height: '100px', backgroundColor: color }} />
            <div style={{ width: '24px', height: '80px', backgroundColor: color }} />
            <div style={{ width: '24px', height: '130px', backgroundColor: color }} />
          </div>
        </div>
      );

    case 'teknologi':
      return (
        <div style={baseStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px' }}>
            {[0, 1, 2].map((row) => (
              <div key={row} style={{ display: 'flex', gap: '12px' }}>
                {[0, 1, 2].map((col) => (
                  <div key={col} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color,
                  }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      );

    case 'kehidupan':
      return (
        <div style={baseStyle}>
          <div style={{
            width: `${size * 0.8}px`,
            height: `${size * 0.4}px`,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottom: 'none',
            border: `2px solid ${color}`,
            borderBottomWidth: '0px',
          }} />
          <div style={{
            width: `${size * 0.6}px`,
            height: `${size * 0.3}px`,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottom: 'none',
            border: `2px solid ${color}`,
            borderBottomWidth: '0px',
            marginTop: '-4px',
          }} />
          <div style={{
            width: `${size * 0.4}px`,
            height: `${size * 0.2}px`,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottom: 'none',
            border: `2px solid ${color}`,
            borderBottomWidth: '0px',
            marginTop: '-4px',
          }} />
        </div>
      );

    case 'bisnis':
      return (
        <div style={baseStyle}>
          <div style={{
            width: '0px',
            height: '0px',
            borderLeft: `${size * 0.45}px solid transparent`,
            borderRight: `${size * 0.45}px solid transparent`,
            borderBottom: `${size * 0.7}px solid ${color}`,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: `${size * 0.15}px`,
            width: '0px',
            height: '0px',
            borderLeft: `${size * 0.3}px solid transparent`,
            borderRight: `${size * 0.3}px solid transparent`,
            borderBottom: `${size * 0.45}px solid ${color}`,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '0px',
            left: `${size * 0.3}px`,
            width: '0px',
            height: '0px',
            borderLeft: `${size * 0.15}px solid transparent`,
            borderRight: `${size * 0.15}px solid transparent`,
            borderBottom: `${size * 0.22}px solid ${color}`,
          }} />
        </div>
      );

    default:
      return null;
  }
}

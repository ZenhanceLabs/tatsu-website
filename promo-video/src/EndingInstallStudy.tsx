import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {pixelCats} from './pixelCatsData';
import {type Lang, SEQ_TEXTS} from './i18n';

const palette = {
  blue: '#1a73e8',
  blueSoft: '#e8f0fe',
  greenSoft: '#e6f4ea',
  text: '#202124',
  muted: '#5f6368',
  border: 'rgba(32, 33, 36, 0.08)',
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const springAt = (frame: number, start: number, duration: number, damping = 90, stiffness = 220) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping, stiffness, mass: 0.84},
  });

const whiteCat = pixelCats.find((cat) => cat.id === 'white') ?? pixelCats[0];

const renderYawnFrame = (isYawning: boolean) => {
  const matrix = whiteCat.data.map((row) => row.split(''));
  const paint = (x: number, y: number, value: string) => {
    if (matrix[y]?.[x] === undefined) {
      return;
    }
    matrix[y][x] = value;
  };
  const mouthLine = whiteCat.data[8]?.[8] !== '0' ? whiteCat.data[8][8] : '2';
  const tongue = '3';

  if (isYawning) {
    paint(8, 9, tongue);
    paint(8, 10, mouthLine);
    paint(6, 6, '1');
    paint(10, 6, '1');
  }

  return matrix;
};

const YawnCat: React.FC<{frame: number}> = ({frame}) => {
  const isYawning = frame >= 26 && frame < 86;
  const pixels = renderYawnFrame(isYawning);
  const size = 252;
  const cell = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{imageRendering: 'pixelated'}}>
      {pixels.flatMap((row, y) =>
        row.flatMap((value, x) => {
          if (value === '0') {
            return [];
          }
          const fill = whiteCat.pal[value];
          if (!fill) {
            return [];
          }
          return <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={fill} />;
        }),
      )}
    </svg>
  );
};

export const EndingInstallStudy: React.FC<{sharedBackground?: boolean; lang?: Lang}> = ({sharedBackground = false, lang = 'ja'}) => {
  const frame = useCurrentFrame();
  const t = SEQ_TEXTS[lang];
  const iconIn = springAt(frame, 4, 22);
  const copyIn = springAt(frame, 14, 22);
  const badgeIn = springAt(frame, 26, 20);
  const catIn = springAt(frame, 16, 18);
  const glowDrift = interpolate(frame, [0, 119], [0, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: sharedBackground ? 'transparent' : '#ffffff', overflow: 'hidden', fontFamily: t.fontFamily}}>
      {sharedBackground ? null : (
        <>
          <div
            style={abs({
              inset: 0,
              background:
                'radial-gradient(circle at 18% 30%, rgba(232,240,254,0.96), transparent 26%), radial-gradient(circle at 82% 20%, rgba(230,244,234,0.86), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            })}
          />
          <div
            style={{
              ...abs({left: 1240 - glowDrift * 40, top: 600 - glowDrift * 20, width: 540, height: 540, borderRadius: 999}),
              background: 'radial-gradient(circle, rgba(26,115,232,0.09) 0%, rgba(26,115,232,0.03) 44%, rgba(26,115,232,0) 74%)',
            }}
          />
        </>
      )}
      <div
        style={{
          ...abs({left: 760, top: 168, width: 1010, height: 710, borderRadius: 52}),
          background: 'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.62) 100%)',
          border: `1px solid ${palette.border}`,
        }}
      />
      <div
        style={{
          ...abs({left: 128, top: 286, width: 560, height: 560, borderRadius: 120}),
          background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 100%)',
          border: `1px solid ${palette.border}`,
          boxShadow: '0 24px 80px rgba(60,64,67,0.12)',
          opacity: iconIn,
          transform: `translateY(${(1 - iconIn) * 68}px) scale(${0.9 + iconIn * 0.1})`,
        }}
      >
        <div
          style={{
            ...abs({left: 32, top: 32, width: 496, height: 496, borderRadius: 96}),
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <Img src={staticFile('icon.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>

      <div
        style={{
          ...abs({left: 282, top: 46, width: 252, height: 252}),
          opacity: catIn,
          transform: `translateY(${(1 - catIn) * 24}px)`,
        }}
      >
        <YawnCat frame={frame} />
      </div>

      <div
        style={{
          ...abs({left: 848, top: 278, width: 760}),
          opacity: copyIn,
          transform: `translateY(${(1 - copyIn) * 34}px)`,
        }}
      >
        <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 2.8, color: palette.blue}}>TATSU</div>
        <div style={{fontSize: 72, lineHeight: 1.1, fontWeight: 900, color: palette.text, marginTop: 18, whiteSpace: 'pre-line'}}>{t.endingTitle}</div>
        <div style={{fontSize: 24, lineHeight: 1.6, color: palette.muted, marginTop: 22}}>{t.endingSub}</div>
      </div>

      <div
        style={{
          ...abs({left: 842, top: 720, width: 450, height: 136}),
          opacity: badgeIn,
          transform: `translateY(${(1 - badgeIn) * 28}px) scale(${0.94 + badgeIn * 0.06})`,
        }}
      >
        <Img src={staticFile('getonGooglePlay.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
    </AbsoluteFill>
  );
};
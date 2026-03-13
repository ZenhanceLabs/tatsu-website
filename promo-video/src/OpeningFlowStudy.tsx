import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {pixelCats} from './pixelCatsData';

const palette = {
  blue: '#1a73e8',
  blueSoft: '#e8f0fe',
  green: '#137333',
  greenSoft: '#e6f4ea',
  red: '#c5221f',
  redSoft: '#fce8e6',
  text: '#202124',
  muted: '#5f6368',
  border: 'rgba(0, 0, 0, 0.08)',
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

const StaticCat: React.FC<{size: number}> = ({size}) => {
  const pixel = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{imageRendering: 'pixelated'}}>
      {whiteCat.data.flatMap((row, y) =>
        row.split('').flatMap((cell, x) => {
          if (cell === '0') {
            return [];
          }
          const fill = whiteCat.pal[cell];
          if (!fill) {
            return [];
          }
          return <rect key={`${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />;
        }),
      )}
    </svg>
  );
};

export const OpeningFlowStudy: React.FC<{sharedBackground?: boolean}> = ({sharedBackground = false}) => {
  const frame = useCurrentFrame();
  const iconIn = springAt(frame, 8, 18);
  const phoneIn = springAt(frame, 24, 24);
  const titleIn = springAt(frame, 58, 18);
  const iconLeft = 855;
  const iconTop = 112;
  const iconSize = 210;
  const catSize = 106;
  const catOverlap = 8;

  return (
    <AbsoluteFill style={{backgroundColor: sharedBackground ? 'transparent' : '#ffffff', overflow: 'hidden', fontFamily: '"Noto Sans JP", sans-serif'}}>
      {sharedBackground ? null : <div style={abs({inset: 0, background: 'radial-gradient(circle at 16% 18%, rgba(232,240,254,0.92), transparent 28%), radial-gradient(circle at 84% 22%, rgba(230,244,234,0.92), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />}
      {sharedBackground ? null : <div style={abs({left: 540, top: 72, width: 840, height: 900, borderRadius: 120, background: 'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.84) 42%, rgba(255,255,255,0.08) 100%)', filter: 'blur(16px)', opacity: 0.95})} />}

      <div style={{...abs({left: iconLeft, top: iconTop, width: iconSize, height: iconSize}), opacity: iconIn, transform: `scale(${0.78 + iconIn * 0.22}) translateY(${(1 - iconIn) * 24}px)`}}>
        <Img src={staticFile('app_icon.png')} style={{width: '100%', height: '100%', borderRadius: 54}} />
      </div>
      <div style={{...abs({left: iconLeft + (iconSize - catSize) / 2, top: iconTop - catSize + catOverlap, width: catSize, height: catSize}), opacity: iconIn, transform: `translateY(${(1 - iconIn) * 16}px)`}}>
        <StaticCat size={catSize} />
      </div>

      <div style={{...abs({left: 0, top: 344, width: '100%', opacity: titleIn}), display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontSize: 20, fontWeight: 800, letterSpacing: 2.6, color: palette.blue, textAlign: 'center'}}>TATSU</div>
          <div style={{fontSize: 34, fontWeight: 800, color: palette.text, marginTop: 10, whiteSpace: 'nowrap', textAlign: 'center'}}>がんばらなくていいデジタルデトックス</div>
        </div>
      </div>

      <div style={{...abs({left: 604, top: 384, width: 820, height: 770}), opacity: phoneIn}}>
        {[
          {src: 'restriction.png', left: -6, top: 154, rotate: -14, z: 1},
          {src: 'home.png', left: 196, top: 72, rotate: 0, z: 3},
          {src: 'analysis_2.png', left: 430, top: 154, rotate: 14, z: 2},
        ].map((shot, index) => {
          const cardIn = springAt(frame, 24 + index * 6, 20);
          return (
            <div
              key={shot.src}
              style={{
                ...abs({left: shot.left, top: shot.top + (1 - cardIn) * 220, width: 320, height: 610}),
                opacity: cardIn,
                transform: `rotate(${interpolate(cardIn, [0, 1], [shot.rotate * 1.4, shot.rotate])}deg) scale(${0.88 + cardIn * 0.12})`,
                zIndex: shot.z,
              }}
            >
              <div style={{...abs({left: 0, top: 0, width: 320, height: 610}), borderRadius: 44, backgroundColor: '#111827'}} />
              <div style={{...abs({left: 9, top: 9, width: 302, height: 592}), borderRadius: 36, backgroundColor: '#000', overflow: 'hidden'}}>
                <div style={abs({left: 101, top: 10, width: 100, height: 20, borderRadius: 999, backgroundColor: '#111827', zIndex: 2})} />
                <Img src={staticFile(shot.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 0%'}} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
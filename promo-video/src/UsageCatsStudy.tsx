import {motion} from 'framer-motion';
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from 'remotion';
import {pixelCats, type PixelCat} from './pixelCatsData';

const palette = {
  blue: '#1a73e8',
  blueSoft: '#e8f0fe',
  green: '#137333',
  greenSoft: '#e6f4ea',
  yellow: '#b06000',
  yellowSoft: '#fef7e0',
  red: '#c5221f',
  redSoft: '#fce8e6',
  text: '#202124',
  muted: '#5f6368',
  surface: '#f8f9fa',
  border: 'rgba(0, 0, 0, 0.08)',
  grid: '#e8eaed',
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#ffffff',
  borderRadius: 24,
  border: `1px solid ${palette.border}`,
  ...extra,
});

const springAt = (frame: number, start: number, duration: number, damping = 90, stiffness = 220) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping, stiffness, mass: 0.8},
  });

const PixelCatSprite: React.FC<{cat: PixelCat; size: number}> = ({cat, size}) => {
  const pixel = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{imageRendering: 'pixelated'}}>
      {cat.data.flatMap((row, y) =>
        row.split('').flatMap((cell, x) => {
          if (cell === '0') {
            return [];
          }
          const fill = cat.pal[cell];
          if (!fill) {
            return [];
          }
          return <rect key={`${cat.id}-${x}-${y}`} x={x * pixel} y={y * pixel} width={pixel} height={pixel} fill={fill} />;
        }),
      )}
    </svg>
  );
};

const catAnchors = [
  {x: 0, y: 0, size: 228},
  {x: -236, y: -120, size: 150},
  {x: 238, y: -146, size: 156},
  {x: -318, y: 148, size: 142},
  {x: 314, y: 160, size: 146},
  {x: 0, y: -278, size: 138},
  {x: 0, y: 284, size: 138},
  {x: -470, y: -18, size: 128},
  {x: 470, y: 14, size: 128},
];

export const UsageCatsStudy: React.FC = () => {
  const frame = useCurrentFrame();
  const spread = springAt(frame, 50, 28, 80, 180);
  const bloom = springAt(frame, 82, 34, 70, 160);
  const lift = springAt(frame, 170, 24, 85, 240);
  const glow = interpolate(frame, [0, 80, 150], [0.3, 1, 0.85], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff', overflow: 'hidden', fontFamily: '"Noto Sans JP", sans-serif'}}>
      <div style={abs({inset: 0, background: 'radial-gradient(circle at 16% 20%, rgba(232,240,254,0.92), transparent 30%), radial-gradient(circle at 84% 26%, rgba(230,244,234,0.94), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />
      <div style={abs({left: 0, top: -lift * 720, width: 1920, height: 1080, transform: `scale(${1 - lift * 0.05})`, transformOrigin: 'center top'})}>
        <div style={{...abs({left: 112, top: 116, width: 736, height: 848}), ...card({padding: 28, backgroundColor: '#ffffff'})}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 4, height: 32, borderRadius: 2, backgroundColor: palette.blue}} />
            <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: palette.blue}}>trend field</div>
          </div>
          <div style={abs({left: 28, top: 98, width: 680, height: 690})}>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} style={abs({left: 40, top: 88 + index * 142, width: 600, height: 2, backgroundColor: palette.grid})} />
            ))}
            {Array.from({length: 5}, (_, index) => {
              const reveal = springAt(frame, 18 + index * 14, 20, 90, 240);
              const width = 490 - index * 54;
              const height = 72 - index * 4;
              const x = 76 + index * 30;
              const y = 520 - index * 76;
              return (
                <div
                  key={index}
                  style={abs({
                    left: x,
                    top: y,
                    width,
                    height,
                    borderRadius: 28,
                    backgroundColor: index % 2 === 0 ? palette.blueSoft : palette.greenSoft,
                    border: `2px solid ${index % 2 === 0 ? palette.blue : palette.green}`,
                    transform: `scaleX(${reveal})`,
                    transformOrigin: 'left center',
                    opacity: 0.7 + reveal * 0.3,
                  })}
                />
              );
            })}
            <svg width="680" height="690" viewBox="0 0 680 690" style={abs({left: 0, top: 0})}>
              <path
                d={`M 80 ${530 - spread * 10} C 180 ${500 - spread * 40}, 240 ${430 - spread * 20}, 322 ${372 - spread * 66} S 470 ${240 - spread * 42}, 590 ${164 - spread * 16}`}
                fill="none"
                stroke={palette.blue}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${spread * 920} 1200`}
              />
            </svg>
          </div>
        </div>

        <div style={{...abs({left: 886, top: 116, width: 922, height: 848}), ...card({backgroundColor: palette.surface})}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: 28}}>
            <div style={{width: 4, height: 32, borderRadius: 2, backgroundColor: palette.green}} />
            <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: palette.green}}>pixel cats</div>
          </div>
          <div style={abs({left: 0, top: 0, width: 922, height: 848})}>
            <div style={abs({left: 461 - 154 * glow, top: 424 - 154 * glow, width: 308 * glow, height: 308 * glow, borderRadius: 999, background: 'radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(232,240,254,0.92) 45%, rgba(232,240,254,0) 76%)'})} />
            {catAnchors.map((anchor, index) => {
              const progress = springAt(frame, 76 + index * 10, 26, 78, 210);
              const rotate = interpolate(progress, [0, 1], [index % 2 === 0 ? -14 : 14, 0]);
              const cat = pixelCats[index % pixelCats.length];
              const driftX = anchor.x * bloom;
              const driftY = anchor.y * bloom;
              return (
                <motion.div
                  key={`${cat.id}-${index}`}
                  style={abs({
                    left: 461 + driftX - anchor.size / 2,
                    top: 424 + driftY - anchor.size / 2 - lift * (240 + index * 12),
                    width: anchor.size,
                    height: anchor.size,
                    opacity: progress,
                    transform: `scale(${0.2 + progress * 0.8}) rotate(${rotate}deg)`,
                    transformOrigin: 'center center',
                  })}
                  animate={{opacity: 1}}
                  transition={{duration: 0.01}}
                >
                  <PixelCatSprite cat={cat} size={anchor.size} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
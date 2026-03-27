import {motion} from 'framer-motion';
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {pixelCats, type PixelCat} from './pixelCatsData';
import {type Lang, PROMO_TEXTS, getFontStack} from './i18n';

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
  card: '#ffffff',
  border: 'rgba(0, 0, 0, 0.08)',
  grid: '#e8eaed',
};

const fontStack = '"Noto Sans JP", "Segoe UI", sans-serif';
// NOTE: fontStack is now dynamic per-lang, see TatsuPromo component

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

const segment = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const springSegment = (frame: number, start: number, duration: number) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping: 100, stiffness: 180, mass: 0.9},
  });

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: palette.card,
  borderRadius: 24,
  border: `1px solid ${palette.border}`,
  ...extra,
});

const label = (text: string, color: string) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{width: 4, height: 32, borderRadius: 2, backgroundColor: color}} />
    <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2.4, textTransform: 'uppercase', color}}>{text}</div>
  </div>
);

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

const FullscreenTaskCard: React.FC<{frame: number; opacity: number; t: import('./i18n').PromoTexts}> = ({frame, opacity, t}) => {
  const enter = springSegment(frame, 0, 28);
  const split = segment(frame, 96, 180);
  return (
    <div style={{...abs({left: 110, top: 120, width: 1700, height: 840}), opacity}}>
      <motion.div style={{...card({padding: 32, width: '100%', height: '100%', borderRadius: mix(24, 56, split), backgroundColor: split > 0.5 ? palette.surface : palette.card}), transform: `scale(${0.94 + enter * 0.06})`}} animate={{opacity: 1}} transition={{duration: 0.01}}>
        <div style={{display: 'grid', gridTemplateColumns: '10px 180px 1fr 80px', gap: 28, alignItems: 'center', height: 240}}>
          <div style={{width: 10, height: '100%', borderRadius: 10, backgroundColor: palette.blue}} />
          <div style={{width: 180, height: 180, borderRadius: 56, backgroundColor: palette.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.blue, fontSize: 54}}>●</div>
          <div>
            <div style={{fontSize: 84, fontWeight: 900, color: palette.text, lineHeight: 1}}>YouTube</div>
            <div style={{fontSize: 52, color: palette.muted, marginTop: 18}} id="taskLimit">{t.taskLimit}</div>
          </div>
          <div style={{width: 68, height: 68, borderRadius: 34, border: `4px solid ${palette.border}`}} />
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 18, marginTop: 48, height: 430}}>
          {Array.from({length: 7}, (_, index) => (
            <div key={index} style={{borderRadius: 34, backgroundColor: index % 2 === 0 ? palette.blueSoft : palette.surface, transform: `scaleY(${split})`, transformOrigin: 'bottom center'}} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const FullscreenBarChart: React.FC<{frame: number; opacity: number; t: import('./i18n').PromoTexts}> = ({frame, opacity, t}) => {
  const bars = [310, 410, 470, 360, 430, 500, 330];
  const targets = [150, 190, 215, 180, 205, 220, 160];
  const colors = [palette.redSoft, palette.yellowSoft, palette.blueSoft, palette.blueSoft, palette.greenSoft, palette.yellowSoft, palette.redSoft];
  const strokes = [palette.red, palette.yellow, palette.blue, palette.blue, palette.green, palette.yellow, palette.red];
  return (
    <div style={{...abs({left: 110, top: 120, width: 1700, height: 840}), opacity}}>
      <div style={{...card({width: '100%', height: '100%', padding: 34, backgroundColor: palette.card})}}>
        {label('bar chart', palette.blue)}
        <div style={{position: 'relative', marginTop: 32, width: '100%', height: 700}}>
          {[0, 1, 2, 3].map((index) => {
            const y = 620 - index * 180;
            return <div key={index} style={{...abs({left: 56, top: y, width: 1550, height: 2, backgroundColor: palette.grid})}} />;
          })}
          <div style={{...abs({left: 56, top: 80, width: 2, height: 542, backgroundColor: palette.grid})}} />
          {['0', '1h', '2h', '3h'].map((tick, index) => (
            <div key={tick} style={{...abs({left: 0, top: 612 - index * 180, width: 44, textAlign: 'right'}), fontSize: 22, color: '#94a3b8'}}>{tick}</div>
          ))}
          {bars.map((bar, index) => {
            const p = segment(frame, 160 + index * 8, 280 + index * 10);
            const height = mix(bar, targets[index], p);
            const left = 148 + index * 206;
            const top = 620 - height;
            return (
              <React.Fragment key={index}>
                <div style={{...abs({left, top, width: 118, height}), backgroundColor: colors[index], border: `3px solid ${strokes[index]}`, borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}} />
                <div style={{...abs({left: left + 42, top: 650, width: 34, textAlign: 'center'}), fontSize: 22, color: '#94a3b8'}} className="day-label-item">{t.dayLabels[index]}</div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FullscreenDonut: React.FC<{frame: number; opacity: number; t: import('./i18n').PromoTexts}> = ({frame, opacity, t}) => {
  const p = segment(frame, 300, 450);
  const size = mix(420, 1200, p);
  const strokeWidth = mix(42, 180, p);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = [0.34, 0.22, 0.18, 0.14, 0.12];
  const colors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9aa0a6'];
  let offset = 0;
  return (
    <div style={{...abs({inset: 0}), opacity}}>
      <div style={{...abs({left: 960 - size / 2, top: 540 - size / 2, width: size, height: size})}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform: `rotate(${mix(-90, 20, p)}deg)`}}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#edf1f5" strokeWidth={strokeWidth} fill="none" />
          {segments.map((portion, index) => {
            const arc = circumference * portion;
            const dashOffset = circumference - offset - arc;
            offset += arc;
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={colors[index]}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${arc} ${circumference - arc}`}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        <div style={{...abs({inset: 0}), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 3, color: palette.muted}} id="donutTotal">{t.total}</div>
          <div style={{fontSize: 84, fontWeight: 900, color: palette.text, marginTop: 10}}>3h 42m</div>
        </div>
      </div>
    </div>
  );
};

const FullscreenTrendCard: React.FC<{frame: number; opacity: number; t: import('./i18n').PromoTexts}> = ({frame, opacity, t}) => {
  const p = segment(frame, 450, 620);
  const points = [170, 188, 144, 126, 100, 72, 56];
  const d = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${120 + index * 230} ${point + (1 - p) * 120}`).join(' ');
  return (
    <div style={{...abs({left: 110, top: 120, width: 1700, height: 840}), opacity}}>
      <div style={{...card({width: '100%', height: '100%', padding: 30})}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            {label('trend card', palette.blue)}
            <div style={{fontSize: 68, fontWeight: 900, color: palette.text, marginTop: 16}} id="trendTitle">{t.totalUsageTime}</div>
          </div>
          <div style={{fontSize: 96, fontWeight: 900, color: palette.green}}>-18%</div>
        </div>
        <svg width="1640" height="520" viewBox="0 0 1640 520" style={{marginTop: 40}}>
          {[0, 1, 2, 3].map((index) => (
            <line key={index} x1="0" x2="1640" y1={80 + index * 110} y2={80 + index * 110} stroke="#edf1f5" strokeWidth="3" />
          ))}
          <path d={d} fill="none" stroke={palette.blue} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => (
            <circle key={index} cx={120 + index * 230} cy={point + (1 - p) * 120} r={index === points.length - 1 ? 18 : 13} fill={index === points.length - 1 ? palette.green : palette.blue} />
          ))}
        </svg>
      </div>
    </div>
  );
};

const FullscreenCats: React.FC<{frame: number; opacity: number}> = ({frame, opacity}) => {
  const anchors = [
    {x: 0, y: 0},
    {x: -220, y: -160},
    {x: 220, y: -160},
    {x: -250, y: 150},
    {x: 250, y: 150},
    {x: 0, y: -320},
    {x: 0, y: 320},
    {x: -470, y: 0},
    {x: 470, y: 0},
    {x: -520, y: -240},
    {x: 520, y: -240},
    {x: -520, y: 240},
    {x: 520, y: 240},
  ];
  return (
    <div style={{...abs({inset: 0}), opacity}}>
      {anchors.map((anchor, index) => {
        const p = springSegment(frame, 660 + index * 8, 28);
        const cat = pixelCats[index % pixelCats.length];
        const size = index === 0 ? 220 : 150;
        return (
          <motion.div key={`${cat.id}-${index}`} style={{...abs({left: 960 + anchor.x - size / 2, top: 540 + anchor.y - size / 2}), opacity: p, transform: `scale(${0.4 + p * 0.6})`}} animate={{opacity: 1}} transition={{duration: 0.01}}>
            <PixelCatSprite cat={cat} size={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

const CTA: React.FC<{progress: number; t: import('./i18n').PromoTexts}> = ({progress, t}) => (
  <>
    <div style={{...abs({left: 120, top: 250, width: 800}), opacity: progress}}>
      <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 3, color: palette.blue}}>TATSU</div>
      <div style={{fontSize: 110, fontWeight: 900, color: palette.text, lineHeight: 1.02, letterSpacing: -2.6, marginTop: 22}}>{t.ctaTitle}</div>
    </div>
    <motion.div style={{...abs({left: 1130, top: 240, width: 520, padding: 32}), ...card({opacity: progress}), transform: `scale(${0.9 + progress * 0.1})`}} animate={{opacity: 1}} transition={{duration: 0.01}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <Img src={staticFile('app_icon.png')} style={{width: 120, height: 120, borderRadius: 28}} />
        <div>
          <div style={{fontSize: 52, fontWeight: 900, color: palette.text}}>TATSU</div>
          <div style={{fontSize: 24, color: palette.muted, marginTop: 8}}>{t.ctaSubtitle}</div>
        </div>
      </div>
      <div style={{marginTop: 30, padding: '18px 24px', borderRadius: 999, backgroundColor: palette.blue, color: '#fff', fontSize: 28, fontWeight: 700, textAlign: 'center'}}>{t.ctaButton}</div>
    </motion.div>
  </>
);

export const TatsuPromo: React.FC<{lang?: Lang}> = ({lang = 'ja'}) => {
  const frame = useCurrentFrame();
  const t = PROMO_TEXTS[lang];
  const currentFontStack = getFontStack(lang);
  const taskOpacity = interpolate(frame, [0, 170, 220], [1, 1, 0], {extrapolateRight: 'clamp'});
  const barOpacity = interpolate(frame, [100, 180, 320, 380], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const donutOpacity = interpolate(frame, [260, 330, 500, 560], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const trendOpacity = interpolate(frame, [430, 520, 680, 730], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const catsOpacity = interpolate(frame, [640, 720, 840, 870], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaProgress = segment(frame, 830, 900);

  return (
    <AbsoluteFill style={{fontFamily: currentFontStack, backgroundColor: '#ffffff', color: palette.text, overflow: 'hidden'}}>
      <div style={abs({inset: 0, background: 'radial-gradient(circle at 12% 18%, rgba(232,240,254,0.8), transparent 28%), radial-gradient(circle at 82% 24%, rgba(230,244,234,0.9), transparent 22%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />
      <div style={abs({inset: 0, backgroundImage: 'linear-gradient(rgba(32,33,36,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(32,33,36,0.025) 1px, transparent 1px)', backgroundSize: '120px 120px'})} />
      <FullscreenTaskCard frame={frame} opacity={taskOpacity} t={t} />
      <FullscreenBarChart frame={frame} opacity={barOpacity} t={t} />
      <FullscreenDonut frame={frame} opacity={donutOpacity} t={t} />
      <FullscreenTrendCard frame={frame} opacity={trendOpacity} t={t} />
      <FullscreenCats frame={frame} opacity={catsOpacity} />
      <div style={{...abs({inset: 0}), opacity: interpolate(frame, [800, 860, 900], [0, 1, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.82) 36%, rgba(255,255,255,1) 100%)'}} />
      <CTA progress={ctaProgress} t={t} />
    </AbsoluteFill>
  );
};

// Language-specific wrapper components
export const TatsuPromoEN: React.FC = () => <TatsuPromo lang="en" />;
export const TatsuPromoKO: React.FC = () => <TatsuPromo lang="ko" />;
import {motion} from 'framer-motion';
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {pixelCats} from './pixelCatsData';
import {type Lang, SEQ_TEXTS} from './i18n';

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
  grid: '#e2e8f0',
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const springAt = (frame: number, start: number, duration: number, damping = 90, stiffness = 220) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping, stiffness, mass: 0.82},
  });

const PixelCatIcon: React.FC<{index: number; size: number}> = ({index, size}) => {
  const cat = pixelCats[index % pixelCats.length];
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

const ModeIcon: React.FC<{kind: 'free' | 'strict' | 'buddy'; color: string}> = ({kind, color}) => {
  if (kind === 'free') {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="14" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="17" y1="17" x2="17" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="17" y1="17" x2="23" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'strict') {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34">
        <rect x="8" y="14" width="18" height="12" rx="3" fill="none" stroke={color} strokeWidth="2.5" />
        <path d="M12 14V11a5 5 0 0 1 10 0v3" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="11" cy="11" r="4" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="23" cy="11" r="4" fill="none" stroke={color} strokeWidth="2.5" />
      <path d="M6 25c1.5-3.5 4-5.5 7.5-5.5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 25c-1.5-3.5-4-5.5-7.5-5.5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15" y1="18" x2="19" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17" y1="18" x2="17" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

const PhoneFrame: React.FC<{x: number; src: string; frame: number; delay: number; shiftY?: number; baseTop?: number; lang?: Lang}> = ({x, src, frame, delay, shiftY = 0, baseTop = 432, lang = 'ja'}) => {
  const rise = springAt(frame, delay, 24, 88, 240);
  const getLocalizedScreenshot = (s: string, l: Lang) => {
    if (l === 'ja') return s;
    return s.replace('.png', `_${l}.png`);
  };
  const localizedSrc = getLocalizedScreenshot(src, lang);
  return (
    <div style={abs({left: x + 105, top: baseTop + (1 - rise) * 240, width: 430, height: 820, opacity: rise})}>
      <div style={{...abs({left: 0, top: 0, width: 430, height: 820}), borderRadius: 52, backgroundColor: '#111827'}} />
      <div style={{...abs({left: 10, top: 10, width: 410, height: 800}), borderRadius: 42, backgroundColor: '#000', overflow: 'hidden'}}>
        <div style={abs({left: 155, top: 10, width: 100, height: 22, borderRadius: 999, backgroundColor: '#111827', zIndex: 2})} />
        <Img src={staticFile(localizedSrc)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${shiftY}%`, transform: `scale(${1 + (1 - rise) * 0.06})`}} />
      </div>
    </div>
  );
};

const ColumnLabel: React.FC<{x: number; color: string; text: string; top?: number; compact?: boolean}> = ({x, color, text, top = 34, compact = false}) => (
  <div style={abs({left: x + (compact ? 72 : 42), top, display: 'flex', alignItems: 'center', gap: compact ? 10 : 12})}>
    <div style={{width: 12, height: 12, borderRadius: 999, backgroundColor: color}} />
    <div style={{fontSize: compact ? 12 : 14, fontWeight: 700, letterSpacing: compact ? 1.6 : 2.2, color, textTransform: 'uppercase'}}>{text}</div>
  </div>
);

const ModesPanel: React.FC<{x: number; frame: number; yOffset?: number; compact?: boolean; lang?: Lang}> = ({x, frame, yOffset = 0, compact = false, lang = 'ja'}) => {
  const t = SEQ_TEXTS[lang];
  const items = [
    {name: t.modeFree, badge: 'Free', color: palette.blue, fill: '#ffffff', y: 114, kind: 'free' as const},
    {name: t.modeStrict, badge: 'Pro', color: palette.yellow, fill: '#fffaf0', y: 214, kind: 'strict' as const},
    {name: t.modeBuddy, badge: 'Pro', color: palette.red, fill: '#fff6f5', y: 314, kind: 'buddy' as const},
  ];

  return (
    <>
      {items.map((item, index) => {
        const progress = springAt(frame, 8 + index * 10, 18);
        return (
          <div
            key={item.name}
            style={abs({
              left: x + (compact ? 120 : 38),
              top: item.y + yOffset,
              width: compact ? 400 : 562,
              height: compact ? 60 : 82,
              borderRadius: 28,
              backgroundColor: item.fill,
              border: `2px solid ${item.color}`,
              transform: `translateX(${(1 - progress) * 74}px) scale(${0.92 + progress * 0.08})`,
              opacity: progress,
            })}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: compact ? '10px 14px' : '18px 22px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <ModeIcon kind={item.kind} color={item.color} />
                <div style={{fontSize: compact ? 20 : 31, fontWeight: 800, color: item.color}}>{item.name}</div>
              </div>
              <div style={{padding: compact ? '6px 10px' : '7px 12px', borderRadius: 999, backgroundColor: item.color, color: '#fff', fontSize: compact ? 12 : 14, fontWeight: 800, textTransform: 'uppercase'}}>{item.badge}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const CatsPanel: React.FC<{x: number; frame: number; yOffset?: number; compact?: boolean}> = ({x, frame, yOffset = 0, compact = false}) => {
  const size = 68;
  const anchors = compact
    ? [
        {x: 152, y: 120},
        {x: 236, y: 120},
        {x: 320, y: 120},
        {x: 404, y: 120},
        {x: 488, y: 120},
        {x: 152, y: 200},
        {x: 236, y: 200},
        {x: 320, y: 200},
        {x: 404, y: 200},
        {x: 488, y: 200},
        {x: 152, y: 280},
        {x: 236, y: 280},
        {x: 320, y: 280},
        {x: 404, y: 280},
        {x: 488, y: 280},
      ]
    : [
    {x: 320, y: 180},
    {x: 236, y: 180},
    {x: 404, y: 180},
    {x: 320, y: 100},
    {x: 320, y: 260},
    {x: 152, y: 100},
    {x: 236, y: 100},
    {x: 404, y: 100},
    {x: 488, y: 100},
    {x: 152, y: 180},
    {x: 488, y: 180},
    {x: 152, y: 260},
    {x: 236, y: 260},
    {x: 404, y: 260},
    {x: 488, y: 260},
    {x: 152, y: 340},
    {x: 236, y: 340},
    {x: 320, y: 340},
    {x: 404, y: 340},
    {x: 488, y: 340},
  ];

  return (
    <>
      <div style={abs({left: x + 248, top: 132 + yOffset, width: 144, height: 144, borderRadius: 999, background: 'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(230,244,234,0.94) 52%, rgba(230,244,234,0) 78%)'})} />
      {anchors.map((anchor, index) => {
        const delay = index === 0 ? 8 : index <= 4 ? 26 + (index - 1) * 2 : 42 + (index - 5) * 2;
        const progress = springAt(frame, delay, 14, 84, 260);
        const pop = interpolate(progress, [0, 0.7, 1], [0, 1.16, 1]);
        return (
          <motion.div
            key={index}
            style={abs({
              left: x + anchor.x - size / 2,
              top: anchor.y + yOffset - size / 2,
              width: size,
              height: size,
              opacity: progress,
              transform: `scale(${pop})`,
            })}
            animate={{opacity: 1}}
            transition={{duration: 0.01}}
          >
            <PixelCatIcon index={index} size={size} />
          </motion.div>
        );
      })}
    </>
  );
};

const AnalysisPanel: React.FC<{x: number; frame: number; yOffset?: number; compact?: boolean; lang?: Lang}> = ({x, frame, yOffset = 0, compact = false, lang = 'ja'}) => {
  const t = SEQ_TEXTS[lang];
  const lineDraw = springAt(frame, 12, 22);
  const chartTop = 56;
  const chartBottom = 228;
  const chartLeft = 60;
  const stepX = 74;
  const maxValue = 180;
  const values = [172, 156, 140, 118, 98, 82, 64];
  const yForValue = (value: number) => chartBottom - (value / maxValue) * (chartBottom - chartTop);
  const animatedValues = values.map((value, index) => interpolate(lineDraw, [0, 1], [maxValue - 10 + index * 2, value]));
  const pointYs = animatedValues.map((value) => yForValue(value));
  const path = pointYs.map((point, index) => `${index === 0 ? 'M' : 'L'} ${chartLeft + index * stepX} ${point}`).join(' ');

  return (
    <>
      <svg width="600" height="250" viewBox="0 0 600 250" style={abs({left: x + (compact ? 48 : 20), top: 118 + yOffset})}>
        {[180, 120, 60, 0].map((tick) => (
          <line key={tick} x1={chartLeft - 4} x2="566" y1={yForValue(tick)} y2={yForValue(tick)} stroke={palette.grid} strokeWidth="1" />
        ))}
        <line x1={chartLeft - 4} x2={chartLeft - 4} y1={chartTop} y2={chartBottom} stroke={palette.grid} strokeWidth="1" />
        <path d={path} fill="none" stroke={palette.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${lineDraw * 520} 720`} />
        {pointYs.map((point, index) => {
          const active = index === pointYs.length - 1;
          return (
            <React.Fragment key={index}>
              {active ? <line x1={chartLeft + index * stepX} x2={chartLeft + index * stepX} y1={chartTop} y2={chartBottom} stroke={palette.blue} strokeWidth="1" strokeDasharray="4,3" /> : null}
              <circle cx={chartLeft + index * stepX} cy={point} r="6" fill={active ? palette.green : palette.blue} stroke="#ffffff" strokeWidth="2" opacity={springAt(frame, 20 + index * 2, 12)} />
            </React.Fragment>
          );
        })}
      </svg>
      {[
        {label: '3h', value: 180},
        {label: '2h', value: 120},
        {label: '1h', value: 60},
        {label: '0', value: 0},
      ].map((tick) => (
        <div key={tick.label} style={abs({left: x + (compact ? 24 : 0), top: 118 + yOffset + yForValue(tick.value) - 8, width: 40, textAlign: 'right', fontSize: 14, color: '#94a3b8'})}>{tick.label}</div>
      ))}
      {t.dayLabels.map((label, index) => (
        <div key={label} style={abs({left: x + (compact ? 74 : 46) + index * 74, top: 354 + yOffset, width: 40, textAlign: 'center', fontSize: 14, color: '#94a3b8', opacity: springAt(frame, 24 + index * 2, 10)})}>{label}</div>
      ))}
    </>
  );
};

export const FeatureTriptychStudy: React.FC<{sequenceMode?: boolean; sharedBackground?: boolean; lang?: Lang}> = ({sequenceMode = false, sharedBackground = false, lang = 'ja'}) => {
  const frame = useCurrentFrame();
  const t = SEQ_TEXTS[lang];
  const labelTop = sequenceMode ? 132 : 34;
  const contentOffset = sequenceMode ? 44 : 0;
  const phoneTop = sequenceMode ? 466 : 432;

  return (
    <AbsoluteFill style={{backgroundColor: sharedBackground ? 'transparent' : '#ffffff', overflow: 'hidden', fontFamily: t.fontFamily}}>
      {sharedBackground ? null : <div style={abs({inset: 0, background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />}
      {sequenceMode ? null : <div style={abs({left: 640, top: 0, width: 1, height: 1080, backgroundColor: 'rgba(0,0,0,0.08)'})} />}
      {sequenceMode ? null : <div style={abs({left: 1280, top: 0, width: 1, height: 1080, backgroundColor: 'rgba(0,0,0,0.08)'})} />}
      {sharedBackground ? null : <div style={abs({left: 0, top: 0, width: 640, height: 1080, background: 'radial-gradient(circle at 12% 14%, rgba(232,240,254,0.78), transparent 30%)'})} />}
      {sharedBackground ? null : <div style={abs({left: 640, top: 0, width: 640, height: 1080, background: 'radial-gradient(circle at 50% 14%, rgba(230,244,234,0.82), transparent 30%)'})} />}
      {sharedBackground ? null : <div style={abs({left: 1280, top: 0, width: 640, height: 1080, background: 'radial-gradient(circle at 88% 14%, rgba(252,232,230,0.86), transparent 30%)'})} />}

      <ColumnLabel x={0} color={palette.blue} text="mode select" top={labelTop} compact={sequenceMode} />
      <ColumnLabel x={640} color={palette.green} text="pixel cats" top={labelTop} compact={sequenceMode} />
      <ColumnLabel x={1280} color={palette.red} text="analysis" top={labelTop} compact={sequenceMode} />

      <ModesPanel x={0} frame={frame} yOffset={contentOffset} compact={sequenceMode} lang={lang} />
      <CatsPanel x={640} frame={frame} yOffset={contentOffset + 72} compact={sequenceMode} />
      <AnalysisPanel x={1280} frame={frame} yOffset={contentOffset - 4} compact={sequenceMode} lang={lang} />

      <PhoneFrame x={0} src="select_mode.png" frame={frame} delay={20} shiftY={6} baseTop={phoneTop} lang={lang} />
      <PhoneFrame x={640} src="catsfile.png" frame={frame} delay={26} shiftY={8} baseTop={phoneTop} lang={lang} />
      <PhoneFrame x={1280} src="analysis_1.png" frame={frame} delay={32} shiftY={6} baseTop={phoneTop} lang={lang} />
    </AbsoluteFill>
  );
};
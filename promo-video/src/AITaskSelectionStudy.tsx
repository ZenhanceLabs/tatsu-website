import {motion} from 'framer-motion';
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

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
  border: 'rgba(0, 0, 0, 0.08)',
  grid: '#e8eaed',
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const springAt = (frame: number, start: number, duration: number, damping = 90, stiffness = 220) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping, stiffness, mass: 0.82},
  });

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#ffffff',
  borderRadius: 24,
  border: `1px solid ${palette.border}`,
  ...extra,
});

const tasks = [
  {app: 'YouTube', icon: 'Youtube.webp', rule: '1日60分まで', type: 'total-cap', accent: palette.blue, fill: palette.blueSoft, ai: true},
  {app: 'Instagram', icon: 'Instagram.webp', rule: '起動前に10秒待機', type: 'launch-delay', accent: palette.green, fill: palette.greenSoft, ai: true},
  {app: 'X', icon: 'X.webp', rule: '22時以降は停止', type: 'heavy-cut', accent: palette.red, fill: palette.redSoft, ai: true},
  {app: 'Chrome', icon: 'Chrome.webp', rule: '起動回数を制限', type: 'launch-limit', accent: palette.blue, fill: palette.blueSoft, ai: false},
  {app: 'LINE', icon: 'LINE.webp', rule: '30分で終了', type: 'session-limit', accent: palette.green, fill: palette.greenSoft, ai: false},
  {app: 'YouTube', icon: 'Youtube.webp', rule: '深夜は起動停止', type: 'heavy-cut', accent: palette.red, fill: palette.redSoft, ai: false},
] as const;

const tokenLabels: Record<(typeof tasks)[number]['type'], string> = {
  'total-cap': 'CAP',
  'launch-delay': 'WAIT',
  'heavy-cut': 'CUT',
  'launch-limit': 'LIMIT',
  'session-limit': 'END',
};

const TaskCard: React.FC<{
  frame: number;
  index: number;
  app: string;
  icon: string;
  rule: string;
  type: (typeof tasks)[number]['type'];
  accent: string;
  fill: string;
  ai: boolean;
}> = ({frame, index, app, icon, rule, type, accent, fill, ai}) => {
  const inStart = 10 + index * 10;
  const inProgress = springAt(frame, inStart, 18);
  const selectStart = 92 + index * 7;
  const selectProgress = springAt(frame, selectStart, 20);
  const fadeOut = ai ? 1 : 1 - springAt(frame, 102 + index * 5, 16);
  const targetTop = ai ? 168 + [0, 1, 2].indexOf(index) * 150 : 148 + index * 118;
  const targetLeft = ai ? 960 : 224 + index * 52;
  const startLeft = 68 + index * 250;
  const startTop = 592 - (index % 2) * 26;
  const left = interpolate(selectProgress, [0, 1], [startLeft, targetLeft]);
  const top = interpolate(selectProgress, [0, 1], [startTop, targetTop]);
  const scale = ai ? interpolate(selectProgress, [0, 1], [1, 1.06]) : interpolate(selectProgress, [0, 1], [1, 0.94]);
  const ring = ai ? springAt(frame, selectStart + 8, 16) : 0;

  return (
    <motion.div
      style={{
        ...abs({left, top, width: ai ? 720 : 520, padding: 16}),
        ...card({backgroundColor: ai ? '#ffffff' : '#fbfdff'}),
        opacity: inProgress * fadeOut,
        transform: `translateY(${(1 - inProgress) * 28}px) scale(${scale})`,
        zIndex: ai ? 4 : 2,
      }}
      animate={{opacity: 1}}
      transition={{duration: 0.01}}
    >
      <div style={{display: 'grid', gridTemplateColumns: '4px 52px 1fr 78px 40px', gap: 14, alignItems: 'center'}}>
        <div style={{width: 4, height: 86, borderRadius: 3, backgroundColor: accent}} />
        <div style={{width: 52, height: 52, borderRadius: 18, backgroundColor: fill, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <Img src={staticFile(icon)} style={{width: 38, height: 38, objectFit: 'contain'}} />
        </div>
        <div>
          <div style={{fontSize: 30, fontWeight: 800, color: palette.text}}>{app}</div>
          <div style={{fontSize: 18, color: palette.muted, marginTop: 4}}>{rule}</div>
        </div>
        <div style={{justifySelf: 'start', padding: '8px 12px', borderRadius: 999, backgroundColor: fill, color: accent, fontSize: 12, fontWeight: 800, letterSpacing: 1.2}}>{tokenLabels[type]}</div>
        <div style={{position: 'relative', width: 34, height: 34}}>
          <div style={{width: 34, height: 34, borderRadius: 17, border: `2px solid ${ai ? accent : palette.grid}`, backgroundColor: ai ? accent : '#fff'}} />
          {ai ? <div style={abs({left: 11, top: 8, color: '#fff', fontSize: 14, fontWeight: 800})}>✓</div> : null}
          {ai ? <div style={abs({left: 17 - 18 * ring, top: 17 - 18 * ring, width: 36 * ring, height: 36 * ring, borderRadius: 999, border: `2px solid ${accent}`, opacity: 1 - ring})} /> : null}
        </div>
      </div>
      {ai ? (
        <div style={abs({right: 18, top: 18, padding: '7px 10px', borderRadius: 999, backgroundColor: `${accent}20`, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 1})}>AI</div>
      ) : null}
    </motion.div>
  );
};

export const AITaskSelectionStudy: React.FC = () => {
  const frame = useCurrentFrame();
  const beam = springAt(frame, 82, 24);
  const titleIn = springAt(frame, 8, 18);

  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff', overflow: 'hidden', fontFamily: '"Noto Sans JP", sans-serif'}}>
      <div style={abs({inset: 0, background: 'radial-gradient(circle at 12% 18%, rgba(232,240,254,0.9), transparent 28%), radial-gradient(circle at 88% 22%, rgba(230,244,234,0.92), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />
      <div style={abs({left: 120, top: 84, opacity: titleIn})}>
        <div style={{fontSize: 16, fontWeight: 800, letterSpacing: 2.4, color: palette.blue, textTransform: 'uppercase'}}>tatsu-agent</div>
        <div style={{fontSize: 92, fontWeight: 900, color: palette.text, lineHeight: 1.02, marginTop: 14}}>AIが選ぶ</div>
      </div>
      <div style={abs({left: 112, top: 206, width: 560, height: 2, backgroundColor: palette.grid, opacity: titleIn})} />

      <div style={abs({left: 930, top: 120, width: 780, height: 620, borderRadius: 40, background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(232,240,254,0.55) 100%)', border: `1px solid ${palette.border}`})} />
      <div style={abs({left: 1210 - 240 * beam, top: 126, width: 480 * beam, height: 608, background: 'radial-gradient(circle, rgba(26,115,232,0.16) 0%, rgba(26,115,232,0.08) 42%, rgba(26,115,232,0) 74%)', opacity: beam})} />
      <div style={abs({left: 1212, top: 96, width: 2, height: 668, backgroundColor: `rgba(26,115,232,${beam * 0.35})`})} />

      {tasks.map((task, index) => (
        <TaskCard
          key={`${task.app}-${index}`}
          frame={frame}
          index={index}
          app={task.app}
          icon={task.icon}
          rule={task.rule}
          type={task.type}
          accent={task.accent}
          fill={task.fill}
          ai={task.ai}
        />
      ))}
    </AbsoluteFill>
  );
};
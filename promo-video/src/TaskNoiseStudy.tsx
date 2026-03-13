import {motion} from 'framer-motion';
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

const palette = {
  blue: '#1a73e8',
  blueSoft: '#e8f0fe',
  green: '#137333',
  greenSoft: '#e6f4ea',
  red: '#c5221f',
  redSoft: '#fce8e6',
  text: '#202124',
  muted: '#5f6368',
  surface: '#f8f9fa',
  border: 'rgba(0, 0, 0, 0.08)',
  grid: '#e8eaed',
};

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const springAt = (frame: number, start: number, duration: number) =>
  spring({
    fps: 30,
    frame: frame - start,
    durationInFrames: duration,
    config: {damping: 90, stiffness: 260, mass: 0.75},
  });

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#ffffff',
  borderRadius: 24,
  border: `1px solid ${palette.border}`,
  ...extra,
});

const tasks = [
  {start: 28, appName: 'YouTube', rule: '1日60分まで', accent: palette.blue, icon: 'Youtube.webp', titleStrikeWidth: 132, ruleStrikeWidth: 138},
  {start: 56, appName: 'Instagram', rule: '起動前に10秒待機', accent: palette.green, icon: 'Instagram.webp', titleStrikeWidth: 156, ruleStrikeWidth: 164},
  {start: 84, appName: 'X', rule: '22時以降は停止', accent: palette.red, icon: 'X.webp', titleStrikeWidth: 28, ruleStrikeWidth: 130},
  {start: 112, appName: 'Chrome', rule: '起動回数を制限', accent: palette.blue, icon: 'Chrome.webp', titleStrikeWidth: 112, ruleStrikeWidth: 142},
  {start: 140, appName: 'LINE', rule: '30分で終了', accent: palette.green, icon: 'LINE.webp', titleStrikeWidth: 72, ruleStrikeWidth: 108},
  {start: 168, appName: 'Instagram', rule: '通知からは開かない', accent: palette.red, icon: 'Instagram.webp', titleStrikeWidth: 156, ruleStrikeWidth: 168},
] as const;

const dayLabels = ['月', '火', '水', '木', '金', '土', '日'];
const barHeights = [500, 486, 470, 452, 438, 424, 412];
const barAccents = [palette.red, palette.blue, palette.green, palette.red, palette.blue, palette.green, palette.blue];
const barFills = [palette.redSoft, palette.blueSoft, palette.greenSoft, palette.redSoft, palette.blueSoft, palette.greenSoft, palette.blueSoft];
const sequenceTaskStarts = [24, 72, 120, 168, 216];

const TaskStudyCard: React.FC<{
  frame: number;
  start: number;
  top: number;
  appName: string;
  rule: string;
  accent: string;
  icon: string;
  titleStrikeWidth: number;
  ruleStrikeWidth: number;
}> = ({frame, start, top, appName, rule, accent, icon, titleStrikeWidth, ruleStrikeWidth}) => {
  const enter = springAt(frame, start - 12, 18);
  const complete = springAt(frame, start, 18);
  const done = frame >= start + 8;

  return (
    <motion.div
      style={{
        ...abs({left: 26, top, width: 568, padding: '14px 18px'}),
        ...card({backgroundColor: done ? '#f9fbff' : '#ffffff'}),
        opacity: enter,
        transform: `scale(${done ? 1 - complete * 0.02 : 0.96 + enter * 0.04})`,
      }}
      animate={{opacity: 1}}
      transition={{duration: 0.01}}
    >
      <div style={{display: 'grid', gridTemplateColumns: '4px 52px 1fr 44px', gap: 16, alignItems: 'center'}}>
        <div style={{width: 4, height: 76, borderRadius: 4, backgroundColor: accent}} />
        <div style={{width: 56, height: 56, borderRadius: 18, backgroundColor: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <Img src={staticFile(icon)} style={{width: 40, height: 40, objectFit: 'contain'}} />
        </div>
        <div>
          <div style={{position: 'relative', fontSize: 26, fontWeight: 700, color: palette.text, opacity: done ? 0.55 : 1}}>
            {appName}
            <div style={{...abs({left: 0, top: '50%', width: titleStrikeWidth * complete, height: 3, backgroundColor: accent, transform: 'translateY(-50%)'})}} />
          </div>
          <div style={{position: 'relative', fontSize: 18, color: palette.muted, marginTop: 4, opacity: done ? 0.55 : 1}}>
            {rule}
            <div style={{...abs({left: 0, top: '50%', width: Math.max(0, ruleStrikeWidth * (complete - 0.12)), height: 2, backgroundColor: accent, transform: 'translateY(-50%)'})}} />
          </div>
        </div>
        <div style={{position: 'relative', width: 40, height: 40}}>
          <div style={{width: 40, height: 40, borderRadius: 20, border: `3px solid ${done ? accent : palette.grid}`, backgroundColor: done ? accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 700}}>{done ? '✓' : ''}</div>
          <div style={{...abs({left: 20 - 24 * complete, top: 20 - 24 * complete, width: 48 * complete, height: 48 * complete}), borderRadius: 999, border: `3px solid ${accent}`, opacity: 1 - complete}} />
        </div>
      </div>
    </motion.div>
  );
};

export const TaskNoiseStudy: React.FC<{sequenceMode?: boolean; sharedBackground?: boolean}> = ({sequenceMode = false, sharedBackground = false}) => {
  const frame = useCurrentFrame();
  const lift = springAt(frame, 206, 22);
  const visibleTasks = sequenceMode ? tasks.slice(0, 5) : tasks;
  const visibleBarHeights = sequenceMode ? [500, 438, 370, 304, 250, 214, 186] : barHeights;
  const activeStarts = sequenceMode ? sequenceTaskStarts : tasks.map((task) => task.start);
  const chartCardTop = sequenceMode ? 188 : 116;
  const chartCardHeight = sequenceMode ? 732 : 848;
  const chartPlotTop = sequenceMode ? 96 : 76;
  const chartBaseY = sequenceMode ? 548 : 618;
  const chartGridStep = sequenceMode ? 156 : 180;
  const chartAxisHeight = sequenceMode ? 468 : 544;
  const chartHeightScale = sequenceMode ? 0.82 : 1;
  const chartMinHeight = sequenceMode ? 76 : 90;
  const chartRevealOffset = sequenceMode ? 90 : 120;
  const dayLabelTop = sequenceMode ? 576 : 644;
  const taskCardTop = sequenceMode ? 188 : 116;
  const taskListStart = sequenceMode ? 152 : 90;

  return (
    <AbsoluteFill style={{backgroundColor: sharedBackground ? 'transparent' : '#ffffff', overflow: 'hidden', fontFamily: '"Noto Sans JP", sans-serif'}}>
      {sharedBackground ? null : <div style={abs({inset: 0, background: 'radial-gradient(circle at 14% 18%, rgba(232,240,254,0.85), transparent 30%), radial-gradient(circle at 88% 20%, rgba(230,244,234,0.95), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />}

      <div style={{...abs({left: 0, top: -lift * 920, width: 1920, height: 1080}), transform: `scale(${1 - lift * 0.06})`, transformOrigin: 'center top'}}>
        <div style={abs({left: 600, top: -40, width: 2, height: 260, backgroundColor: `rgba(26,115,232,${lift * 0.55})`})} />
        <div style={abs({left: 1510, top: -40, width: 2, height: 260, backgroundColor: `rgba(26,115,232,${lift * 0.55})`})} />
        <div style={sharedBackground ? abs({left: 86, top: chartCardTop, width: 1040, height: chartCardHeight}) : {...abs({left: 86, top: chartCardTop, width: 1040, height: chartCardHeight}), ...card({padding: 24})}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 4, height: 32, borderRadius: 2, backgroundColor: palette.blue}} />
          <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: palette.blue}}>bar chart</div>
        </div>
        <div style={abs({left: 24, top: 104, width: 992, height: chartCardHeight - 128})}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} style={abs({left: 56, top: chartBaseY - index * chartGridStep, width: 900, height: 2, backgroundColor: palette.grid})} />
          ))}
          <div style={abs({left: 56, top: chartPlotTop, width: 2, height: chartAxisHeight, backgroundColor: palette.grid})} />
          {['0', '1h', '2h', '3h'].map((tick, index) => (
            <div key={tick} style={abs({left: 0, top: chartBaseY - 8 - index * chartGridStep, width: 44, textAlign: 'right', fontSize: 20, color: '#94a3b8'})}>{tick}</div>
          ))}
          {barHeights.map((height, index) => {
            const revealStart = sequenceMode ? (index <= 1 ? 0 : sequenceTaskStarts[index - 2] + 18) : (index === 0 ? 0 : tasks[index - 1].start + 2);
            const reveal = springAt(frame, revealStart, 18);
            const visible = sequenceMode ? index <= 1 || frame >= revealStart : index === 0 || frame >= revealStart;
            const reducedHeight = Math.max(chartMinHeight, visibleBarHeights[index] * chartHeightScale - (1 - reveal) * chartRevealOffset);
            const left = 124 + index * 118;
            const top = chartBaseY - reducedHeight;
            const pulse = sequenceMode ? 1 : activeStarts.some((start) => frame >= start && frame <= start + 8) ? 1 + Math.sin(frame / 2) * 0.05 : 1;
            return (
              <div
                key={index}
                style={abs({
                  left,
                  top,
                  width: 82,
                  height: reducedHeight,
                  borderRadius: '24px 24px 8px 8px',
                  backgroundColor: barFills[index],
                  border: `2px solid ${barAccents[index]}`,
                  transform: `scaleY(${pulse})`,
                  transformOrigin: 'bottom center',
                  opacity: visible ? reveal : 0,
                })}
              />
            );
          })}
          {dayLabels.map((day, index) => {
            const revealStart = sequenceMode ? (index <= 1 ? 0 : sequenceTaskStarts[index - 2] + 18) : (index === 0 ? 0 : tasks[index - 1].start + 2);
            const reveal = springAt(frame, revealStart, 18);
            return (
              <div key={day} style={abs({left: 150 + index * 118, top: dayLabelTop, width: 32, textAlign: 'center', fontSize: 20, color: '#94a3b8', opacity: sequenceMode ? (index <= 1 || frame >= revealStart ? reveal : 0) : (index === 0 || frame >= revealStart ? reveal : 0)})}>{day}</div>
            );
          })}
        </div>
        </div>

        <div style={sharedBackground ? abs({left: 1208, top: taskCardTop, width: 620, height: chartCardHeight}) : {...abs({left: 1208, top: taskCardTop, width: 620, height: chartCardHeight}), ...card({backgroundColor: palette.surface})}}>
        <div style={abs({left: 24, top: 24, display: 'flex', alignItems: 'center', gap: 14})}>
          <div style={{width: 4, height: 32, borderRadius: 2, backgroundColor: palette.blue}} />
          <div style={{fontSize: 16, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: palette.blue}}>task card</div>
        </div>
        {visibleTasks.map((task, index) => (
          <TaskStudyCard
            key={`${task.appName}-${index}`}
            frame={frame}
            start={sequenceMode ? sequenceTaskStarts[index] : task.start}
            top={taskListStart + index * 116}
            appName={task.appName}
            rule={task.rule}
            accent={task.accent}
            icon={task.icon}
            titleStrikeWidth={task.titleStrikeWidth}
            ruleStrikeWidth={task.ruleStrikeWidth}
          />
        ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
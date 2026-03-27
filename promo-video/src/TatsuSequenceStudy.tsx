import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EndingInstallStudy} from './EndingInstallStudy';
import {FeatureTriptychStudy} from './FeatureTriptychStudy';
import {OpeningFlowStudy} from './OpeningFlowStudy';
import {TaskNoiseStudy} from './TaskNoiseStudy';
import {type Lang, SEQ_TEXTS} from './i18n';

const abs = (style: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...style});

const transitionFrames = 24;

const SceneTransition: React.FC<{duration: number; children: React.ReactNode; enterX?: number; exitX?: number; enterY?: number; exitY?: number; exitFade?: boolean}> = ({duration, children, enterX = 0, exitX = 0, enterY = 0, exitY = 0, exitFade = false}) => {
  const frame = useCurrentFrame();
  const enter = spring({
    fps: 30,
    frame,
    durationInFrames: transitionFrames,
    config: {damping: 100, stiffness: 240, mass: 0.9},
  });
  const exit = spring({
    fps: 30,
    frame: frame - (duration - transitionFrames),
    durationInFrames: transitionFrames,
    config: {damping: 100, stiffness: 240, mass: 0.9},
  });
  const translateX = interpolate(frame, [0, transitionFrames, duration - transitionFrames, duration], [enterX, 0, 0, exitX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, transitionFrames, duration - transitionFrames, duration], [enterY, 0, 0, exitY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = exitFade ? interpolate(frame, [duration - transitionFrames, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity, transform: `translateX(${translateX}px) translateY(${translateY}px)`}}>{children}</AbsoluteFill>;
};

const CaptionOverlay: React.FC<{text: string; exitStart?: number; fontFamily?: string}> = ({text, exitStart, fontFamily = '"Noto Sans JP", sans-serif'}) => {
  const frame = useCurrentFrame();
  const slideIn = spring({
    fps: 30,
    frame,
    durationInFrames: 18,
    config: {damping: 100, stiffness: 240, mass: 0.86},
  });
  const slideOut = exitStart === undefined ? 0 : interpolate(frame, [exitStart, exitStart + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = exitStart === undefined ? slideIn : Math.min(slideIn, 1 - slideOut);
  return (
    <div
      style={{
        ...abs({left: 88, top: 52, width: 1500}),
        opacity,
        transform: `translateY(${(1 - slideIn) * 32 - slideOut * 120}px)`,
      }}
    >
      <div style={{fontFamily, fontSize: 44, lineHeight: 1.15, fontWeight: 900, color: '#202124', whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};

export const TatsuSequenceStudy: React.FC<{lang?: Lang}> = ({lang = 'ja'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = SEQ_TEXTS[lang];

  const openingStart = 0;
  const openingDuration = 150;
  const taskStart = openingStart + openingDuration;
  const taskDuration = 240;
  const featureStart = taskStart + taskDuration - transitionFrames;
  const featureDuration = 210;
  const endingStart = featureStart + featureDuration;
  const endingDuration = durationInFrames - endingStart;
  const showMiddleStage = frame >= taskStart && frame < endingStart;
  const middleStageOpacity = interpolate(frame, [taskStart, taskStart + 12, endingStart - 12, endingStart], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff', overflow: 'hidden'}}>
      <div style={abs({inset: 0, background: 'radial-gradient(circle at 16% 18%, rgba(232,240,254,0.9), transparent 30%), radial-gradient(circle at 84% 22%, rgba(230,244,234,0.9), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'})} />
      {showMiddleStage ? (
        <>
          <div style={{...abs({left: 58, top: 120, width: 1804, height: 858, borderRadius: 44, background: 'linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.42) 100%)', border: '1px solid rgba(0,0,0,0.06)'}), opacity: middleStageOpacity}} />
          <div style={{...abs({left: 118, top: 160, width: 500, height: 500, borderRadius: 999, background: 'radial-gradient(circle, rgba(232,240,254,0.5) 0%, rgba(232,240,254,0) 72%)'}), opacity: middleStageOpacity}} />
          <div style={{...abs({left: 710, top: 184, width: 500, height: 500, borderRadius: 999, background: 'radial-gradient(circle, rgba(230,244,234,0.46) 0%, rgba(230,244,234,0) 72%)'}), opacity: middleStageOpacity}} />
          <div style={{...abs({left: 1290, top: 168, width: 500, height: 500, borderRadius: 999, background: 'radial-gradient(circle, rgba(252,232,230,0.42) 0%, rgba(252,232,230,0) 72%)'}), opacity: middleStageOpacity}} />
        </>
      ) : null}
      <Sequence from={openingStart} durationInFrames={openingDuration}>
        <SceneTransition duration={openingDuration} exitY={160} exitFade>
          <OpeningFlowStudy sharedBackground lang={lang} />
        </SceneTransition>
      </Sequence>

      <Sequence from={taskStart} durationInFrames={taskDuration}>
        <SceneTransition duration={taskDuration} exitY={-180}>
          <TaskNoiseStudy sequenceMode sharedBackground lang={lang} />
          <CaptionOverlay
            text={t.captionTask}
            exitStart={206}
            fontFamily={t.fontFamily}
          />
        </SceneTransition>
      </Sequence>

      <Sequence from={featureStart} durationInFrames={featureDuration}>
        <SceneTransition duration={featureDuration} enterY={180}>
          <FeatureTriptychStudy sequenceMode sharedBackground lang={lang} />
          <CaptionOverlay
            text={t.captionFeature}
            fontFamily={t.fontFamily}
          />
        </SceneTransition>
      </Sequence>

      <Sequence from={endingStart} durationInFrames={endingDuration}>
        <SceneTransition duration={endingDuration} enterY={140}>
          <EndingInstallStudy sharedBackground lang={lang} />
        </SceneTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

// Language-specific wrapper components
export const TatsuSequenceStudyEN: React.FC = () => <TatsuSequenceStudy lang="en" />;
export const TatsuSequenceStudyKO: React.FC = () => <TatsuSequenceStudy lang="ko" />;
import {Composition} from 'remotion';
import {AITaskSelectionStudy} from './AITaskSelectionStudy';
import {EndingInstallStudy} from './EndingInstallStudy';
import {FeatureTriptychStudy} from './FeatureTriptychStudy';
import {OpeningFlowStudy} from './OpeningFlowStudy';
import {TatsuSequenceStudy} from './TatsuSequenceStudy';
import {TatsuPromo} from './TatsuPromo';
import {TaskNoiseStudy} from './TaskNoiseStudy';
import {UsageCatsStudy} from './UsageCatsStudy';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="TatsuPromo"
        component={TatsuPromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="TaskNoiseStudy"
        component={TaskNoiseStudy}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="UsageCatsStudy"
        component={UsageCatsStudy}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="FeatureTriptychStudy"
        component={FeatureTriptychStudy}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="OpeningFlowStudy"
        component={OpeningFlowStudy}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="AITaskSelectionStudy"
        component={AITaskSelectionStudy}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="EndingInstallStudy"
        component={EndingInstallStudy}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="TatsuSequenceStudy"
        component={TatsuSequenceStudy}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};

import React from 'react';
import { Composition, Still } from 'remotion';
import { FPS, getVariant, theme, VariantName } from './config';
import { AcademicInfluencerAd, AdProps } from './compositions/AcademicInfluencerAd';
import { ReelCover } from './compositions/ReelCover';

const ids: Record<VariantName, string> = {
  full: 'AcademicInfluencerAd',
  nocaptions: 'AcademicInfluencerAdNoCaptions',
  short: 'AcademicShortAd',
  story: 'AcademicStoryAd',
};

export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(ids) as VariantName[]).map((name) => (
      <Composition<any, AdProps>
        key={name}
        id={ids[name]}
        component={AcademicInfluencerAd}
        durationInFrames={getVariant(name).total}
        fps={FPS}
        width={theme.output.width}
        height={theme.output.height}
        defaultProps={{ variant: name, safeAreaDebug: false }}
      />
    ))}
    <Still id="ReelCover" component={ReelCover} width={theme.output.width} height={theme.output.height} />
  </>
);

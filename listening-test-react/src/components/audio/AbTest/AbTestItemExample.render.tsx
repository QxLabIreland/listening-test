import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { AudioExampleModel, AudioFileModel } from '../../../shared/models/AudioTestModel';
import { SurveyControlRender } from '../../forms/SurveyControl.render';
import { AudioSectionLoopingController } from '../../web-audio/AudioSectionLoopingController';
import { AudioLoading, useAllAudioRefsReady } from '../../web-audio/AudiosLoading';
import { AudioButton, AudioController, useAudioPlayer } from '../../web-audio/AudiosPlayer';

const alphabetList = Array.apply(undefined, Array(26))
  .map((x, y) => String.fromCharCode(y + 65))
  .join('');

export const AbTestItemExampleRender = observer(function (props: { value: AudioExampleModel; active?: boolean }) {
  const { value, active } = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {
    refs,
    sampleRef,
    currentTime,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
    resetCurrentTime,
    prevPlayedAudio,
  } = useAudioPlayer(value.medias, value.mediaRef, value);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioRefsReady(allRefs);
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  // To over
  const handlePlayOverride: typeof handlePlay = (current: AudioFileModel) => {
    if (value.settings?.alwaysStartFrom0 && current !== prevPlayedAudio) resetCurrentTime();
    handlePlay(current);
  };

  return (
    <>
      <AudioLoading showing={loading} />
      <Grid container spacing={2} style={{ display: loading ? 'none' : 'flex' }}>
        {value.medias.map(
          (v, i) =>
            v && (
              <Grid item key={i}>
                <AudioButton
                  ref={refs[i]}
                  audio={v}
                  onPlay={handlePlayOverride}
                  onPause={handlePause}
                  onEnded={i === 0 ? handleEnded : undefined}
                  onTimeUpdate={i === 0 ? (onTimeUpdate ? onTimeUpdate : handleTimeUpdate) : undefined}
                >
                  {value.fields[0]?.options[i] || alphabetList[i]}
                </AudioButton>
                {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
              </Grid>
            )
        )}

        {/*Reference*/}
        {value.mediaRef && (
          <Grid item>
            <AudioButton ref={sampleRef} audio={value.mediaRef} onPlay={handlePlayOverride} onPause={handlePause}>
              Ref
            </AudioButton>
            {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
          </Grid>
        )}

        {value.fields?.map((value, i) => (
          <Grid item xs={12} key={i}>
            <SurveyControlRender control={value} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <AudioController
            refs={refs}
            sampleRef={sampleRef}
            currentTime={currentTime}
            disabled={value.settings?.disablePlayerSlider}
          />
          {value.settings?.sectionLooping && (
            <AudioSectionLoopingController
              setTimeUpdate={(f) => setOnTimeUpdate(f)}
              refs={allRefs}
              currentTime={currentTime}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
});

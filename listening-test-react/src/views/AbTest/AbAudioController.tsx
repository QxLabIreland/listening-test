import {observer} from "mobx-react";
import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";

export const AbAudioController = observer(function (props: { value: ItemExampleModel, active: boolean }) {
  const {value, active} = props;
  const {refs, sampleRef, currentTime, onTimeUpdate, onPlay, onPause} = useAudioPlayer(value.audios, value.audioRef);

  useEffect(() => {
    if (active === false) onPause();
  }, [active]);

  return (
    <React.Fragment>
      {value.audios.map((v, i) =>
        <Grid item key={i}>
          <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                       onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
        </Grid>
      )}

      {/*Reference Audio*/}
      {value.audioRef && <Grid item>
        <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={onPlay} onPause={onPause}>Ref</AudioButton>
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
      </Grid>
    </React.Fragment>
  )
})

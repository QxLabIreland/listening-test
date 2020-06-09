import {observer} from "mobx-react";
import React, {useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Slider from "@material-ui/core/Slider";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {observable} from "mobx";

export default observer(function AudioController(props: {audios: AudioFileModel[]}) {
  const {audios} = props;

  const [currentTime, setCurrentTime] = useState(0);
  const [refs] = useState(audios.map(() => React.createRef<HTMLAudioElement>()));

  function handlePause() {
    audios.forEach((a, i) => {
      a.isPlaying = false;
      refs[i].current.pause();
    });
  }

  function dragSlider(event, newValue) {
    // Set all audios time
    refs.forEach(r => r.current.currentTime = newValue ? newValue : 0);
  }

  function handleTimeUpdate() {
    setCurrentTime( refs[0].current.currentTime);
  }

  function handlePlay(v) {
    audios.forEach((a, i) => {
      // Adjust properties
      a.isPlaying = a === v;
      refs[i].current.volume = a === v ? 1 : 0;
      // Play after
      refs[i].current.play();
    });
  }

  function handleSliderLabelFormat(num) {
    return isNaN(num) ? 0 : num.toFixed(0) + 's'
  }

  return (
    <React.Fragment>
      {audios.map((v, i) => i === 0
        ? <audio key={v.filename} src={v.src} controls loop ref={refs[i]} onTimeUpdate={handleTimeUpdate}
                 style={{display: 'none'}}/>
        : <audio key={v.filename} src={v.src} controls loop ref={refs[i]} style={{display: 'none'}}/>
      )}

      {audios.map((v, i) =>
        <Grid item xs={6} key={v.filename}>
          <Button variant={v.isPlaying ? 'contained' : 'outlined'} color="primary" size="large"
                  startIcon={<Icon>audiotrack</Icon>}
                  onClick={() => v.isPlaying ? handlePause() : handlePlay(v)}>Audio {i + 1}</Button>
        </Grid>
      )}

      <Grid item xs={12}>
        <div style={{padding: '0 8px'}}>
          <Slider aria-labelledby="continuous-slider" defaultValue={0} step={0.1} min={0}
                  max={refs[0].current?.duration} value={currentTime} onChange={dragSlider}
                  valueLabelDisplay="auto" valueLabelFormat={handleSliderLabelFormat}/>
        </div>
      </Grid>
    </React.Fragment>
  )
})

import {observer} from "mobx-react";
import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Slider from "@material-ui/core/Slider";
import {AudioModel} from "../../shared/models/AudioModel";

export default observer(function AudioController(props: {audios: AudioModel[]}) {
  const {audios} = props;

  const [currentTime, setCurrentTime] = useState(0);

  function handlePause() {
    audios.forEach(a => {
      a.isPlaying = false;
      a.ref.current.pause();
    });
  }

  function dragSlider(event, newValue) {
    // Set all audios time
    audios.forEach(a => a.ref.current.currentTime = newValue ? newValue : 0);
  }

  function handleTimeUpdate() {
    setCurrentTime( audios[0].ref.current.currentTime);
  }

  function handlePlay(v) {
    audios.forEach(a => {
      // Adjust properties
      a.isPlaying = a === v;
      a.ref.current.volume = a === v ? 1 : 0;
      // Play after
      a.ref.current.play();
    });
  }

  function handleSliderLabelFormat(num) {
    return isNaN(num) ? 0 : num.toFixed(0) + 's'
  }

  return (
    <React.Fragment>
      {audios.map((v, i) => i === 0
        ? <audio key={v.filename} src={v.src} controls loop ref={v.ref} onTimeUpdate={handleTimeUpdate}
                 style={{display: 'none'}}/>
        : <audio key={v.filename} src={v.src} controls loop ref={v.ref} style={{display: 'none'}}/>
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
                  max={audios[0].ref.current.duration} value={currentTime} onChange={dragSlider}
                  valueLabelDisplay="auto" valueLabelFormat={handleSliderLabelFormat}/>
        </div>
      </Grid>
    </React.Fragment>
  )
})

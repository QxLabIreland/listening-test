import {observer} from "mobx-react";
import {SurveyControlRender} from "../../../shared/components/SurveyControl.render";
import React, {useEffect, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Button} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";


export const VideoAbExampleRender = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item, active} = props;
  const [refs] = useState<HTMLVideoElement[]>([]);
  const [playing, setPlaying] = useState<boolean>();

  useEffect(() => {
    if (active === false) handlePause();
    else handlePlay();
  }, [active]);

  const handlePause = () => {
    refs.forEach(r => r.pause());
    setPlaying(false);
  }

  const handlePlay = () => {
    refs.forEach(v => {
      v.play().then();
      v.currentTime = refs[0].currentTime;
    });
    setPlaying(true);
  }

  return <Grid container spacing={2}>
    {/*Videos*/}
    {item.example.medias.map((v, i) =>
      <video width="50%" src={v.src} ref={r => refs[i] = r}/>
    )}
    <Grid item xs>
      <Button color="primary" size="large" variant={playing ? 'contained' : 'outlined'}
              startIcon={<Icon>{playing ? 'pause' : 'play_arrow'}</Icon>}
              onClick={() => playing ? handlePause() : handlePlay()}>{playing ? 'Stop' : 'Play'}</Button>
    </Grid>

    {/*Questions*/}
    {item.example.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <SurveyControlRender control={value}/>
    </Grid>)}
  </Grid>;
})

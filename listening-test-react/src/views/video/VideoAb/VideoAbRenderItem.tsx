import {observer} from "mobx-react";
import {TestItemType} from "../../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import React, {MouseEvent, useEffect, useRef, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Button, GridList, GridListTile, Theme} from "@material-ui/core";
import {useSharedStyles} from "../../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";


export const VideoAbRenderItem = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
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

  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl}/>
    case TestItemType.example:
      return <Grid container spacing={3}>
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
          <RenderSurveyControl control={value}/>
        </Grid>)}
      </Grid>
    default:
      return null;
  }
})

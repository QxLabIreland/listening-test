import {observer} from "mobx-react";
import {TestItemType} from "../../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import React, {useEffect, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {GridList, GridListTile} from "@material-ui/core";

export const VideoLabelingRenderItem = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item, active} = props;
  const [refs] = useState<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (active === false) handlePause();
    else refs[0].play().then();
  }, [active]);

  const handlePause = () => {
    refs.forEach(r => r.pause());
  }

  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl}/>
    case TestItemType.example:
      return <Grid container spacing={3}>
        {/*Description for the example*/}
        {item.example.fields[0] && <Grid item xs={12}>
          <RenderSurveyControl control={item.example.fields[0]}/>
        </Grid>}
        {/*Video grids*/}
        <GridList cellHeight="auto" cols={1}>
          {item.example.medias.map((v, i) => <GridListTile key={i}>
            <video src={v.src} controls ref={r => refs[i] = r} width="100%"/>
          </GridListTile>)}
        </GridList>
        {/*Questions*/}
        {item.example.fields.slice(1)?.map((value, i) => <Grid item xs={12} key={i}>
          <RenderSurveyControl control={value}/>
        </Grid>)}
      </Grid>
    default:
      return null;
  }
})

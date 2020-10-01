import {observer} from "mobx-react";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import React, {useState} from "react";
import {ImageTestItemModel} from "../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Dialog, GridList, GridListTile, Slide} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";

export const ImageLabelingRenderItem = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item} = props;
  const [openedImg, setOpenedImg] = useState<string>();

  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl}/>
    case TestItemType.example:
      return <Grid container spacing={3}>
        {/*Description for the example*/}
        {item.example.fields[0] && <Grid item xs={12}>
          <RenderSurveyControl control={item.example.fields[0]}/>
        </Grid>}
        {/*Images grids*/}
        <GridList cellHeight={160} cols={3}>
          {item.example.medias.map((v, i) => <GridListTile key={i} onClick={() => setOpenedImg(v.src)}>
            <img src={v.src} alt={v.filename} />
          </GridListTile>)}
        </GridList>
        {/*Questions*/}
        {item.example.fields.slice(1)?.map((value, i) => <Grid item xs={12} key={i}>
          <RenderSurveyControl control={value}/>
        </Grid>)}
        <Dialog fullScreen open={openedImg !== undefined} onClose={() => setOpenedImg(undefined)}
                TransitionComponent={Transition}>
          <div style={{overflow: 'auto'}}>
            <img src={openedImg} alt="Grid List" onClick={() => setOpenedImg(undefined)} style={{width: '100%'}}/>
          </div>
        </Dialog>
      </Grid>
    default:
      return null;
  }
})

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

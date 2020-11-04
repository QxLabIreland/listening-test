import {observer} from "mobx-react";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import React, {CSSProperties, useRef, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Dialog, GridList, GridListTile, Slide} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";
import {useSharedStyles} from "../../SharedStyles";

export const ImageLabelingExampleRender = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item} = props;
  const [openedImg, setOpenedImg] = useState<string>();
  const classes = useSharedStyles();
  const colsNum = item.example.medias.length < 3 ? item.example.medias.length : 3;

  return <Grid container spacing={3}>
    {/*Description for the example*/}
    {item.example.fields[0] && <Grid item xs={12}>
      <RenderSurveyControl control={item.example.fields[0]}/>
    </Grid>}
    {/*Images grids*/}
    <GridList cols={colsNum} className={classes.fullWidth} cellHeight={'auto'}>
      {item.example.medias.map((v, i) => <GridListTile key={i} onClick={() => setOpenedImg(v.src)}>
        <img src={v.src} alt={v.filename} className={classes.cursorPointer}/>
      </GridListTile>)}
    </GridList>
    {/*Questions*/}
    {item.example.fields.slice(1)?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}
    <PreviewDialog openedImg={openedImg} setOpenedImg={setOpenedImg}/>
  </Grid>;
})

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PreviewDialog({openedImg, setOpenedImg}: { openedImg: string, setOpenedImg: (_: string) => void }) {
  const openedImgRef = useRef<HTMLImageElement>();
  // Change the way of how image filled whole screen
  const [openedImgStyle, setOpenedImgStyle] = useState<CSSProperties>({height: '100%'});
  const classes = useSharedStyles();

  // When image loaded after src changed
  const handleLoad = () => setOpenedImgStyle(
    openedImgRef.current?.width / openedImgRef.current?.height > window.innerWidth / window.innerHeight
      ? {width: '100%'} : {height: '100%'}
  );

  return <Dialog fullScreen open={openedImg !== undefined} onClose={() => setOpenedImg(undefined)}
                 TransitionComponent={Transition}>
    <div className={classes.flexCenter}>
      <img src={openedImg} ref={openedImgRef} alt="Grid List" onLoad={handleLoad} className={classes.cursorPointer}
           onClick={() => setOpenedImg(undefined)} style={openedImgStyle}/>
    </div>
  </Dialog>
}

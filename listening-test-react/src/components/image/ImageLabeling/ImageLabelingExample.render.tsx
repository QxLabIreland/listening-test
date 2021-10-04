import {observer} from "mobx-react";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import React, {CSSProperties, useRef, useState} from "react";
import {ImageFileModel, ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Dialog, Slide} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";
import {useSharedStyles} from "../../../shared/SharedStyles";

export const ImageLabelingExampleRender = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item} = props;
  const [openedImg, setOpenedImg] = useState<string>();

  return <Grid container spacing={2}>
    {/*Description for the example*/}
    {item.example.fields[0] && <Grid item xs={12}>
      <SurveyControlRender control={item.example.fields[0]}/>
    </Grid>}
    {/*Images grids*/}
    <Grid item container justify="center">
      {item.example.medias.map((v, i) =>
        <AutoFillImage key={i} imgFile={v} setOpenedImg={setOpenedImg}/>)}
    </Grid>
    {/*Questions*/}
    {item.example.fields.slice(1)?.map((value, i) => <Grid item xs={12} key={i}>
      <SurveyControlRender control={value}/>
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
  </Dialog>;
}

function AutoFillImage({imgFile, setOpenedImg}: {imgFile: ImageFileModel, setOpenedImg: (src: string) => void}) {
  const classes = useSharedStyles();
  const imgRef = useRef<HTMLImageElement>();
  const [width, setWidth] = useState('100%');
  const handleOnLoad = () => {
    const imgRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
    // According to card width to calculate suitable height of card for img dimension
    if (imgRatio < 2) setWidth(imgRef.current.width * 0.5 * imgRatio + 'px')
  };

  return <img ref={imgRef} src={imgFile.src} alt={imgFile.filename} className={classes.cursorPointer}
              style={{width: width}} onClick={() => setOpenedImg(imgFile.src)} onLoad={handleOnLoad}
  />;
}

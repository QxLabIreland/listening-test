import {observer} from "mobx-react";
import {TestItemType} from "../../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import React, {useEffect, useRef, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Slider, Theme} from "@material-ui/core";
import {useSharedStyles} from "../../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((_: Theme) => ({
  sliderStickWrapper: {position: 'absolute', top: -16, bottom: 0},
  sliderStick: {position: 'absolute', top:0, bottom:0, left: -3, borderLeft: '2px solid black', borderRight:'2px solid black', background: 'white', width: 6},
}));

export const ImageAbRenderItem = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item} = props;
  const classes = {...useSharedStyles(), ...useStyles()};
  const canvasRef = useRef<HTMLCanvasElement>();
  const canvasContainerRef = useRef<HTMLDivElement>();
  const [maskWidth, setMaskWidth] = useState(0);
  const images = useRef<HTMLImageElement[]>([]);
  console.log('rereder' + maskWidth)

  useEffect(() => {
    // Resize the canvas when window is resizing and reset width of canvas first
    canvasRef.current.setAttribute('width', canvasContainerRef.current.clientWidth.toString());
    window.addEventListener('resize', handleOnResize);
    // Draw images on canvas
    item.example.medias.forEach((imgModel, i) => {
      // Build image element and draw it
      const imgEle = new Image();
      imgEle.src = imgModel.src;
      imgEle.onload = () => {
        // canvasRef.current.setAttribute('width', imgEle.width.toString());
        // canvasRef.current.setAttribute('height', imgEle.height.toString());
        // cxt.drawImage(imgEle,0, 0);
        handleOnResize();
      }
      // Store image element
      images.current[i] = imgEle;
    });
    return () => window.removeEventListener('resize', handleOnResize);
  }, [item.example.medias]);

  const drawOnCanvas = () => {
    if (!images.current || images.current.length < 2) return;
    // Draw on canvas based on mask width
    const cxt = canvasRef.current.getContext('2d');
    const imageWidth = images.current[1].width * (maskWidth / 100);
    const drawWidth = canvasRef.current.width * (maskWidth / 100);
    // console.log(maskWidth)

    cxt.drawImage(images.current[0], 0,0, imageWidth, images.current[0].height,0, 0, drawWidth, canvasRef.current.height);
    cxt.drawImage(images.current[1], imageWidth, 0, images.current[1].width, images.current[1].height,  drawWidth, 0, canvasRef.current.width, canvasRef.current.height);
  }
  useEffect(drawOnCanvas, [maskWidth]);

  const handleOnResize = () => {
    // Reset canvas height based on image ratio
    const canvasHeight = canvasContainerRef.current.clientWidth / images.current[0].width * images.current[0].height;
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasHeight;
    console.log(maskWidth)
    drawOnCanvas();
  }
  const handleSliderOnChange = (_: any, value: number | number[]) => {
    if (!images.current || images.current.length < 2) return;
    setMaskWidth(Number(value));
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
        {/*Images grids*/}
        <div style={{position: 'relative', width: '100%'}} ref={canvasContainerRef}>
          <canvas ref={canvasRef} width="400" height="400"/>
          <span style={{left: maskWidth + '%'}} className={classes.sliderStickWrapper}>
            <span className={classes.sliderStick}/>
          </span>
          <Slider value={maskWidth} max={100} onChange={handleSliderOnChange}/>
        </div>
        {/*Questions*/}
        {item.example.fields.slice(1)?.map((value, i) => <Grid item xs={12} key={i}>
          <RenderSurveyControl control={value}/>
        </Grid>)}
      </Grid>
    default:
      return null;
  }
})

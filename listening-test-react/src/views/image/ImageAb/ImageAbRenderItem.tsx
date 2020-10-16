import {observer} from "mobx-react";
import {TestItemType} from "../../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import React, {MouseEvent, useEffect, useRef, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Theme} from "@material-ui/core";
import {useSharedStyles} from "../../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((_: Theme) => ({
  canvasContainer: {position: 'relative', width: '100%'},
  sliderStickWrapper: {position: 'absolute', top: 0, bottom: 5},
  sliderStick: {
    position: 'absolute', top: 0, bottom: 0, left: -3,
    borderLeft: '2px solid black', borderRight:'2px solid black',
    background: 'white', width: 6, cursor: 'move'
  },
}));

export const ImageAbRenderItem = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item, active} = props;
  const classes = {...useSharedStyles(), ...useStyles()};
  const canvasRef = useRef<HTMLCanvasElement>();
  const canvasContainerRef = useRef<HTMLDivElement>();
  const [maskWidth, setMaskWidth] = useState(5);
  const images = useRef<HTMLImageElement[]>([]);

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
  }, [item.example.medias, active]);

  const drawOnCanvas = () => {
    if (!images.current || images.current.length < 2) return;
    // Draw on canvas based on mask width
    const cxt = canvasRef.current.getContext('2d');
    const ratio = maskWidth / 100;
    const drawWidth = canvasRef.current.width * ratio;

    cxt.drawImage(images.current[0], 0,0, images.current[0].width * ratio, images.current[0].height,0, 0, drawWidth, canvasRef.current.height);
    cxt.drawImage(images.current[1], images.current[1].width * ratio, 0, images.current[1].width, images.current[1].height,  drawWidth, 0, canvasRef.current.width, canvasRef.current.height);
  }
  // Update canvas
  useEffect(drawOnCanvas, [maskWidth]);

  const handleOnResize = () => {
    // Reset canvas height based on image ratio and draw
    const canvasHeight = canvasContainerRef.current.clientWidth / images.current[0].width * images.current[0].height;
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasHeight;
    drawOnCanvas();
  }
  const handleMouseDown = (_: MouseEvent<HTMLSpanElement>) => {
    // Remove listeners
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    const handleMouseMove = (event: any) => {
      // Get new value, skip if new value is not in the range
      const newValue = (event.clientX - canvasContainerRef.current.getBoundingClientRect().left) / canvasContainerRef.current.clientWidth * 100
      if (newValue < 5 || newValue > 95) return;
      setMaskWidth(newValue);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl}/>
    case TestItemType.example:
      return <Grid container spacing={3}>
        {/*Images grids*/}
        <div className={classes.canvasContainer} ref={canvasContainerRef}>
          <canvas ref={canvasRef} width="320" height="320"/>
          <span style={{left: maskWidth + '%'}} className={classes.sliderStickWrapper}>
            <span className={classes.sliderStick} onMouseDown={handleMouseDown}/>
          </span>
        </div>
        {/*Questions*/}
        {item.example.fields?.map((value, i) => <Grid item xs={12} key={i}>
          <RenderSurveyControl control={value}/>
        </Grid>)}
      </Grid>
    default:
      return null;
  }
})

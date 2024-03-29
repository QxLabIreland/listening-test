import {observer} from "mobx-react";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import React, {useEffect, useRef, useState} from "react";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import Grid from "@material-ui/core/Grid";
import {Box, Theme} from "@material-ui/core";
import {useSharedStyles} from "../../../shared/SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((_: Theme) => ({
  canvasContainer: {position: 'relative', width: '100%'},
  sliderStick: {
    position: 'absolute', top: 0, bottom: 5,
    borderLeft: '2px solid black', borderRight: '2px solid black',
    background: 'white', width: 7, cursor: 'move',
    touchAction: 'none', // Disable default touch action
    display: 'flex', alignItems: 'center'
  },
  sliderLabel: {
    background: 'white', opacity: 0.8, borderRadius: '50%', fontWeight: 900, fontSize: '12pt',
    position: 'relative', left: '-24px', minWidth: 50, minHeight: 50,
    display: 'flex', justifyContent: 'space-around', alignItems: 'center'
  },
  strongText: {fontSize: '12pt', fontWeight: 900}
}));

export const ImageAbExampleRender = observer(function (props: { item: ImageTestItemModel, active?: boolean }) {
  const {item, active} = props;
  const classes = {...useSharedStyles(), ...useStyles()};
  const canvasRef = useRef<HTMLCanvasElement>();
  const canvasContainerRef = useRef<HTMLDivElement>();
  const [maskWidth, setMaskWidth] = useState(5);
  const images = useRef<HTMLImageElement[]>([]);

  /** Initialization or media and active changed*/
  useEffect(() => {
    if (item.example?.settings?.isHorizontalDisplay) return () => null;
    // Resize the canvas when window is resizing and reset width of canvas first
    canvasRef.current.setAttribute('width', canvasContainerRef.current.clientWidth.toString());
    window.addEventListener('resize', handleOnResize);
    // Draw images on canvas
    item.example.medias.forEach((imgModel, i) => {
      // Build image element and draw it
      const imgEle = new Image();
      imgEle.src = imgModel.src;
      imgEle.onload = handleOnResize;
      // Store image element
      images.current[i] = imgEle;
    });
    return () => window.removeEventListener('resize', handleOnResize);
  }, [item.example.medias, active]);

  /** Draw 2 images on the canvas*/
  const drawOnCanvas = () => {
    if (!images.current || images.current.length < 2) return;
    // Draw on canvas based on mask width
    const cxt = canvasRef.current.getContext('2d');
    const ratio = maskWidth / 100;
    const drawWidth = canvasRef.current.width * ratio;
    cxt.drawImage(images.current[0], 0, 0, images.current[0].width * ratio, images.current[0].height, 0, 0, drawWidth, canvasRef.current.height);
    cxt.drawImage(images.current[1], images.current[1].width * ratio, 0, images.current[1].width, images.current[1].height, drawWidth, 0, canvasRef.current.width, canvasRef.current.height);
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
  /** Drag the scrub bar to mask or unmask image*/
  const handleMouseDown = (ev: any) => {
    ev.preventDefault();
    // Remove listeners
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseOrTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseOrTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    const handleMouseOrTouchMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      // Get clientX based on mouse or touch (because there are more than 1 touches, so we need choose the first)
      const clientX = event instanceof MouseEvent ? event.clientX : event.changedTouches[0].clientX;
      // Get new value, skip if new value is not in the range
      const newValue = (clientX - canvasContainerRef.current.getBoundingClientRect().left) / canvasContainerRef.current.clientWidth * 100
      if (newValue < 5 || newValue > 95) return;
      setMaskWidth(newValue);
    }

    window.addEventListener('mousemove', handleMouseOrTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseOrTouchMove);
    window.addEventListener('touchend', handleMouseUp);
  }

  return <Grid container spacing={2}>
    {/*Images grids. Horizontally or draggable bar*/}
    {item.example.settings?.isHorizontalDisplay ? <div>
      {item.example.medias.map((v, i) => <img src={v.src} alt={v.filename} width="50%" style={{
        paddingRight: i % 2 === 0 ? 4 : 0, paddingLeft: i % 2 === 0 ? 0 : 4
      }}/>)}
      <Box display="flex" justifyContent="space-around">
        <strong className={classes.strongText}>A</strong><strong className={classes.strongText}>B</strong>
      </Box>
    </div> : <div className={classes.canvasContainer} ref={canvasContainerRef}>
      <canvas ref={canvasRef} width="320" height="320"/>
      <div style={{left: `calc(${maskWidth}% - 3px)`}} className={classes.sliderStick} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown}>
        <div className={classes.sliderLabel}><span>A</span><span>B</span></div>
      </div>
    </div>}
    {/*Questions*/}
    {item.example.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <SurveyControlRender control={value}/>
    </Grid>)}
  </Grid>
})

import React, {CSSProperties, useRef, useState} from "react";
import {Box, createStyles, IconButton, LinearProgress, Theme, Tooltip, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Axios from "axios";
import {TagsGroup} from "./TagsGroup";
import {observer} from "mobx-react";
import {makeStyles} from "@material-ui/core/styles";
import {BasicFileModel} from "../models/BasicTaskModel";

const useStyles = makeStyles((_: Theme) => createStyles({
  fileNameEllipsis: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}
}))

export const FileDropZone = observer(({onChange, fileModel, label, isTag, onDragStart, onDrop, disabled}: {
  onChange: (fm: BasicFileModel)=>void, fileModel?: BasicFileModel, label?: string, isTag?: boolean,
  onDragStart?: () => void, onDrop?: () => void, disabled?: boolean
}) => {
  const classes = useStyles();
  // Default label
  const fileRef = useRef<HTMLInputElement>();
  // Style of file boxes
  const boxStyle = {textAlign: 'center', border: '1px dashed rgba(0, 0, 0, 0.3)', borderRadius: 4, cursor: 'pointer'} as CSSProperties;
  const [isUploading, setIsUploading] = useState(false);
  // Program settings
  const [progress, setProgress] = useState(0);

  // Config what to do when finished
  const onUploadingFinished = () => {
    // Clear file input
    if (fileRef.current) fileRef.current.value = null;
    setIsUploading(false);
    setProgress(0);
  }

  const handleFileDrop = (event: any) => {
    if (disabled) return;
    event.preventDefault();
    let files = event.target.files;
    // If event is not a File Input Choose
    if (!files) files = event.dataTransfer.files;
    // Avoid empty upload
    if (!files[0]) return;
    const formData = new FormData();
    formData.append("audioFile", files[0]);

    // Uploading animation
    setIsUploading(true);
    // File upload handling
    Axios.post('/api/audio-file', formData, {
      onUploadProgress: (progress) => {
        const percentCompleted = Math.round((progress.loaded * 100) / progress.total)
        setProgress(percentCompleted);
      }
    }).then((res) => {
      const newFileModel = {} as BasicFileModel;
      // File fields
      newFileModel.src = res.data;
      newFileModel.filename = files[0].name;
      onChange(newFileModel);
      // Finishing callback
      onUploadingFinished();
    }, onUploadingFinished)
  }

  function handleDragOver(event: any) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  const handleTagsChange = (tags: string) => {
    fileModel.tags = tags;
    onChange(Object.assign({}, fileModel));
  }

  const handleDelete = (event: any) => {
    event.stopPropagation();
    onChange(null);
  }

  return <div onDrop={onDrop} onDragStart={onDragStart} draggable={!!onDragStart}>
    <input type="file" ref={fileRef} onChange={handleFileDrop} hidden={true}/>
    {/*Uploading animation and text box*/}
    {isUploading ? <Box p={2} style={boxStyle}>
      <LinearProgress variant="determinate" value={progress}/>
      <br/>
      <Typography variant="body2" color="textSecondary">Uploading {progress}%</Typography>
    </Box> : <Box p={2} style={boxStyle} onClick={() => fileRef.current.click()}
                  onDragOver={handleDragOver} onDrop={handleFileDrop}>
      {fileModel?.filename ? <>
        <Tooltip title={fileModel.filename} enterDelay={1000} placement="top">
          <Typography className={classes.fileNameEllipsis}>{fileModel.filename}</Typography>
        </Tooltip>
        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <small>{label?.slice(0, 3)}</small>
          <Tooltip title="Click to delete this one">
            <IconButton size="small" onClick={handleDelete}><Icon>delete_outline</Icon></IconButton>
          </Tooltip>
        </Box>
      </> : <><Typography className={classes.fileNameEllipsis}>{label ? label : 'Click to choose or Drop a file'}</Typography><Icon>attachment</Icon></>}
    </Box>}
    {fileModel && isTag && <TagsGroup value={fileModel.tags} onChange={handleTagsChange}/>}
  </div>
})

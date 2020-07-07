import React, {CSSProperties, useRef, useState} from "react";
import {Box, IconButton, LinearProgress, Tooltip, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {AudioFileModel} from "../models/AudioFileModel";
import Axios from "axios";
import {TagsGroup} from "./TagsGroup";
import {observer} from "mobx-react";

export const FileDropZone = observer((props: { onChange, fileModel?: AudioFileModel, label?: string, isTag?: boolean }) => {
  // Default label
  const {onChange, fileModel, label, isTag} = props;
  const fileRef = useRef<HTMLInputElement>();
  // Style of file boxes
  const boxStyle = {textAlign: 'center', border: '1px dashed rgba(0, 0, 0, 0.3)', borderRadius: 4} as CSSProperties;
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
    event.preventDefault();
    let files = event.target.files;
    // If event is not a File Input Choose
    if (!files) files = event.dataTransfer.files;
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
      const newFileModel = {} as AudioFileModel;
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

  const handleTagsChange = (tags) => {
    fileModel.tags = tags;
    onChange(Object.assign({}, fileModel));
  }

  const handleDelete = (event) => {
    event.stopPropagation();
    onChange(null);
  }

  return <React.Fragment>
    <input type="file" ref={fileRef} onChange={handleFileDrop} hidden={true}/>
    {/*Uploading animation and text box*/}
    {isUploading ? <Box p={2} style={boxStyle}>
      <LinearProgress variant="determinate" value={progress}/>
      <br/>
      <Typography variant="body2" color="textSecondary">Uploading {progress}%</Typography>
    </Box> : <Box p={2} style={boxStyle} onClick={() => fileRef.current.click()}
                  onDragOver={handleDragOver} onDrop={handleFileDrop}>
      {fileModel?.filename ? <>
        <Typography>{fileModel.filename}</Typography>
        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><small>{label?.slice(0, 3)}</small>
        <Tooltip title="Click to delete this one">
          <IconButton size="small" onClick={handleDelete}><Icon>attachment</Icon></IconButton>
        </Tooltip>
        </Box>
      </> : <><Typography>{label ? label : 'Click to choose or Drop a file'}</Typography><Icon>file_copy</Icon></>}
    </Box>}
    {fileModel && isTag && <TagsGroup value={fileModel.tags} onChange={handleTagsChange}/>}
  </React.Fragment>
})

import React, {CSSProperties, useRef, useState} from "react";
import {Box, CircularProgress, LinearProgress, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {AudioFileModel} from "../models/AudioFileModel";
import Axios from "axios";
import TagsGroup from "./TagsGroup";

export function FileDropZone(props: { onChange, fileModel: AudioFileModel, value?: string, label?: string }) {
  // Default label
  const {onChange, fileModel, value, label = 'Click to choose or Drop a file'} = props;
  const fileRef = useRef<HTMLInputElement>();
  // Style of file boxes
  const boxStyle = {textAlign: 'center', border: '1px dashed rgba(0, 0, 0, 0.3)'} as CSSProperties;
  const [isUploading, setIsUploading] = useState(false);
  // Program settings
  const [progress, setProgress] = useState(0);

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
      newFileModel.value = value;
      onChange(newFileModel);
      // Clear file input
      fileRef.current.value = null;
      setIsUploading(false);
    }, () => {
      // Clear file input
      fileRef.current.value = null;
      setIsUploading(false);
    })
  }

  function stopDefault(event: any) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  const handleTagsChange = (tags) => {
    fileModel.tags = tags;
    onChange(Object.assign({}, fileModel));
  }

  return <React.Fragment>
    <input type="file" ref={fileRef} onChange={handleFileDrop} hidden={true}/>
    {/*Uploading animation and text box*/}
    {isUploading ? <Box p={2} style={boxStyle}>
      <LinearProgress variant="determinate" value={progress}/>
      <br/>
      <Typography variant="body2" color="textSecondary">Uploading {progress}%</Typography>
    </Box> : <Box p={2} style={boxStyle} onClick={() => fileRef.current.click()}
                  onDragOver={stopDefault} onDrop={handleFileDrop}>
      {fileModel?.filename
        ? <><Typography>{fileModel.filename}</Typography><Icon>attachment</Icon></>
        : <><Typography>{label}</Typography><Icon>file_copy</Icon></>
      }
    </Box>}
    {fileModel && <TagsGroup tags={fileModel.tags} onChange={handleTagsChange}/>}
  </React.Fragment>
}

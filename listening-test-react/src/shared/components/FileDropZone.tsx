import React, {useRef} from "react";
import {Box, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {AudioFileModel} from "../models/AudioFileModel";
import Axios from "axios";
import TagsGroup from "./TagsGroup";

export function FileDropZone(props: { onChange, fileModel: AudioFileModel, value?: string, label?: string }) {
  // Default label
  const {onChange, fileModel, value, label = 'Click to choose or Drop a file'} = props;
  const fileRef = useRef<HTMLInputElement>();

  const handleFileDrop = (event: any) => {
    event.preventDefault();
    let files = event.target.files;
    // If event is not a File Input Choose
    if (!files) files = event.dataTransfer.files;
    const formData = new FormData();
    formData.append("audioFile", files[0]);

    // File upload handling
    Axios.post('/api/audio-file', formData).then((res) => {
      const newFileModel = {} as AudioFileModel;
      // File fields
      newFileModel.src = res.data;
      newFileModel.filename = files[0].name;
      newFileModel.value = value;
      onChange(newFileModel);
      // Clear file input
      fileRef.current.value = null;
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
    <Box p={2} style={{textAlign: 'center', border: '1px dashed rgba(0, 0, 0, 0.3)'}}
         onClick={() => fileRef.current.click()}
         onDragOver={stopDefault}
         onDrop={handleFileDrop}>
      {fileModel?.filename ? <Typography>{fileModel.filename}</Typography>
        : <Typography>{label}</Typography>}
      <Icon>file_copy</Icon>
    </Box>
    {fileModel && <TagsGroup tags={fileModel.tags} onChange={handleTagsChange}/>}
  </React.Fragment>
}

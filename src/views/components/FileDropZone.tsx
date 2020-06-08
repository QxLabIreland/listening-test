import React from "react";
import {Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {observer} from "mobx-react";
import {AudioModel} from "../../shared/models/AudioModel";

export default observer(function FileDropZone(props: {file: AudioModel, classes: any}) {
  const {file, classes} = props;

  function handleFileDrop(event: any) {
    event.preventDefault();
    let files = event.target.files;
    // If event is not a File Input Choose
    if (!files) {
      files = event.dataTransfer.files;
    }
    //todo File upload handle
    file.filename = files[0].name;
    // Clear file input
    file.ref.current.value = null;
  }

  function stopDefault(event: any) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <input type="file" ref={file.ref} onChange={handleFileDrop} hidden={true}/>
      <div className={classes.paper} onClick={() => file.ref.current.click()}
           onDragOver={stopDefault}
           onDrop={handleFileDrop}>
        {file.filename ? <Typography>{file.filename}</Typography>
          : <Typography>Click to choose a file or Drag and drop a file</Typography>}
        <Icon>file_copy</Icon>
      </div>
    </React.Fragment>
  )
})

import React, {useRef} from "react";
import {Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {observer} from "mobx-react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";

export default observer(function (props: {file: AudioFileModel, classes: any, label?: string}) {
  const {file, classes} = props;
  let {label} = props
  const fileRef = useRef<HTMLInputElement>();

  if (!label) label = 'Click to choose or Drop a file';

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
    fileRef.current.value = null;
  }

  function stopDefault(event: any) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <input type="file" ref={fileRef} onChange={handleFileDrop} hidden={true}/>
      <div className={classes.paper} onClick={() => fileRef.current.click()}
           onDragOver={stopDefault}
           onDrop={handleFileDrop}>
        {file.filename ? <Typography>{file.filename}</Typography>
          : <Typography>{label}</Typography>}
        <Icon>file_copy</Icon>
      </div>
    </React.Fragment>
  )
})

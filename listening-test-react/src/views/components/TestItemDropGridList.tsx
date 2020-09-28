import {observer} from "mobx-react";
import React, {PropsWithChildren, useRef, useState} from "react";
import {BasicExampleModel, BasicFileModel} from "../../shared/models/BasicTaskModel";
import {
  Box,
  createStyles,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  LinearProgress,
  Theme,
  Typography
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {makeStyles} from "@material-ui/core/styles";
import {AudioFileModel} from "../../shared/models/AudioTestModel";
import Axios from "axios";

const useStyles = makeStyles((_: Theme) => createStyles({
  // fileNameEllipsis: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  uploadBox: {
    border: '1px dashed rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    cursor: 'pointer',
    textAlign: 'center',
    height: '100%'
  },
  withe: {color: 'white'}
}));

// reference means we can upload reference. keepPlace means the audio place will be kept after a deletion
export const TestItemDropGridList = observer(function ({example, keepPlace}: {
  example: BasicExampleModel, reference?: boolean, keepPlace?: boolean
}) {
  const classes = useStyles();
  const [draggingIndex, setDraggingIndex] = useState<number>();

  const handleDropSwapFiles = (dropIndex: number) => {
    if (draggingIndex === dropIndex) return;
    const temp = example.medias[dropIndex];
    example.medias[dropIndex] = {...example.medias[draggingIndex]};
    example.medias[draggingIndex] = temp;
    setDraggingIndex(undefined);
  }
  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  }
  const handleDragOver = (event: any) => {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
    event.stopPropagation();
  }
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  const handleDelete = (index: number) => {
    if (keepPlace) example.medias[index] = null;
    else example.medias.splice(index, 1);
  }

  return <GridList cols={3}>
    {example.medias.map((a, i) =>
      <GridListTile key={i} onDrop={() => handleDropSwapFiles(i)} onDragOver={handleDragOver}
                    onDragStart={() => handleDragStart(i)} draggable={true}>
        <img src={a.src} alt="uploaded" draggable={false}/>
        <GridListTileBar subtitle={a.filename} actionIcon={
          <IconButton className={classes.withe} onClick={() => handleDelete(i)}><Icon>delete_outline</Icon></IconButton>
        }/>
      </GridListTile>
    )}
    <GridListTile>
      <SimpleFileDropZone onChange={handleAdd} fileType="imageFile">
        <Typography>Image File</Typography>
        <Icon>attachment</Icon>
      </SimpleFileDropZone>
      <GridListTileBar subtitle="Click to choose or Drop a file"/>
    </GridListTile>
  </GridList>
})
const SimpleFileDropZone = observer(function (props: PropsWithChildren<{
  onChange: (fm: BasicFileModel) => void, disabled?: boolean, fileType: 'imageFile'
}>) {
  const {onChange, disabled, fileType} = props;
  const classes = useStyles();
  // Default label
  const fileRef = useRef<HTMLInputElement>();
  // Style of file boxes
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
  const handleFileUploadDrop = (event: any) => {
    if (disabled) return;
    event.preventDefault();
    let files = event.target.files;
    // If event is not a File Input Choose
    if (!files) files = event.dataTransfer.files;
    // Avoid empty upload
    if (!files[0]) return;

    // Start uploading and animation
    setIsUploading(true);
    const formData = new FormData();
    formData.append(fileType, files[0]);
    // File upload handling
    Axios.post('/api/upload-file', formData, {
      onUploadProgress: (progress) => {
        const percentCompleted = Math.round((progress.loaded * 100) / progress.total)
        setProgress(percentCompleted);
      }
    }).then((res) => {
      onChange({src: res.data, filename: files[0].name} as BasicFileModel);
      // Finishing callback
      onUploadingFinished();
    }, onUploadingFinished)
  }
  const handleFileUploadDragOver = (event: any) => {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  return <>
    <input type="file" ref={fileRef} onChange={handleFileUploadDrop} hidden={true}/>
    {/*Uploading animation and text box*/}
    {isUploading ? <Box p={2} className={classes.uploadBox}>
      <LinearProgress variant="determinate" value={progress}/>
      <br/>
      <Typography variant="body2" color="textSecondary">Uploading {progress}%</Typography>
    </Box> : <Box p={2} className={classes.uploadBox} onClick={() => fileRef.current.click()}
                  onDragOver={handleFileUploadDragOver} onDrop={handleFileUploadDrop}>
      {props.children}
    </Box>}
  </>
})

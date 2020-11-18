import {observer} from "mobx-react";
import React from "react";
import Grid from "@material-ui/core/Grid";
import {BasicExampleModel, BasicFileModel} from "../../shared/models/BasicTaskModel";
import {Box, createStyles, IconButton, Theme, Tooltip, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {makeStyles} from "@material-ui/core/styles";
import {FileUploadDropBox, useFileBoxesFunc} from "../../shared/components/FileUploadDropBox";
// reference means we can upload reference. keepPlace means the audio place will be kept after a deletion
export const AudioFileDropGrid = observer(function ({example, reference, keepPlace, allSame, hidDeleteButton}: {
  example: BasicExampleModel, reference?: boolean, keepPlace?: boolean, allSame?: boolean, hidDeleteButton?: boolean
}) {
  const {handleDropSwapFiles, handleDragStart, draggingIndex, handleDragOver} = useFileBoxesFunc(example.medias, keepPlace);

  const handleChange = (newAudio: BasicFileModel, index: number) => {
    if (newAudio == null) {
      if (keepPlace) example.medias[index] = null;
      else example.medias.splice(index, 1);
      return;
    }
    // If is Reference the audioRef will be added or deleted
    if (index === -1 && reference) example.mediaRef = newAudio;
    else example.medias[index] = newAudio;
  }
  return <>
    {/*Reference place*/}
    {reference && <Grid item xs={12} md={4}>
      <AudioFileUploadBox fileModel={example.mediaRef} onChange={fm => handleChange(fm, -1)}
                    label="Reference Labeled (Optional)"/>
    </Grid>}
    {/*File drop area*/}
    {example.medias.slice(allSame ? example.medias.length - 1 : 0).map((a, i) => <Grid item xs={12} md={4} key={i}>
      <AudioFileUploadBox fileModel={a} onChange={fm => handleChange(fm, i)} disabled={draggingIndex !== undefined}
                    onDrop={() => handleDropSwapFiles(i)} onDragStart={() => handleDragStart(i)} onDragOver={handleDragOver}
                    hidDeleteButton={hidDeleteButton}/>
    </Grid>)}
  </>
})

const useStyles = makeStyles((_: Theme) => createStyles({
  fileNameEllipsis: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}
}));

const AudioFileUploadBox = observer(({onChange, fileModel, label, onDragStart, onDrop, disabled, onDragOver, hidDeleteButton}: {
  onChange: (fm: BasicFileModel) => void, fileModel?: BasicFileModel, label?: string, isTag?: boolean,
  onDragStart?: () => void, onDrop?: () => void, disabled?: boolean, onDragOver?: (event: any) => void,
  hidDeleteButton?: boolean
}) => {
  const classes = useStyles();

  const handleDelete = (event: any) => {
    event.stopPropagation();
    onChange(null);
  }
  return <div onDrop={onDrop} onDragStart={onDragStart} draggable={!!onDragStart} onDragOver={onDragOver}>
    <FileUploadDropBox onChange={onChange} fileType="audio" disabled={disabled}>
      {fileModel?.filename ? <>
        <Tooltip title={fileModel.filename} enterDelay={1000} placement="top">
          <Typography className={classes.fileNameEllipsis}>{fileModel.filename}</Typography>
        </Tooltip>
        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <small>{label?.slice(0, 3)}</small>
          {!hidDeleteButton ? <Tooltip title="Click to delete this one">
            <IconButton size="small" onClick={handleDelete}><Icon>delete_outline</Icon></IconButton>
          </Tooltip> : <Icon>music_note</Icon>}
        </Box>
      </> : <>
        <Typography className={classes.fileNameEllipsis}>{label ? label : 'Click to choose or Drop a file'}</Typography>
        <Icon>attachment</Icon>
      </>}
    </FileUploadDropBox>
  </div>
})


import { observer } from 'mobx-react';
import React from 'react';

import { IconButton, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import { makeStyles } from '@mui/styles';

import { BasicExampleModel } from '../../shared/models/BasicTaskModel';
import { FileUploadDropBox, useFileBoxesFunc } from '../forms/FileUploadDropBox';

const useStyles = makeStyles(() => ({
  withe: {color: 'white'}
}));

// reference means we can upload reference. keepPlace means the audio place will be kept after a deletion
export const TestItemDropGridList = observer(function ({example, type = 'image', disableUpload, keepSlot}: {
  example: BasicExampleModel, type?: 'image' | 'video', disableUpload?: boolean, keepSlot?: boolean
}) {
  const classes = useStyles();
  const {handleDragStart, handleDragOver, handleDropSwapFiles, handleDelete, handleAdd} = useFileBoxesFunc(example.medias, keepSlot);

  const switchPreviewBaseType = (props: any) => {
    if (!props?.src) return <FileUploadDropBox onChange={handleAdd} fileType={type}>
      <Typography>Empty slot</Typography><Icon>attachment</Icon>
    </FileUploadDropBox>

    switch (type) {
      case "image":
        return <img alt="uploaded" {...props}/>
      case "video":
        return <video muted autoPlay width="100%" {...props}/>
    }
  }

  return <ImageList cols={3}>
    {example.medias.map((a, i) =>
      <ImageListItem key={i}>
        {switchPreviewBaseType({
          src: a?.src, draggable: true, onDrop: () => handleDropSwapFiles(i),
          onDragOver: handleDragOver, onDragStart: () => handleDragStart(i)
        })}
        {a ? <ImageListItemBar subtitle={a?.filename} actionIcon={
          <IconButton className={classes.withe} onClick={() => handleDelete(i)}><Icon>delete_outline</Icon></IconButton>
        }/> : <ImageListItemBar subtitle="Click to choose or Drop a file above"/>}
      </ImageListItem>
    )}
    
    {/*A condition to remove the upload box*/}
    {!disableUpload && <ImageListItem>
      <FileUploadDropBox onChange={handleAdd} fileType={type}>
        <Typography>{type.toUpperCase()} File</Typography>
        <Icon>attachment</Icon>
      </FileUploadDropBox>
      <ImageListItemBar subtitle="Click to choose or Drop a file above"/>
    </ImageListItem>}
  </ImageList>
})


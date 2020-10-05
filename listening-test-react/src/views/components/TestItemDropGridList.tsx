import {observer} from "mobx-react";
import React from "react";
import {BasicExampleModel} from "../../shared/models/BasicTaskModel";
import {GridList, GridListTile, GridListTileBar, IconButton, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {FileUploadDropBox, useFileBoxesFunc} from "../../shared/components/FileUploadDropBox";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  withe: {color: 'white'}
}));

// reference means we can upload reference. keepPlace means the audio place will be kept after a deletion
export const TestItemDropGridList = observer(function ({example, type = 'image'}: {
  example: BasicExampleModel, type?: 'image' | 'video'
}) {
  const classes = useStyles();
  const {handleDragStart, handleDragOver, handleDropSwapFiles, handleDelete, handleAdd} = useFileBoxesFunc(example.medias);

  const switchPreviewBaseType = (props: any) => {
    switch (type) {
      case "image":
        return <img alt="uploaded" {...props}/>
      case "video":
        return <video muted autoPlay width="100%" {...props}/>
      default:
        return null;
    }
  }
  let uploadText = null;
  switch (type) {
    case "image":
      uploadText = <Typography>Image File</Typography>;
      break;
    case "video":
      uploadText = <Typography>Video File</Typography>;
      break;
  }

  return <GridList cols={3}>
    {example.medias.map((a, i) =>
      <GridListTile key={i}>
        {switchPreviewBaseType({
          src: a.src, draggable: true, onDrop: () => handleDropSwapFiles(i),
          onDragOver: handleDragOver, onDragStart: () => handleDragStart(i)
        })}
        <GridListTileBar subtitle={a.filename} actionIcon={
          <IconButton className={classes.withe} onClick={() => handleDelete(i)}><Icon>delete_outline</Icon></IconButton>
        }/>
      </GridListTile>
    )}
    <GridListTile>
      <FileUploadDropBox onChange={handleAdd} fileType={type}>
        {uploadText}
        <Icon>attachment</Icon>
      </FileUploadDropBox>
      <GridListTileBar subtitle="Click to choose or Drop a file"/>
    </GridListTile>
  </GridList>
})


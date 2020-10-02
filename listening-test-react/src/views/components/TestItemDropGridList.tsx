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
export const TestItemDropGridList = observer(function ({example, keepPlace}: {
  example: BasicExampleModel, reference?: boolean, keepPlace?: boolean
}) {
  const classes = useStyles();
  const {handleDragStart, handleDragOver, handleDropSwapFiles, handleDelete, handleAdd} = useFileBoxesFunc(example.medias);

  return <GridList cols={3}>
    {example.medias.map((a, i) =>
      <GridListTile key={i}>
        <img src={a.src} alt="uploaded" onDrop={() => handleDropSwapFiles(i)} onDragOver={handleDragOver}
             onDragStart={() => handleDragStart(i)} draggable={true}/>
        <GridListTileBar subtitle={a.filename} actionIcon={
          <IconButton className={classes.withe} onClick={() => handleDelete(i)}><Icon>delete_outline</Icon></IconButton>
        }/>
      </GridListTile>
    )}
    <GridListTile>
      <FileUploadDropBox onChange={handleAdd} fileType="image">
        <Typography>Image File</Typography>
        <Icon>attachment</Icon>
      </FileUploadDropBox>
      <GridListTileBar subtitle="Click to choose or Drop a file"/>
    </GridListTile>
  </GridList>
})


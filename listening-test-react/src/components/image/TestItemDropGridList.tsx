import {observer} from "mobx-react";
import React from "react";
import {BasicExampleModel} from "../../shared/models/BasicTaskModel";
import {GridList, GridListTile, GridListTileBar, IconButton, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {FileUploadDropBox, useFileBoxesFunc} from "../forms/FileUploadDropBox";
import {makeStyles} from "@material-ui/core/styles";

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

  return <GridList cols={3}>
    {example.medias.map((a, i) =>
      <GridListTile key={i}>
        {switchPreviewBaseType({
          src: a?.src, draggable: true, onDrop: () => handleDropSwapFiles(i),
          onDragOver: handleDragOver, onDragStart: () => handleDragStart(i)
        })}
        {a ? <GridListTileBar subtitle={a?.filename} actionIcon={
          <IconButton className={classes.withe} onClick={() => handleDelete(i)}><Icon>delete_outline</Icon></IconButton>
        }/> : <GridListTileBar subtitle="Click to choose or Drop a file above"/>}
      </GridListTile>
    )}
    
    {/*A condition to remove the upload box*/}
    {!disableUpload && <GridListTile>
      <FileUploadDropBox onChange={handleAdd} fileType={type}>
        <Typography>{type.toUpperCase()} File</Typography>
        <Icon>attachment</Icon>
      </FileUploadDropBox>
      <GridListTileBar subtitle="Click to choose or Drop a file above"/>
    </GridListTile>}
  </GridList>
})


import React, {PropsWithChildren, DragEvent} from "react";
import {Icon, IconButton, Tooltip} from "@material-ui/core";

export default function DraggableZone({children, index, length, onReorder, draggable}: PropsWithChildren<{
  index: number, length: number, onReorder?: (index: number, newIndex: number) => void, draggable?: boolean
}>) {
  // Draggable item handlers
  const handleDragStart = (event: any) => {
    // event.target.style.opacity = 0;
    // event.dataTransfer;
  }
  const handleDragEnd = (event: any) => {
    // event.target.style.opacity = 1;
  }
  const handleDrag = (event: any) => {
  }

  // Drop container handlers
  const handleDragEnter = (event: any) => {
    event.target.style.border = '2px solid green';
  }
  const handleDragLeave = (event: any) => {
    event.target.style.border = 'none';
  }
  const handleDropOver = (event: DragEvent) => {
    event.dataTransfer.dropEffect = 'move';
  }
  const handleDrop = (event: any) => {
    console.log(event)
    if (onReorder) onReorder(index, index);
    event.target.style.border = 'none';
  }

  return <div style={{position: 'relative'}}>
    <div style={{
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      width: 0,
      right: 0
    }}>
      {draggable ? <Tooltip title="Hold to reorder">
        <IconButton style={{position: 'absolute', right: -32}} draggable
                    onDrag={handleDrag} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Icon>reorder</Icon>
        </IconButton>
      </Tooltip> : <>
        {/*We need to put item before new index item, so we need -1*/}
        <Tooltip title="Move this card up"><span>
          <IconButton size="small" disabled={index === 0} onClick={() => onReorder(index, index - 1)}>
            <Icon>keyboard_arrow_up</Icon>
          </IconButton>
        </span></Tooltip>
        <Tooltip title="Move this card down"><span>
          <IconButton size="small" disabled={index === length - 1} onClick={() => onReorder(index, index + 1)}>
            <Icon>keyboard_arrow_down</Icon>
          </IconButton>
        </span></Tooltip>
      </>}
    </div>
    {/*<div onDragOver={handleDropOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}>*/}
      {children}
    {/*</div>*/}
  </div>
}

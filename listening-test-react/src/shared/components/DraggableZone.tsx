import React, {DragEvent, MouseEvent, PropsWithChildren, RefObject, useRef} from "react";
import { Icon, IconButton, Tooltip} from "@material-ui/core";
import {observer} from "mobx-react";

export const DraggableZone = observer(function({children, index, length, onReorder, onMouseDown}: PropsWithChildren<{
  index: number, length: number, onReorder?: (index: number, newIndex: number) => void, onMouseDown?: (event: MouseEvent<any>) => any
}>) {
  const ref = React.createRef<HTMLDivElement>();
  const refChildren = React.createRef();
  // Draggable item handlers
  const handleDragStart = (event: any) => {
    return false;
  }
  const handleDragEnd = (event: any) => {
    // event.target.style.opacity = 1;
  }
  const handleDrag = (event: any) => {
    // return false;
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

  const handleMouseDown = (event: MouseEvent<any>) => {
    if (!ref.current) return;
    if (onMouseDown) onMouseDown(event);
    // // const clone = ref.current.cloneNode(true) as HTMLDivElement;
    // // clone.style.position = 'absolute';
    // // clone.style.width = ref.current.clientWidth + 'px';
    // // clone.style.height = ref.current.clientHeight + 'px';
    // // let shiftX = event.clientX - ref.current.getBoundingClientRect().left;
    // // let shiftY = event.clientY - ref.current.getBoundingClientRect().top;
    // // clone.style.left = event.pageX - shiftX + 'px';
    // // clone.style.top = event.pageY - shiftY + 'px';
    // // document.body.append(clone);
    //
    // // ref.current.style.position = 'relative';
    // ref.current.style.zIndex = '1000';
    // // ref.current.style.visibility = 'hidden';
    // // document.body.append(ref.current);
    //
    // const start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
    // const onMouseMove = (event: any) => {
    //   if (!ref.current) return;
    //   // ref.current.style.left = event.pageX - shiftX + 'px';
    //   // clone.style.top = event.pageY - shiftY + 'px';
    //
    //   const end = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
    //   ref.current.style.top = end - start + 'px';
    //
    //   if (Math.abs(end - start) >= 88) {
    //     if (end - start >= 88) onReorder(index, index + 1);
    //     else if (end - start <= -88) onReorder(index, index - 1);
    //     // clone.style.top = '0';
    //   }
    // }
    //
    // const handleMouseUp = () => {
    //   document.removeEventListener('mousemove', onMouseMove);
    //   document.removeEventListener('mousemove', handleMouseUp);
    //   if (!ref.current) return;
    //   // Reset the styles
    //   // clone.remove();
    //   // ref.current.style.visibility = 'visible';
    //   ref.current.style.top = '0';
    // }
    // // move the ball on mousemove
    // document.addEventListener('mousemove', onMouseMove);
    // document.addEventListener('mouseup', handleMouseUp);
  }

  return <div style={{position: 'relative'}} ref={ref}>
    <div style={{
      position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      height: '100%', width: 0, right: 0
    }}>
      <Icon style={{position: 'absolute', width: 12, cursor: 'grabbing'}} onMouseDown={handleMouseDown}
            onDrag={handleDrag} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>reorder</Icon>
      {/*{draggable ? <Icon style={{position: 'absolute', width: 12, cursor: 'grabbing'}} onMouseDown={handleMouseDown}
                         onDrag={handleDrag} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>reorder</Icon> : <>
        We need to put item before new index item, so we need -1
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
      </>}*/}
    </div>
    {/* onDragOver={handleDropOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}*/}
    {children}
  </div>
})

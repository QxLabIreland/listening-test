import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import React, {FunctionComponent, MouseEvent, RefObject, useEffect, useState} from "react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {DefaultComponentProps} from "@material-ui/core/OverridableComponent";
import Grid, {GridTypeMap} from "@material-ui/core/Grid";
import {action, observable} from "mobx";
import {Box, createStyles, Icon, IconButton, Theme, Tooltip} from "@material-ui/core";
import {TestItemCard} from "../components/TestItemCard";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  grid: {position: 'relative', visibility: 'visible'},
  gridHidden: {position: 'relative', visibility: 'hidden'},
  container: {
    position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    width: 0, right: 0, top: 0, bottom: 0,
    [theme.breakpoints.down(1245)]: {right: 14}
  },
  reorder: {width: 12, cursor: 'grab', position: 'absolute', left: 7, color: 'rgba(0, 0, 0, 0.54)'}

}))

export const TestDetailItemCardList = observer(function ({items, TestItemExampleCard}: { items: TestItemModel[], TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }> }) {
  const [draggingEle, setDraggingEle] = useState<React.FunctionComponentElement<DefaultComponentProps<GridTypeMap>>>();
  const [params] = useState(observable({start: null, shiftY: null, index: null}));
  const classes = useStyles();
  useEffect(() => {
    if (!draggingEle) return;
    const onMouseMove = (event: any) => {
      // Dragging element to move
      // ref.current.style.left = event.pageX - shiftX + 'px';
      (draggingEle.ref as RefObject<HTMLDivElement>).current.style.top = event.pageY - params.shiftY + 'px';
      const end = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      // When element position is relative
      // draggingRef.style.top = end - start + 'px';

      // Give a threshold for movement, and if dragging element is out of list
      if (end - params.start >= 80 && params.index < items.length - 1) {
        reorder(params.index, params.index + 1);
        params.start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      } else if (end - params.start <= -80 && params.index > 0) {
        reorder(params.index, params.index - 1);
        params.start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setDraggingEle(null);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [draggingEle]);

  const deleteItem = (index: number) => items.splice(index, 1);
  const handleMouseDown = (event: MouseEvent<any>, index: number) => {
    // Get index of the element
    params.index = index;
    const currentRef = (list[params.index].ref as RefObject<HTMLDivElement>).current;
    const shiftX = event.clientX - currentRef.getBoundingClientRect().left;
    const shiftY = event.clientY - currentRef.getBoundingClientRect().top;
    // Clone a element for items display (move up or down)
    setDraggingEle(React.cloneElement(list[params.index], {
      ref: React.createRef<HTMLDivElement>(),
      style: {
        position: 'absolute',
        width: currentRef.clientWidth,
        height: currentRef.clientHeight,
        left: event.pageX - shiftX,
        top: event.pageY - shiftY,
        zIndex: 1000
      }
    }));
    params.start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0
    params.shiftY = shiftY
  }
  const reorder = action((previousIndex: number, newIndex: number) => {
    params.index = newIndex;
    // Reorder the items list
    items.splice(newIndex, 0, ...items.splice(previousIndex, 1));
  })

  const list = items.map((v, i) => React.createElement(Grid, {
      item: true, xs: 12, key: v.id, ref: React.createRef<HTMLDivElement>(),
      className: params.index === i && draggingEle ? classes.gridHidden : classes.grid
    }, <Box className={classes.container}>{v.collapsed ? <Tooltip title="Hold and drag to reorder">
      <Icon className={classes.reorder} onMouseDown={e => handleMouseDown(e, i)}>reorder</Icon>
    </Tooltip> : <>
      <Tooltip title="Move this card up"><span>
        <IconButton size="small" disabled={i === 0} onClick={() => reorder(i, i - 1)}>
          <Icon>keyboard_arrow_up</Icon>
        </IconButton>
      </span></Tooltip>
      <Tooltip title="Move this card down"><span>
        <IconButton size="small" disabled={i === items.length - 1} onClick={() => reorder(i, i + 1)}>
          <Icon>keyboard_arrow_down</Icon>
        </IconButton>
      </span></Tooltip>
    </>}</Box>,
    <TestItemCard value={v} onDelete={() => deleteItem(i)} TestItemExampleCard={TestItemExampleCard}/>
  ))
  return <>{list}{draggingEle}</>
})

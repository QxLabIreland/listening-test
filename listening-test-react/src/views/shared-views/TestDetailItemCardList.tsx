import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import React, {FunctionComponent, MouseEvent, useState} from "react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
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
  reorder: {width: 12, cursor: 'grab', position: 'absolute', left: 7, color: 'rgba(0, 0, 0, 0.54)'},
  upDown: {fontSize: 18}
}))

export const TestDetailItemCardList = observer(function ({items, TestItemExampleCard}: { items: TestItemModel[], TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }> }) {
  if (!items) items = observable([]);
  const [state] = useState(observable({index: null}));
  const [refs] = useState<HTMLDivElement[]>([]);
  const classes = useStyles();

  const findCollision = (event: MouseEvent<any>) => {
    for (let i = 0; i < refs.length; i += 1) {
      if (!refs[i] || i === state.index) continue;
      const rect = refs[i].getBoundingClientRect();
      const targetRect = refs[state.index].getBoundingClientRect();
      // Collision item is above target: mouse is below the top of collision, mouse is above
      if ((rect.top < targetRect.top && event.clientY >= rect.top && event.clientY <= rect.top + targetRect.height * 2/3)
        || (rect.bottom > targetRect.bottom && event.clientY <= rect.bottom && event.clientY >= rect.bottom - targetRect.height * 2/3))
        return refs[i];
    }
    return undefined;
  }
  const deleteItem = action((index: number) => items.splice(index, 1));
  const handleMouseDown = (event: MouseEvent<any>, index: number) => {
    // Get index of the element
    state.index = index;
    const shiftX = event.clientX - refs[state.index].getBoundingClientRect().left;
    const shiftY = event.clientY - refs[state.index].getBoundingClientRect().top;
    // Clone a element for items display (move up or down)
    const clonedDragEle = refs[state.index].cloneNode(true) as HTMLDivElement;
    clonedDragEle.style.position = 'absolute';
    clonedDragEle.style.width = refs[state.index].clientWidth + 'px';
    clonedDragEle.style.height = refs[state.index].clientHeight + 'px';
    clonedDragEle.style.left = event.pageX - shiftX + 'px';
    clonedDragEle.style.top = event.pageY - shiftY + 'px';
    clonedDragEle.style.zIndex = '1000';
    // Find the container and append the clone
    const listContainer = document?.querySelector('#containerTestDetailItemCardList');
    listContainer.append(clonedDragEle);
    // const start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0
    // About setting interval to scroll the screen
    let scrollIntervalY: any = null;
    const onMouseMove = (event: any) => {
      // Scroll when mouse is close to top or bottom of the window
      if (!scrollIntervalY) {
        if (window?.innerHeight - 40 <= event.clientY)
          scrollIntervalY = setInterval(() => window.scrollBy(0, (window?.innerHeight - event.clientY) / 2), 20);
        else if (event.clientY <= 104)
          scrollIntervalY = setInterval(() => window.scrollBy(0, -(104 - event.clientY) / 2), 20);
      } else if (window?.innerHeight - 20 > event.clientY && event.clientY > 84) {
        clearInterval(scrollIntervalY);
        scrollIntervalY = null;
      }
      // Dragging element to move and prevent move outside of list container
      const rectContainer = listContainer.getBoundingClientRect();
      if (event.clientY < rectContainer.top || event.clientY > rectContainer.bottom) return;
      // ref.current.style.left = event.pageX - shiftX + 'px';
      clonedDragEle.style.top = event.pageY - shiftY + 'px';
      // Give a threshold for movement, and if dragging element is out of list
      const collision = findCollision(event);
      if (collision) handleReorder(state.index, refs.indexOf(collision));
      // const end = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      // // When element position is relative
      // draggingRef.style.top = end - start + 'px';
    }
    const onMouseUp = () => {
      // Clear listeners, clone div, interval and index
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener("mouseleave", onMouseUp);
      clonedDragEle.remove();
      clearInterval(scrollIntervalY);
      scrollIntervalY = null;
      state.index = null;
    }
    // Move the clone on mousemove
    document?.addEventListener('mousemove', onMouseMove);
    document?.addEventListener('mouseup', onMouseUp);
    document?.addEventListener("mouseleave", onMouseUp);
  }
  const handleReorder = action((previousIndex: number, newIndex: number, resetIndex = false) => {
    // Reorder the items list
    items.splice(newIndex, 0, ...items.splice(previousIndex, 1));
    state.index = resetIndex ? null : newIndex;
  })

  return <>{items.map((v, i) => <Grid item xs={12} key={v.id} ref={ref => refs[i] = ref}
                                      className={state.index === i ? classes.gridHidden : classes.grid}>
    <Box className={classes.container}>{v.collapsed ? <Tooltip title="Hold and drag to reorder">
      <Icon className={classes.reorder} onMouseDown={e => handleMouseDown(e, i)}>reorder</Icon>
    </Tooltip> : <>
      <Tooltip title="Move this card up"><span>
        <IconButton size="small" disabled={i === 0} onClick={() => handleReorder(i, i - 1, true)}>
          <Icon className={classes.upDown}>arrow_upward</Icon>
        </IconButton>
      </span></Tooltip>
      <Tooltip title="Move this card down"><span>
        <IconButton size="small" disabled={i === items.length - 1} onClick={() => handleReorder(i, i + 1, true)}>
          <Icon className={classes.upDown}>arrow_downward</Icon>
        </IconButton>
      </span></Tooltip>
    </>}</Box>
    <TestItemCard value={v} onDelete={() => deleteItem(i)} TestItemExampleCard={TestItemExampleCard}/>
  </Grid>)}
  </>
})

import { observer } from 'mobx-react';
import React, { MouseEvent, useReducer, useRef, useState } from 'react';

import { Box, Icon, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';

import { TestUrl } from '../../shared/enums/test-urls';
import { testDetails } from './test-details-store';
import { TestItemCard } from './test-items/TestItemCard';

/**
 * The list of items for Detail page. It converts testUrl into different Cards
 * This component is for reordering purpose
 */
export default observer(function TestDetailItemCardList({ testUrl }: { testUrl: TestUrl }) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const operatingIndex = useRef(null);
  const [refs] = useState<HTMLDivElement[]>([]);

  const findCollision = (event: MouseEvent<any>) => {
    for (let i = 0; i < refs.length; i += 1) {
      if (!refs[i] || i === operatingIndex.current) continue;
      const rect = refs[i].getBoundingClientRect();
      const targetRect = refs[operatingIndex.current].getBoundingClientRect();
      // Collision item is above target: mouse is below the top of collision, mouse is above
      if (
        (rect.top < targetRect.top &&
          event.clientY >= rect.top &&
          event.clientY <= rect.top + (targetRect.height * 2) / 3) ||
        (rect.bottom > targetRect.bottom &&
          event.clientY <= rect.bottom &&
          event.clientY >= rect.bottom - (targetRect.height * 2) / 3)
      )
        return refs[i];
    }
    return undefined;
  };
  // When mouse down, start dragging
  const handleMouseDown = (event: MouseEvent<HTMLElement>, index: number) => {
    // Get index of the element
    operatingIndex.current = index;
    const shiftX = event.clientX - refs[operatingIndex.current].getBoundingClientRect().left;
    const shiftY = event.clientY - refs[operatingIndex.current].getBoundingClientRect().top;
    // Clone a element for items display (move up or down)
    const clonedDragEle = refs[operatingIndex.current].cloneNode(true) as HTMLDivElement;
    clonedDragEle.style.position = 'absolute';
    clonedDragEle.style.width = refs[operatingIndex.current].clientWidth + 'px';
    clonedDragEle.style.height = refs[operatingIndex.current].clientHeight + 'px';
    clonedDragEle.style.left = event.pageX - shiftX + 'px';
    clonedDragEle.style.top = event.pageY - shiftY + 'px';
    clonedDragEle.style.zIndex = '1000';
    // Find the container and append the clone
    const listContainer = document?.querySelector('#containerTestDetailItemCardList');
    listContainer.append(clonedDragEle);
    // const start = event.pageY ? event.pageY : event.clientY ? event.clientY : 0
    // About setting interval to scroll the screen
    let scrollIntervalY: ReturnType<typeof setInterval> = null;
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
      if (collision) handleReorder(operatingIndex.current, refs.indexOf(collision));
      // const end = event.pageY ? event.pageY : event.clientY ? event.clientY : 0;
      // // When element position is relative
      // draggingRef.style.top = end - start + 'px';
    };
    const onMouseUp = () => {
      // Clear listeners, clone div, interval and index
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseUp);
      clonedDragEle.remove();
      clearInterval(scrollIntervalY);
      scrollIntervalY = null;
      operatingIndex.current = null;
      forceUpdate();
    };
    // Move the clone on mousemove
    document?.addEventListener('mousemove', onMouseMove);
    document?.addEventListener('mouseup', onMouseUp);
    document?.addEventListener('mouseleave', onMouseUp);
    forceUpdate();
  };
  const handleReorder = (previousIndex: number, newIndex: number, resetIndex = false) => {
    // Reorder the items list
    testDetails.reorderItem(previousIndex, newIndex);
    operatingIndex.current = resetIndex ? null : newIndex;
  };

  return testDetails.data.items.map((v, i) => (
    <Grid
      item
      xs={12}
      key={v.id}
      ref={ref => (refs[i] = ref)}
      sx={{ position: 'relative', visibility: operatingIndex.current === i ? 'hidden' : 'visible' }}>
      <Box
        sx={theme => ({
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 0,
          right: 0,
          top: 0,
          bottom: 0,
          [theme.breakpoints.down(1245)]: { right: 14 },
        })}>
        {v.collapsed ? (
          <Tooltip title="Hold and drag to reorder">
            <Icon
              sx={{ width: 12, cursor: 'grab', position: 'absolute', left: 7, color: 'rgba(0, 0, 0, 0.54)' }}
              onMouseDown={e => handleMouseDown(e, i)}>
              reorder
            </Icon>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Move this card up">
              <span>
                <IconButton size="small" disabled={i === 0} onClick={() => handleReorder(i, i - 1, true)}>
                  <Icon>arrow_upward</Icon>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move this card down">
              <span>
                <IconButton
                  size="small"
                  disabled={i === testDetails.data.items.length - 1}
                  onClick={() => handleReorder(i, i + 1, true)}>
                  <Icon>arrow_downward</Icon>
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}
      </Box>
      <TestItemCard itemIndex={i} testUrl={testUrl} />
    </Grid>
  ));
});

import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { Tooltip, useTheme } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

import { BasicTaskItemModel } from '../../../../shared/models/BasicTaskModel';
import { testDetails } from '../../test-details-store';

// Buttons group for common operations
export default observer(function HeaderIconButtons({ item }: { item: BasicTaskItemModel }) {
  const theme = useTheme();
  const trans = theme.transitions.create('all', { duration: theme.transitions.duration.shortest });

  return (
    <>
      <Tooltip title={`${item.collapsed ? 'Expand' : 'Collapse'} Question`}>
        <IconButton
          sx={{ transform: item.collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: trans }}
          onClick={() => runInAction(() => (item.collapsed = !item.collapsed))}>
          <Icon>{item.collapsed ? 'unfold_more' : 'unfold_less'}</Icon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy This Question">
        <IconButton onClick={() => testDetails.copyItem(item)}>
          <Icon>content_copy</Icon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Question">
        <IconButton onClick={() => testDetails.deleteItem(item)}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    </>
  );
});

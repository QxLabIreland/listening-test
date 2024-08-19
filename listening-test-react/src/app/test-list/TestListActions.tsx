import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { axiosErrorHandler, globalStore } from '../../global/globalStore';
import { TestUrl } from '../../shared/enums/test-urls';
import { AudioExampleModel } from '../../shared/models/AudioTestModel';
import { BasicTaskModel } from '../../shared/models/BasicTaskModel';
import { DeleteButtonAndDialog } from './DeleteButtonAndDialog';
import { ShareLinkDialog } from './ShareLinkDialog';
import { tasksStore } from './task-list-store';

/** When width is less than md, the button will be put into a menu*/
export default function TestListActions({
  testUrl,
  task,
  handleEdit,
}: {
  testUrl: TestUrl;
  handleEdit: (_: BasicTaskModel) => void;
  task: BasicTaskModel;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  const shareDialogState = React.useState(false);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleTaskCopy = () => {
    // Compatible fix for previous bug, delete the value that set in preview mode.
    task.items.forEach(value => {
      if (value.questionControl?.value) value.questionControl.value = undefined;
      if (value.example?.hasOwnProperty('playedOnce')) delete (value.example as AudioExampleModel).playedOnce;
      if (value.example?.fields) value.example.fields.forEach(value1 => (value1.value = undefined));
    });
    axios
      .post<BasicTaskModel>('/api/' + testUrl, { ...task, name: task.name + ' copy' })
      .then(({ data }) => {
        // Give a 0 responseNum and put at the top of the list
        data.responseNum = 0;
        tasksStore.unshift(data);
        globalStore.showSnackbar('Duplicate successfully', 'success');
      })
      .catch(axiosErrorHandler);
  };

  return (
    <>
      <ShareLinkDialog taskUrl={testUrl} task={task} shareDialogState={shareDialogState} />
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Tooltip title="Share this test">
          <IconButton color="primary" size="small" onClick={() => shareDialogState[1](true)}>
            <Icon>share</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          {task.isTemplate ? (
            <IconButton size="small" color="primary" onClick={() => handleEdit(task)}>
              <Icon>edit</Icon>
            </IconButton>
          ) : (
            <IconButton size="small" color="primary" component={Link} to={task._id.$oid}>
              <Icon>edit</Icon>
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Duplicate test">
          <IconButton size="small" color="primary" onClick={handleTaskCopy}>
            <Icon>content_copy</Icon>
          </IconButton>
        </Tooltip>
        <DeleteButtonAndDialog testUrl={testUrl} task={task} />
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <IconButton size="small" color="primary" onClick={handleMenuClick}>
          <Icon>menu</Icon>
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => shareDialogState[1](true)}>
            <ListItemIcon color="primary">
              <Icon>share</Icon>
            </ListItemIcon>
            <ListItemText primary="Share task URL" />
          </MenuItem>
          {task.isTemplate ? (
            <MenuItem onClick={() => handleEdit(task)}>
              <ListItemIcon color="primary">
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
          ) : (
            <MenuItem component={Link} to={task._id.$oid}>
              <ListItemIcon color="primary">
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
          )}
          <MenuItem onClick={handleTaskCopy}>
            <ListItemIcon color="primary">
              <Icon>content_copy</Icon>
            </ListItemIcon>
            <ListItemText primary="Duplicate" />
          </MenuItem>
          <DeleteButtonAndDialog testUrl={testUrl} task={task} menu />
        </Menu>
      </Box>
    </>
  );
}

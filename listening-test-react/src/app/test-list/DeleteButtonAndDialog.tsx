import axios from 'axios';
import React from 'react';
import { useContext, useState } from 'react';

import { Button, DialogActions, Icon, IconButton, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

import { globalStore } from '../../global/globalStore';
import { GlobalDialog } from '../../shared/ReactContexts';
import { TestUrl } from '../../shared/enums/test-urls';
import { BasicTaskModel } from '../../shared/models/BasicTaskModel';
import { tasksStore } from '../task-list-store';

export function DeleteButtonAndDialog({
  testUrl,
  task,
  menu,
}: {
  testUrl: TestUrl;
  task: BasicTaskModel;
  menu?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const openDialog = useContext(GlobalDialog);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  // When trash button clicked. If it is a temple there will be alert
  const handleTaskDelete = () => {
    const openRequest = () =>
      axios.delete('/api/' + testUrl, { params: { _id: task._id.$oid } }).then(() => {
        tasksStore.delete(task);
        globalStore.showSnackbar('Delete successfully', undefined, 'success');
      });
    if (task.isTemplate)
      openDialog(
        'This test is currently being used as a template. Are you sure you want to delete this template?',
        'Are you sure?',
        null,
        openRequest,
      );
    else openRequest().catch();
  };

  const dialog = (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Delete test</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this test? All Responses related to the test will also be deleted
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleTaskDelete} color="secondary">
          Delete test and responses
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (menu)
    return (
      <>
        <MenuItem onClick={handleOpen}>
          <ListItemIcon>
            <Icon>delete</Icon>
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
        {dialog}
      </>
    );

  return (
    <>
      <Tooltip title="Delete">
        <IconButton size="small" color="default" onClick={handleOpen}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
      {dialog}
    </>
  );
}

import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Button, DialogActions, Icon, IconButton, ListItemIcon, ListItemText, MenuItem} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Tooltip from "@material-ui/core/Tooltip";

export function DeleteButtonAndDialog({onDelete, menu = false}: { onDelete: () => void, menu?: boolean }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const dialog = <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle>Delete test</DialogTitle>
    <DialogContent>
      Are you sure you want to delete this test? All Responses related to the test will also be deleted
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={onDelete} color="secondary">Delete test and responses</Button>
    </DialogActions>
  </Dialog>;

  if (menu) return <>
    <MenuItem onClick={handleOpen}>
      <ListItemIcon><Icon>delete</Icon></ListItemIcon>
      <ListItemText primary="Delete"/>
    </MenuItem>
    {dialog}
  </>;

  return <>
    <Tooltip title="Delete">
      <IconButton size="small" color="default" onClick={handleOpen}>
        <Icon>delete</Icon>
      </IconButton>
    </Tooltip>
    {dialog}
  </>;
}

import React, {PropsWithChildren, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {GlobalDialog} from "../ReactContexts";


export default function GlobalDialogProvider(props: PropsWithChildren<any>) {
  const [options, setOptions] = useState<any>({});
  const [open, setOpen] = useState(false);

  const openGlobalDialog = (description: string, title: string, onDismiss: ()=>void, onConfirm: ()=>void) => {
    setOptions({description, title, onDismiss, onConfirm});
    setOpen(true);
  }

  const handleClose = () => {
    if (options.onDismiss) options.onDismiss();
    setOpen(false);
  }

  const handleConfirm = () => {
    if (options.onConfirm) options.onConfirm();
    setOpen(false)
  }

  return (
    <GlobalDialog.Provider value={openGlobalDialog}>
      {props.children}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{options.title ? options.title : 'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {options.description ? options.description : 'Unknown error'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Dismiss</Button>
          {options.onConfirm && <Button onClick={handleConfirm} color="primary" autoFocus>Confirm</Button>}
        </DialogActions>
      </Dialog>
    </GlobalDialog.Provider>
  );
}

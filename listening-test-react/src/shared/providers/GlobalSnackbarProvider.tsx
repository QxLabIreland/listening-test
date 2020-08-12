import React, {PropsWithChildren, useState} from "react";
import {Icon, IconButton, Snackbar} from "@material-ui/core";
import {GlobalSnackbar} from "../ReactContexts";
import {Alert} from "@material-ui/lab";

export default function GlobalSnackbarProvider(props: PropsWithChildren<any>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any>({});

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false);
  };

  const openSnackbar = (message: string, time = 6_000, severity?: 'success' | 'error' | 'warning' | 'info') => {
    setOptions({message, time, severity});
    setOpen(true);
  }

  return <GlobalSnackbar.Provider value={openSnackbar}>
    {props.children}
    {options.severity ? <Snackbar open={open} autoHideDuration={options.time} onClose={handleClose} action={
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <Icon fontSize="small">cancel</Icon>
      </IconButton>
    }>
      <Alert onClose={handleClose} severity={options.severity} variant="filled" elevation={6}>
        {options.message}
      </Alert>
    </Snackbar> : <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      open={open}
      autoHideDuration={options.time}
      onClose={handleClose}
      message={options.message}
      action={<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <Icon fontSize="small">cancel</Icon>
      </IconButton>}
    />}

  </GlobalSnackbar.Provider>
}

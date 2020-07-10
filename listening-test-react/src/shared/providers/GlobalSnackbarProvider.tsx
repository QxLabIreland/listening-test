import React, {useState} from "react";
import {Icon, IconButton, Snackbar} from "@material-ui/core";
import {GlobalSnackbar} from "../ReactContexts";

export default function GlobalSnackbarProvider(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any>({});

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false);
  };

  const openSnackbar = (message, time = 6_000) => {
    setOptions({message, time});
    setOpen(true);
  }

  return <GlobalSnackbar.Provider value={openSnackbar}>
    {props.children}
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={options.time}
      onClose={handleClose}
      message={options.message}
      action={<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <Icon fontSize="small">cancel</Icon>
      </IconButton>}
    />
  </GlobalSnackbar.Provider>
}

import React, {useState} from "react";
import {Alert, AlertTitle} from "@material-ui/lab";
import {Collapse, createStyles, Icon, IconButton, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  alertTop: {marginTop: theme.spacing(2)}
}))

type severityType = 'success' | 'error' | 'warning' | 'info';

interface SimpleAlertMessage {
  severity: severityType;
  title?: string;
  content: string;
}

export function useSimpleAlert(disableClose: boolean = false): [JSX.Element, (severity: severityType, content: string, title?: string) => void, SimpleAlertMessage] {
  const [open, setOpen] = useState<boolean>();
  const [message, setMessage] = useState<SimpleAlertMessage>();
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };
  const handleExited = () => {
    setMessage(null);
  }

  const setGeneralAlertMessage = (severity: severityType, content: string, title?: string) => {
    setMessage({severity: severity, content: content, title: title});
    setOpen(true);
  }

  return [<Collapse in={open} onExited={handleExited}>
    <Alert className={classes.alertTop} severity={message?.severity} action={
      !disableClose && <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
        <Icon fontSize="inherit">close</Icon>
      </IconButton>}>
      {message?.title && <AlertTitle>{message?.title}</AlertTitle>}
      {message?.content}
    </Alert>
  </Collapse>, setGeneralAlertMessage, message];
}

import React, {useState} from "react";
import {Alert, AlertTitle} from "@material-ui/lab";
import {Collapse, createStyles, Icon, IconButton, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  alertTop: {marginTop: theme.spacing(2)}
}))

type severityType = 'success' | 'error' | 'warning' | 'info';

interface GeneralAlertMessage {
  severity: severityType;
  title?: string;
  content: string;
}

export function useGeneralAlert(): [JSX.Element, (severity: 'success' | 'error' | 'warning' | 'info', content: string, title?: string) => void] {
  const [open, setOpen] = useState<boolean>();
  const [message, setMessage] = useState<GeneralAlertMessage>();
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };
  const handleExited = () => {
    setMessage(null);
  }

  const setGeneralAlertMessage = (severity: 'success' | 'error' | 'warning' | 'info', content: string, title?: string) => {
    setMessage({severity: severity, content: content, title: title});
    setOpen(true);
  }

  return [<Collapse in={open} onExited={handleExited}>
    <Alert className={classes.alertTop} severity={message?.severity} action={
      <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
        <Icon fontSize="inherit">close</Icon>
      </IconButton>}>
      {message?.title && <AlertTitle>{message?.title}</AlertTitle>}
      {message?.content}
    </Alert>
  </Collapse>, setGeneralAlertMessage];
}

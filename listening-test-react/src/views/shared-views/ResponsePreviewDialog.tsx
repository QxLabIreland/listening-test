import React, {PropsWithChildren} from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import {AppBar, Container, createStyles, Icon} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles} from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => createStyles({
  paperFullScreen: {backgroundColor: theme.palette.background.default}
}))

export default function ResponsePreviewDialog(props: PropsWithChildren<any>) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return <React.Fragment>
    <IconButton size="small" onClick={handleClickOpen}>
      <Icon>pageview</Icon>
    </IconButton>
    <CssBaseline/>
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}
            classes={classes}>
      <AppBar position="static">
        <Toolbar style={{display: 'flex'}}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h6">
            Response view (changed won't be saved)
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        {props.children}
      </Container>
    </Dialog>
  </React.Fragment>;
}

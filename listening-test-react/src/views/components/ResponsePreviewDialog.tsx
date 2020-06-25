import React from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import {Container, Icon} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResponsePreviewDialog(props) {
  const [open, setOpen] = React.useState(false);

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
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <Toolbar style={{display: 'flex'}}>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <Icon>close</Icon>
        </IconButton>
        <Typography variant="h6">
          Response view
        </Typography>
      </Toolbar>
      <Container maxWidth="md">
        {props.children}
      </Container>
    </Dialog>
  </React.Fragment>;
}

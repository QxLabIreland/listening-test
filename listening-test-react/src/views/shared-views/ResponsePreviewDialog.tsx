import React, {forwardRef, useState} from "react";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import IconButton, {IconButtonProps} from "@material-ui/core/IconButton";
import {AppBar, Container, Icon} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles} from "@material-ui/core/styles";
import {BasicTaskModel} from "../../shared/models/BasicTaskModel";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {SurveyPage} from "./SurveyPage";
import {observer} from "mobx-react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  rootAppBar: {backgroundColor: theme.palette.warning.dark},
}));
const useMatBackground = makeStyles((theme) => ({
  paperFullScreen: {backgroundColor: theme.palette.background.default}
}));

export const ResponsePreviewDialog = observer(forwardRef(function (props: IconButtonProps & { taskModel: BasicTaskModel, testUrl: TestUrl }, ref: any) {
  // Deconstruct taskModel, but we don't need its value
  const {taskModel: original, testUrl, ...rest} = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const backgroundClasses = useMatBackground();
  const [taskModel] = useState<BasicTaskModel>(JSON.parse(JSON.stringify(original)));
  // Unwrap the observable, it will return a copy
  // const taskModelJs = toJS(props.taskModel);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return <React.Fragment>
    <IconButton ref={ref} {...rest} onClick={handleClickOpen}>
      <Icon>visibility</Icon>
    </IconButton>
    <CssBaseline/>
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} classes={backgroundClasses}>
      <AppBar position="sticky" className={classes.rootAppBar}>
        <Toolbar style={{display: 'flex'}}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h6">
            Preview mode (changed won't be saved)
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        <SurveyPage testUrl={testUrl} value={taskModel}/>
      </Container>
    </Dialog>
  </React.Fragment>;
}));

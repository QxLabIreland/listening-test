import React from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme, Tooltip} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Axios from "axios";
import {AudioAbDetail} from "./AudioAbDetail";
import TestResponseView from "../components/TestResponseView";
import {useParams} from "react-router";
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import {TransitionProps} from '@material-ui/core/transitions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    }
  }),
);

export default function AbTestTab() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => setValue(newValue)
  const {id} = useParams();

  const handleDownload = () => {
    const uri = Axios.getUri({
      url: 'http://localhost:8888/api/response-download',
      params: {testType: 'abTest', testId: id}
    });
    // const uri = Axios.getUri({url: '/api/response-download', params: {testType: testType}})
    window.open(uri);
  }

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses"/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <AudioAbDetail/>}
        {value === 1 && <React.Fragment>
          <TestResponseView testType="abTest" cellActions={<ResponsePreviewDialog/>}/>
          <Tooltip title="Download All Responses For This Section">
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleDownload}>
              <Icon>get_app</Icon>
            </Fab>
          </Tooltip>
        </React.Fragment>}
      </Box>
    </React.Fragment>
  )
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ResponsePreviewDialog() {
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
          Sound
        </Typography>
        {/*<span style={{flexGrow:1}}/>
        <Button autoFocus color="inherit" onClick={handleClose}>
          save
        </Button>*/}
      </Toolbar>
      <List>
        <ListItem button>
          <ListItemText primary="Phone ringtone" secondary="Titania"/>
        </ListItem>
        <Divider/>
        <ListItem button>
          <ListItemText primary="Default notification ringtone" secondary="Tethys"/>
        </ListItem>
      </List>
    </Dialog>
  </React.Fragment>;
}

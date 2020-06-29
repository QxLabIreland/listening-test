import React from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme, Tooltip} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Axios from "axios";
import {AbTestDetail} from "./AbTestDetail";
import {useParams} from "react-router";
import AbTestResponses from "./AbTestResponses";
import {downloadFileTool} from "../../shared/ReactTools";

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

  const handleDownload = () => downloadFileTool({
    url: '/response-download', params: {testType: 'abTest', testId: id}
  });

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses" disabled={id === '0'}/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <AbTestDetail/>}
        {value === 1 && <React.Fragment>
          <AbTestResponses/>
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

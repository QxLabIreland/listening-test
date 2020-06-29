import React, {useContext, useEffect} from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme, Tooltip} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Axios from "axios";
import {AbTestDetail} from "./AbTestDetail";
import {useHistory, useLocation, useParams} from "react-router";
import AbTestResponses from "./AbTestResponses";
import {downloadFileTool} from "../../shared/ReactTools";
import {AppBarTitle} from "../../shared/ReactContexts";

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
  // Hash of location, switch to response tabl
  const location = useLocation();
  const [value, setValue] = React.useState(location.hash === '#responses' ? 1 : 0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => setValue(newValue)
  const {id} = useParams();
  const {setTitle} = useContext(AppBarTitle);
  const history = useHistory();

  useEffect(() => {
      setTitle(+id === 0 ? 'New AB Test' : !value ? 'Edit an AB Test' : 'AB Test Responses');
      history.replace({hash: !value ? null : 'responses'});
    }, [id, value]);


  const handleDownload = () => downloadFileTool({
    url: '/api/response-download', params: {testType: 'abTest', testId: id}
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

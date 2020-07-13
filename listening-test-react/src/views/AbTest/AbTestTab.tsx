import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Icon, Tab, Tabs, Tooltip} from "@material-ui/core";
import {AbTestDetail} from "./AbTestDetail";
import {useHistory, useLocation, useParams} from "react-router";
import AbTestResponses from "./AbTestResponses";
import {downloadFileTool} from "../../shared/ReactTools";
import {AppBarTitle} from "../../shared/ReactContexts";

export default function AbTestTab() {
  // Hash of location, switch to response tab. url -> value, url -> title
  const location = useLocation();
  const [value, setValue] = React.useState(location.hash === '#responses' ? 1 : 0);
  const {id} = useParams();
  const {setTitle} = useContext(AppBarTitle);
  const history = useHistory();
  // This is the state for triggering useEffect
  const [preSetValue, setPreSetValue] = useState(false);

  useEffect(() => {
    // Set correct value based on url
    setValue(location.hash === '#responses' ? 1 : 0);
    setTitle(+id === 0 ? 'New AB Test' : location.hash === '#responses' ? 'AB Test Responses': 'Edit an AB Test');
  }, [id, preSetValue]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.replace({hash: !newValue ? null : 'responses'});
    // Because prompt block cannot block code here. So we need do this in useEffect callback.
    setPreSetValue(!preSetValue);
  }

  const handleDownload = () => downloadFileTool({
    url: '/api/csv-download/abTest', params: {testId: id}
  });


  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses" disabled={id === '0'}/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <AbTestDetail/>}
        {value === 1 && <AbTestResponses>
          <Tooltip title="Download all Responses for This Test">
            <Button variant="outlined" color="primary" onClick={handleDownload}>
              <Icon>get_app</Icon>Download all Responses</Button>
          </Tooltip>
        </AbTestResponses>}
      </Box>
    </React.Fragment>
  )
}

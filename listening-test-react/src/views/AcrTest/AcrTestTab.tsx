import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Icon, Tab, Tabs, Tooltip} from "@material-ui/core";
import {useHistory, useLocation, useParams} from "react-router";
import {downloadFileTool} from "../../shared/ReactTools";
import {AppBarTitle} from "../../shared/ReactContexts";
import AcrTestDetail from "./AcrTestDetail";

export default function AcrTestTab() {
  // Hash of location, switch to response tab. url -> value -> title
  const location = useLocation();
  const [value, setValue] = React.useState<number>(location.hash === '#responses' ? 1 : 0);
  const {id} = useParams();
  const history = useHistory();
  const {setTitle} = useContext(AppBarTitle);
  const [preSetValue, setPreSetValue] = useState<boolean>(null);

  // Run when value is changed and first mount
  useEffect(() => {
    // Set correct value based on url
    setValue(location.hash === '#responses' ? 1 : 0);
    setTitle(+id === 0 ? 'New ACR Test' : !value ? 'Edit an ACR Test' : 'ACR Test Responses');
  }, [id, preSetValue]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.replace({hash: !newValue ? null : 'responses'});
    setPreSetValue(!preSetValue);
  }

  const handleDownload = () => downloadFileTool({
    url: '/api/response-download', params: {testType: 'acrTest', testId: id}
  });

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses" disabled={id === '0'}/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <AcrTestDetail/>}
        {value === 1 && <>
          <Tooltip title="Download all Responses for This Test">
            <Button variant="outlined" color="primary" onClick={handleDownload}>
              <Icon>get_app</Icon>Download all Responses</Button>
          </Tooltip>
        </>}
      </Box>
    </React.Fragment>
  )
}

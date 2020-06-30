import React, {useContext, useEffect} from "react";
import {Box, Button, Icon, Tab, Tabs, Tooltip} from "@material-ui/core";
import {AbTestDetail} from "./AbTestDetail";
import {useHistory, useLocation, useParams} from "react-router";
import AbTestResponses from "./AbTestResponses";
import {downloadFileTool} from "../../shared/ReactTools";
import {AppBarTitle} from "../../shared/ReactContexts";

export default function AbTestTab() {
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

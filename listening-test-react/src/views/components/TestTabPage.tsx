import React, {useContext, useEffect, useState} from "react";
import {Box, Tab, Tabs} from "@material-ui/core";
import {useHistory, useLocation, useParams} from "react-router";
import {AppBarTitle} from "../../shared/ReactContexts";
import {AcrTestDetail} from "../AcrTest/AcrTestDetail";
import ResponseListView from "./ResponseListView";
import {AbTestDetail} from "../AbTest/AbTestDetail";

export default function TestTabPage(props: {testType: 'abTest' | 'acrTest', testName: string}) {
  const {testType, testName} = props;
  // Hash of location, switch to response tab. url -> value -> title
  const location = useLocation();
  const [value, setValue] = React.useState<number>(location.hash === '#responses' ? 1 : 0);
  const {id} = useParams();
  const history = useHistory();
  const {setTitle} = useContext(AppBarTitle);
  // This is the state for triggering useEffect
  const [preSetValue, setPreSetValue] = useState<boolean>(null);

  // Run when value is changed and first mount
  useEffect(() => {
    // Set correct value based on url
    setValue(location.hash === '#responses' ? 1 : 0);
    setTitle(+id === 0 ? `New ${testName}` : location.hash !== '#responses' ? `Edit an ${testName}` : `${testName} Responses`);
  }, [id, preSetValue]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.replace({hash: newValue === 1 ? 'responses' : null});
    // Because prompt block cannot block code here. So we need do this in useEffect callback.
    setPreSetValue(!preSetValue);
  }

  const renderDetail = () => {
    switch (testType) {
      case "abTest": return <AbTestDetail/>
      case "acrTest": return <AcrTestDetail/>
      default: return null;
    }
  }

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses" disabled={id === '0'}/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && renderDetail()}
        {value === 1 && <ResponseListView testType={testType}/>}
      </Box>
    </React.Fragment>
  )
}

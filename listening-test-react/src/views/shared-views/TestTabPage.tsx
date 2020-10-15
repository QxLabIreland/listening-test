import React, {useContext, useEffect, useState} from "react";
import {Box, Tab, Tabs} from "@material-ui/core";
import {useHistory, useLocation, useParams} from "react-router";
import {AppBarTitle} from "../../shared/ReactContexts";
import ResponseListView from "./ResponseListView";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {TestDetailView} from "./TestDetailView";
import {AbAddItemButtonGroup} from "../audio/AbTest/AbAddItemButtonGroup";
import {AcrAddItemButtonGroup} from "../audio/AcrTest/AcrAddItemButtonGroup";
import {HearingAddItemButtons} from "../audio/HearingTest/HearingAddItemButtons";
import {AudioLabelingButtonGroup} from "../audio/AudioLabeling/AudioLabelingButtonGroup";
import {ImageLabelingButtonGroup} from "../image/ImageLabeling/ImageLabelingButtonGroup";
import {VideoLabelingButtonGroup} from "../video/VideoLabelingButtonGroup";
import {ImageAbButtonGroup} from "../image/ImageAb/ImageAbButtonGroup";

export default function TestTabPage(props: {testUrl: TestUrl, testName: string}) {
  const {testUrl, testName} = props;
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

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions"/>
        <Tab label="Responses" disabled={id === '0'}/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <TestDetailViewWrapper testUrl={testUrl}/>}
        {value === 1 && <ResponseListView testUrl={testUrl}/>}
      </Box>
    </React.Fragment>
  )
}

// Switch different card and button group through 'testType'
function TestDetailViewWrapper({testUrl}: {testUrl: TestUrl}) {
  switch (testUrl) {
    case "ab-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AbAddItemButtonGroup}/>
    case "acr-test":
    case "mushra-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AcrAddItemButtonGroup}/>
    case "hearing-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={HearingAddItemButtons}/>
    case "audio-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AudioLabelingButtonGroup}/>
    case "image-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={ImageLabelingButtonGroup}/>
    case "image-ab":
      return <TestDetailView testUrl={testUrl} ButtonGroup={ImageAbButtonGroup}/>
    case "video-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={VideoLabelingButtonGroup}/>
    case "video-ab":
      return <TestDetailView testUrl={testUrl} ButtonGroup={VideoLabelingButtonGroup}/>
    default:
      return null;
  }
}

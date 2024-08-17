import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Tab, Tabs } from '@mui/material';

import { AbAddItemButtonGroup } from '../../components/audio/AbTest/AbAddItemButtonGroup';
import { AcrAddItemButtonGroup } from '../../components/audio/AcrTest/AcrAddItemButtonGroup';
import { AudioLabelingButtonGroup } from '../../components/audio/AudioLabeling/AudioLabelingButtonGroup';
import { HearingAddItemButtons } from '../../components/audio/HearingTest/HearingAddItemButtons';
import { MushraAddItemButtonGroup } from '../../components/audio/Mushra/MushraAddItemButtonGroup';
import { ImageAbButtonGroup } from '../../components/image/ImageAb/ImageAbButtonGroup';
import { ImageLabelingButtonGroup } from '../../components/image/ImageLabeling/ImageLabelingButtonGroup';
import { VideoAbButtonGroup } from '../../components/video/VideoAb/VideoAbButtonGroup';
import { VideoLabelingButtonGroup } from '../../components/video/VideoLabeling/VideoLabelingButtonGroup';
import { globalStore } from '../../global/globalStore';
import { TestUrl } from '../../shared/enums/test-urls';
import ResponseListView from '../test-responses/ResponseListView';
import { TestDetailView } from './TestDetailView';

const URL_TO_BUTTON_GROUP = {
  'ab-test': AbAddItemButtonGroup,
  'acr-test': AcrAddItemButtonGroup,
  'mushra-test': MushraAddItemButtonGroup,
  'hearing-test': HearingAddItemButtons,
  'audio-labeling': AudioLabelingButtonGroup,
  'image-labeling': ImageLabelingButtonGroup,
  'image-ab': ImageAbButtonGroup,
  'video-labeling': VideoLabelingButtonGroup,
  'video-ab': VideoAbButtonGroup,
} as const;

const RESPONSE_URL = '#responses';

export default function TestTabPage(props: { testUrl: TestUrl; testName: string }) {
  const { testUrl, testName } = props;
  // Hash of location, switch to response tab. url -> value -> title
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isResponsePage = location.hash === RESPONSE_URL;

  // Run when value is changed and first mount
  useEffect(() => {
    globalStore.setAppBarTitle(
      +id === 0 ? `New ${testName}` : isResponsePage ? `${testName} Responses` : `Edit ${testName}`,
    );
  }, [id, isResponsePage]);

  const handleTabChange = () => {
    navigate({ hash: isResponsePage ? null : RESPONSE_URL });
  };

  return (
    <React.Fragment>
      <Tabs
        value={isResponsePage ? 1 : 0}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered>
        <Tab label="Questions" />
        <Tab label="Responses" disabled={id === '0'} />
      </Tabs>
      <Box paddingTop={2}>
        {!isResponsePage && <TestDetailView testUrl={testUrl} ButtonGroup={URL_TO_BUTTON_GROUP[testUrl]} />}
        {isResponsePage && <ResponseListView testUrl={testUrl} />}
      </Box>
    </React.Fragment>
  );
}

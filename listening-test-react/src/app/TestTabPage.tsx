import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { AbAddItemButtonGroup } from '../components/audio/AbTest/AbAddItemButtonGroup';
import { AcrAddItemButtonGroup } from '../components/audio/AcrTest/AcrAddItemButtonGroup';
import { AudioLabelingButtonGroup } from '../components/audio/AudioLabeling/AudioLabelingButtonGroup';
import { HearingAddItemButtons } from '../components/audio/HearingTest/HearingAddItemButtons';
import { MushraAddItemButtonGroup } from '../components/audio/Mushra/MushraAddItemButtonGroup';
import { ImageAbButtonGroup } from '../components/image/ImageAb/ImageAbButtonGroup';
import { ImageLabelingButtonGroup } from '../components/image/ImageLabeling/ImageLabelingButtonGroup';
import { VideoAbButtonGroup } from '../components/video/VideoAb/VideoAbButtonGroup';
import { VideoLabelingButtonGroup } from '../components/video/VideoLabeling/VideoLabelingButtonGroup';
import { globalStore } from '../global/globalStore';
import { RESPONSE_HASH_URL, TestUrl } from '../shared/enums/test-urls';
import TestDetailView from './test-details/TestDetailView';
import ResponseListView from './test-responses/ResponseListView';

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

export default function TestTabPage(props: { testUrl: TestUrl; testName: string }) {
  const { testUrl, testName } = props;
  // Hash of location, switch to response tab. url -> value -> title
  const location = useLocation();
  const { id } = useParams();

  const isResponsePage = location.hash === RESPONSE_HASH_URL;

  // Run when value is changed and first mount
  useEffect(() => {
    globalStore.setAppBarTitle(
      id === '0' ? `New ${testName}` : isResponsePage ? `${testName} Responses` : `Edit ${testName}`,
    );
  }, [id, isResponsePage]);

  if (isResponsePage) return <ResponseListView testUrl={testUrl} />;

  return <TestDetailView testUrl={testUrl} id={id} ButtonGroup={URL_TO_BUTTON_GROUP[testUrl]} />;
}

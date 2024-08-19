import { observer } from 'mobx-react';
import React, { FunctionComponent, ReactNode } from 'react';

import { AbTestItemExampleCard } from '../../../components/audio/AbTest/AbTestItemExampleCard';
import { AcrTestItemExampleCard } from '../../../components/audio/AcrTest/AcrTestItemExampleCard';
import { HearingTestItemExampleCard } from '../../../components/audio/HearingTest/HearingTestItemExampleCard';
import { MushraTestItemExampleCard } from '../../../components/audio/Mushra/MushraTestItemExampleCard';
import AudioTestItemTraining from '../../../components/audio/training/AudioTestItemTraining';
import { ImageAbExampleItem } from '../../../components/image/ImageAb/ImageAbExampleItem';
import { ImageLabelingExampleItem } from '../../../components/image/ImageLabeling/ImageLabelingExampleItem';
import { TestItemType } from '../../../shared/enums/test-items';
import { TestUrl } from '../../../shared/enums/test-urls';
import { BasicExampleModel } from '../../../shared/models/BasicTaskModel';
import { testDetails } from '../test-details-store';
import GroupDivider from './GroupDivider';
import HeaderIconButtons from './components/HeaderIconButtons';
import TitleInput from './components/TitleInput';
import TestItemQuestionCard from './survery/TestItemQuestionCard';

/** The purpose of this file is to simplify the code, because there are lots of places using this type and props */
type TestItemExampleCardType = FunctionComponent<{
  example: BasicExampleModel;
  title: ReactNode;
  action: ReactNode;
  collapsed?: boolean;
}>;

// Switch different card through 'testType'
function overrideExampleItem(testUrl: TestUrl): TestItemExampleCardType {
  switch (testUrl) {
    case 'ab-test':
      return AbTestItemExampleCard;
    case 'acr-test':
      return AcrTestItemExampleCard;
    case 'mushra-test':
      return MushraTestItemExampleCard;
    case 'hearing-test':
      return HearingTestItemExampleCard;
    case 'image-labeling':
      return ImageLabelingExampleItem;
    case 'image-ab':
      return ImageAbExampleItem;
    case 'video-labeling':
      return props => <ImageLabelingExampleItem {...props} type="video" />;
    case 'video-ab':
      return props => <ImageAbExampleItem {...props} mediaType="video" />;
    default:
      return null;
  }
}

/** To display item in different card based on type */
export const TestItemCard = observer(function (props: { itemIndex: number; testUrl: TestUrl }) {
  const { itemIndex: index, testUrl } = props;
  const item = testDetails.data.items[index];

  switch (item.type) {
    case TestItemType.example:
      const ExampleCard: TestItemExampleCardType = overrideExampleItem(testUrl);
      return (
        <ExampleCard
          title={<TitleInput item={item} />}
          action={<HeaderIconButtons item={item} />}
          example={item.example}
          collapsed={item.collapsed}
        />
      );

    case TestItemType.training:
      return <AudioTestItemTraining item={item} />;
    case TestItemType.question:
      return <TestItemQuestionCard item={item} />;
    case TestItemType.sectionHeader:
      return <GroupDivider item={item} />;
    default:
      return null;
  }
});

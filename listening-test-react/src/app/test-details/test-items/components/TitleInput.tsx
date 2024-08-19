import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';

import { labelInputStyle } from '../../../../shared/SharedStyles';
import { BasicTaskItemModel } from '../../../../shared/models/BasicTaskModel';

/** This an input that can be edited with transparent background */
export default observer(function TitleInput({ item }: { item: BasicTaskItemModel }) {
  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) =>
    runInAction(() => (item.title = event.target.value));

  return (
    <input
      style={labelInputStyle}
      onFocus={event => event.target.select()}
      value={item.title}
      onChange={handleLabelChange}
    />
  );
});

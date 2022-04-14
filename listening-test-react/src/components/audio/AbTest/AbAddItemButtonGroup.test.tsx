import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { queryByTestId, waitForElement } from '@testing-library/react';

import { jestTestContainer as container } from '../../../setupTests';
import { DetailTaskModel } from '../../../shared/ReactContexts';
import { TestItemType } from '../../../shared/models/EnumsAndTypes';
import { AbAddItemButtonGroup } from './AbAddItemButtonGroup';

it('Add button behaviour', async () => {
  const onAdd = jest.fn();
  act(() => {
    render(
      <DetailTaskModel.Provider
        value={{
          _id: { $oid: '111' },
          userId: 1,
          name: 'test',
          createdAt: { $date: new Date() },
          modifiedAt: { $date: new Date() },
          // Template fields
          isTemplate: false,
          creator: { _id: { $oid: '222' }, name: 'test name', email: 'test@email.com' },
          // This is the field show how many responses this test have
          responseNum: 1,
          // In list view, we may get rid of these fields
          description: 'description',
          items: [{ id: '1', type: TestItemType.example }],
          settings: {},
          // If this has been set, app will stop going to test page
          stopReceivingRes: false,
        }}
      >
        <AbAddItemButtonGroup onAdd={onAdd} />
      </DetailTaskModel.Provider>,
      container
    );
  });
  act(() => {
    queryByTestId(container, 'openAddMenu').click();
  });
  const addExButton = await waitForElement(() => queryByTestId(container, 'buttonAddEx'));
  act(() => {
    addExButton.click();
  });
  expect(onAdd).toHaveBeenCalledTimes(1);
});

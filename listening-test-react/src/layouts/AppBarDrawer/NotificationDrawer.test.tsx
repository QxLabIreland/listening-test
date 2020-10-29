import {act} from "react-dom/test-utils";
import {render} from "react-dom";
import {jestTestContainer as container} from "../../setupTests";
import React from "react";
import {MessageModel} from "../../shared/models/MessageModel";
import {NotificationDrawer} from "./NotificationDrawer";

describe('Notification drawer', () => {
  it("Notification drawer display", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve([
      {
        id: '1',
        unRead: false,
        content: 'A respondent has removed their response from **Test Name**. You should download the updated test data again.',
        createdAt: {$date: new Date('2020/10/28')}
      }
    ] as MessageModel[]));
    await act(async () => {
      render(<NotificationDrawer/>, container)
    });
    expect(container.textContent).toBe('notifications0');

    const openDrawerButton = container.querySelector('[aria-label="notifications"]');
    await act(async () => {
      openDrawerButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });

    const messageList = container.querySelector('[data-testid=messageList]');
    expect(messageList.textContent).toBe('A respondent');

  });
});



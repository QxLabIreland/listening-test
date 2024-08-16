import {act} from "react-dom/test-utils";
import {render} from "react-dom";
import {jestTestContainer as container} from "../../setupTests";
import React from "react";
import {NotificationDrawer} from "./NotificationDrawer";
import Axios from "axios";

describe('Notification drawer', () => {
  it("Notification drawer display", async () => {
    Axios.get = jest.fn().mockImplementation(() => Promise.resolve({
      data: {
        messages: [
          {
            id: '1',
            unRead: false,
            content: 'A respondent has removed their response from **Test Name**. You should download the updated test data again.',
            createdAt: {$date: new Date('2020/10/28')}
          }
        ]
      }
    }));
    await act(async () => {
      render(<NotificationDrawer/>, container)
    });
    expect(container.textContent).toBe('notifications0');

    // Open drawer and check data
    const openDrawerButton = container.querySelector('[aria-label="notifications"]');
    await act(async () => {
      openDrawerButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
    const messageList = document.body.querySelector('[data-testid=messageList]');
    expect(messageList.textContent).toBe('A respondent has removed their response from **Test Name**. You should download the updated test data again.10/28/2020, 12:00:00 AMNo more messages');
  });
});



import { makeAutoObservable } from 'mobx';
import { v7 } from 'uuid';

import { AlertColor } from '@mui/material';

export type SnakeBarData = { id: string; message: string; time: number; severity?: AlertColor; isOpen: boolean };

export const globalStore = makeAutoObservable({
  snackbarList: [] as SnakeBarData[],
  globalDialog: {},
  appBarTitle: '',

  showSnackbar(message: string, time = 6_000, severity?: AlertColor) {
    globalStore.snackbarList.unshift({ id: v7(), message, time, severity, isOpen: true });
  },
  closeSnakeBar(index: number) {
    globalStore.snackbarList[index].isOpen = false;
  },
  removeSnakeBar(index: number) {
    globalStore.snackbarList.splice(index, 1);
  },

  setAppBarTitle(newTitle: string) {
    globalStore.appBarTitle = newTitle;
  },
});

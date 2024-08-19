import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { v7 } from 'uuid';

import { AlertColor } from '@mui/material';

export type SnakeBarData = { id: string; message: string; time: number; severity?: AlertColor; isOpen: boolean };

export const globalStore = makeAutoObservable({
  snackbarList: [] as SnakeBarData[],
  globalDialog: {},
  appBarTitle: '',

  showSnackbar(message: string, severity?: AlertColor, time = 6_000) {
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

export const axiosErrorHandler = (reason: AxiosError) =>
  globalStore.showSnackbar('Something went wrong: ' + reason.response?.data, 'error');

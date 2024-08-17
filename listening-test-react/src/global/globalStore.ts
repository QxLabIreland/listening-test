import { AlertColor } from '@mui/material';
import { makeAutoObservable } from 'mobx';
import { v7 } from 'uuid';

export type SnakeBarData = { id: string; message: string; time: number; severity?: AlertColor; isOpen: boolean };

export const globalStore = makeAutoObservable({
  snakeBarList: [] as SnakeBarData[],
  globalDialog: {},

  showSnakeBar(message: string, time = 6_000, severity?: AlertColor) {
    globalStore.snakeBarList.unshift({ id: v7(), message, time, severity, isOpen: true });
  },
  closeSnakeBar(index: number) {
    globalStore.snakeBarList[index].isOpen = false;
  },
  removeSnakeBar(index: number) {
    globalStore.snakeBarList.splice(index, 1);
  },
});

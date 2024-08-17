import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';

import { BasicTaskModel } from '../shared/models/BasicTaskModel';

export const tasksStore = makeAutoObservable({
  data: undefined as BasicTaskModel[] | undefined,
  error: undefined as AxiosError | undefined,
  searchStr: '',

  setData(newData: BasicTaskModel[]) {
    tasksStore.data = newData;
    tasksStore.error = undefined;
  },
  setError(newError: AxiosError) {
    tasksStore.data = [];
    tasksStore.error = newError;
  },
  reset() {
    tasksStore.data = undefined;
    tasksStore.error = undefined;
  },

  setSearchStr(newStr: string) {
    tasksStore.searchStr = newStr;
  },
  get filteredData(): BasicTaskModel[] {
    return this.data.filter(
      task =>
        task.name.toLowerCase().includes(this.searchStr.toLowerCase()) ||
        // Date searching
        task.createdAt.$date.toString().toLowerCase().includes(this.searchStr.toLowerCase()),
    );
  },

  unshift(newTask: BasicTaskModel) {
    tasksStore.data.unshift(newTask);
  },
  delete(task: BasicTaskModel) {
    tasksStore.data.splice(tasksStore.data.indexOf(task), 1);
  },
});

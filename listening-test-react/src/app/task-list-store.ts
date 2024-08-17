import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { BasicTaskModel } from '../shared/models/BasicTaskModel';

export const tasksStore = makeAutoObservable({
  list: [] as BasicTaskModel[],
  loading: false,
  error: undefined as AxiosError | undefined,

  dataFetched(newList: BasicTaskModel[]) {
    tasksStore.list = newList;
    tasksStore.loading = true;
    tasksStore.error = undefined;
  },
  unshift(newTask: BasicTaskModel) {
    tasksStore.list.unshift(newTask);
  },
  delete(task: BasicTaskModel) {
    tasksStore.list.splice(tasksStore.list.indexOf(task), 1);
  },
  setError(newError: AxiosError) {
    tasksStore.list = [];
    tasksStore.loading = false;
    tasksStore.error = newError;
  },
  clear() {
    tasksStore.list = [];
    tasksStore.loading = false;
    tasksStore.error = undefined;
  },
});

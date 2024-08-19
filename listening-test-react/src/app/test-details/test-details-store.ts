import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { deepObserve } from 'mobx-utils';
import { v4 } from 'uuid';

import { TestItemType } from '../../shared/enums/test-items';
import { TestUrl } from '../../shared/enums/test-urls';
import { BasicTaskItemModel, BasicTaskModel, TestSettingsModel } from '../../shared/models/BasicTaskModel';

export const testDetails = makeAutoObservable({
  data: { name: '', description: '', items: [], settings: {} } as BasicTaskModel,
  error: undefined as AxiosError | undefined,
  isChanged: false,

  // Server data operations
  fetchData(newData: BasicTaskModel) {
    testDetails.data = newData;
    testDetails.error = undefined;
  },
  fetchFromTemplate(template: BasicTaskModel, testUrl: TestUrl) {
    // Prevent it from becoming a template and some process
    template.isTemplate = false;
    template.name = 'Name of template ' + template.name;
    template.items.forEach(item => {
      if (!item.example) return;
      // Remove the links of audios and audioRef
      if (item.type === TestItemType.example || item.type === TestItemType.training) {
        // Only ab test needs to keep audio placeholders
        if (testUrl !== 'ab-test') item.example.medias = [];
        else item.example.medias.forEach((_, index) => delete item.example!.medias[index]);
        item.example.mediaRef = undefined;
      }
    });
    testDetails.data = template;
    testDetails.error = undefined;
  },
  fetchErrored(newError: AxiosError) {
    testDetails.error = newError;
  },

  // Local data operations
  save() {
    testDetails.isChanged = false;
  },
  change() {
    testDetails.isChanged = true;
  },
  createNew(testUrl: TestUrl) {
    // Default individual question page
    if (testUrl.includes('image') || testUrl.includes('video')) testDetails.data.settings!.isIndividual = true;
  },
  update(newData: Partial<BasicTaskModel>) {
    testDetails.data = { ...testDetails.data, ...newData };
  },
  collapseAll(checked: boolean) {
    testDetails.data.items.forEach(v => (v.collapsed = checked));
  },
  updateSettings(newSettings: TestSettingsModel) {
    testDetails.data.settings = newSettings;
  },

  // Item operations
  reorderItem(previousIndex: number, newIndex: number) {
    testDetails.data.items.splice(newIndex, 0, ...testDetails.data.items.splice(previousIndex, 1));
  },
  deleteItem(item: BasicTaskItemModel) {
    const index = testDetails.data.items.findIndex(v => v === item);
    testDetails.data.items.splice(index, 1);
  },
  copyItem(item: BasicTaskItemModel) {
    const index = testDetails.data.items.findIndex(v => v === item);
    const copied = JSON.parse(JSON.stringify(item)) as BasicTaskItemModel;
    copied.id = v4();
    // Use splice to insert an item
    testDetails.data.items.splice(index, 0, copied);
  },

  reset() {
    testDetails.data = { name: '', description: '', items: [], settings: {} };
    testDetails.error = undefined;
  },
});

deepObserve(testDetails, (_, path) => {
  if (path.startsWith('data')) testDetails.isChanged = true;
});

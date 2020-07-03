import {TestItemModel} from "./TestItemModel";

export interface BasicTestModel {
  _id?: { $oid: string };
  userId?: number;
  name: string;
  description: string;
  createdAt?: { $date: Date };
  modifiedAt?: { $date: Date };
  // This is the field show how many responses this test have
  responses?: [];

  items: TestItemModel[];
}

import {MessageModel} from "./MessageModel";

export class UserModel {
  _id: { $oid: string };
  name: string;
  email: string;
  password?: string;
  activated?: boolean;
  policy?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
  messages?: MessageModel[];
  // Privacy statement
  privacyStatement?: boolean;
  // The number which is allocated for current user. Default storage limit is 524_288_000
  storageAllocated?: number
}

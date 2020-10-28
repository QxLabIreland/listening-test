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
}

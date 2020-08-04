export class UserModel {
  _id: { $oid: string };
  name: string;
  email: string;
  password?: string;
  policy?: boolean;
  isAdmin?: boolean;
  permissions?: string[];
}

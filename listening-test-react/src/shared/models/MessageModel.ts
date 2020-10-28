export interface MessageModel {
  _id: { $oid: string };
  unRead: boolean;
  // With markdown syntax, like link
  content: string;
  createdAt: { $date: Date };
}

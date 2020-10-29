export interface MessageModel {
  id: string;
  unRead: boolean;
  // With markdown syntax, like link
  content: string;
  createdAt: { $date: Date };
}

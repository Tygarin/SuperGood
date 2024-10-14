export interface CreateMessageModel {
  chatID: string;
  text: string;
}

export interface MessageModel extends CreateMessageModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
  senderID: string;
}

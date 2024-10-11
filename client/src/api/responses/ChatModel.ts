export interface CreateChatModel {
  members: string[];
  name: string;
}

export interface ChatModel extends CreateChatModel {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

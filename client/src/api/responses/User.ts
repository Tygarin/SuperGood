export interface CreateUserModel {
  name: string;
  userIdentify: string;
  password: string;
  role: string;
}

export interface UserModel extends Omit<CreateUserModel, "role"> {
  _id: string;
  roles: string[];
}

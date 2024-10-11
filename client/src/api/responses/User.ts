export interface CreateUserModel {
  name: string;
  userIdentify: string;
  password: string;
  roles: string[];
}

export interface UserModel extends CreateUserModel {
  _id: string;
}

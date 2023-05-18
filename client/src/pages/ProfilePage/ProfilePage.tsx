import { useUsersList } from "libs";
import { FC } from "react";
import { useParams } from "react-router-dom";

export const ProfilePage: FC = () => {
  const { userID } = useParams();
  const { users } = useUsersList();
  const currentUser = users?.find(
    ({ userIdentify }) => userID === userIdentify
  );

  if (!currentUser)
    return <div className="text-center">Пользователь не найден</div>;
  return <div>{currentUser.userIdentify}</div>;
};

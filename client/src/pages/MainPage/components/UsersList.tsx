import { Button } from "components";
import { Roles } from "constant";
import { useCurrentUser, useUsersList } from "libs";
import { FC, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const UsersLoader: FC = () => {
  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <Spinner animation="grow" />
    </div>
  );
};

export const UsersList: FC = () => {
  return (
    <div className="w-[250px] flex justify-center flex-col border-l border-solid mt-4 ml-auto pl-2">
      <p className="text-center">Список сотрудников:</p>
      <Suspense fallback={<UsersLoader />}>
        <UsersComponent />
      </Suspense>
    </div>
  );
};

const UsersComponent: FC = () => {
  const { users } = useUsersList();
  const { userInfo } = useCurrentUser();
  const isAdmin = userInfo?.roles.includes(Roles.admin);
  return (
    <>
      <div className="h-[300px] flex flex-col gap-2 overflow-auto">
        {users?.map(({ userIdentify }) => (
          <Link to={`/profiles/${userIdentify}`}>{userIdentify}</Link>
        ))}
      </div>
      {isAdmin && <Button>Создать пользователя</Button>}
    </>
  );
};

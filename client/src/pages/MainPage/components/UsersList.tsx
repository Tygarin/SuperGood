import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "components";
import { useIsAdmin, useUsersList } from "libs";
import { FC, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

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
  const isAdmin = useIsAdmin();
  const [, setSearchParams] = useSearchParams();
  const openCreateUserModal = () => {
    setSearchParams({ modal: "createUser" });
  };

  return (
    <>
      <div className="h-[300px] flex flex-col gap-2 overflow-auto">
        {users?.map(({ userIdentify }) => (
          <div className="flex justify-between pr-2" key={userIdentify}>
            <Link className="no-underline" to={`/profiles/${userIdentify}`}>
              {userIdentify}{" "}
            </Link>
            {isAdmin ? (
              <button>
                <FontAwesomeIcon color="#9b2d30" icon={faTrashCan} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {isAdmin && (
        <Button onClick={openCreateUserModal}>Создать пользователя</Button>
      )}
    </>
  );
};

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApi } from "api";
import { UserModel } from "api/responses";
import { Button } from "components";
import { useIsAdmin, useUsersList } from "libs";
import { FC, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirmationStore } from "stores";

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
        {users?.map((user) => (
          <div className="flex justify-between pr-2" key={user._id}>
            <Link
              className="no-underline"
              to={`/profiles/${user._id}`}
            >
              {user.name}{" "}
            </Link>
            <DeleteButton user={user} />
          </div>
        ))}
      </div>
      {isAdmin && (
        <Button onClick={openCreateUserModal}>Создать пользователя</Button>
      )}
    </>
  );
};

const DeleteButton: FC<{ user: UserModel }> = ({ user }) => {
  const isAdmin = useIsAdmin();
  const { confirm } = useConfirmationStore();
  const queryClient = useQueryClient();
  const { deleteUser } = useApi();
  const { mutateAsync } = useMutation({
    mutationFn: deleteUser,
    mutationKey: ["deleteUser", user._id],
    onSuccess: () => {
      queryClient.setQueriesData<UserModel[]>("usersList", (_previousData) => {
        const previousData = _previousData ?? [];
        return previousData.filter((_user) => _user._id !== user._id);
      });
      toast.success("Пользователь успешно удален!");
    },
  });

  if (isAdmin)
    return (
      <button
        onClick={() =>
          confirm({
            actionButtonText: "Удалить",
            description: `Вы уверены, что хотите удалить пользователя ${user.name}?`,
            onSubmit: async () => await mutateAsync(user._id),
            title: `Удаление пользователя ${user.name}`,
          })
        }
      >
        <FontAwesomeIcon color="#9b2d30" icon={faTrashCan} />
      </button>
    );
  return null;
};

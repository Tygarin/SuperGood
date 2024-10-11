import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApi } from "api";
import { ChatModel } from "api/responses";
import { Button, PageLayout } from "components";
import dayjs from "dayjs";
import { useIsAdmin } from "libs";
import { CreateChatModal } from "modals";
import { FC, PropsWithChildren } from "react";
import { Table } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const ChatsPage: FC = () => {
  const { getChats } = useApi();
  const { data } = useQuery({
    queryKey: ["getChats"],
    queryFn: getChats,
  });
  const isAdmin = useIsAdmin();

  return (
    <PageLayout
      addButton={{ title: "Создать чат", modalKey: "createChat" }}
      title="Чаты"
    >
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">Название</th>
            <th className="text-center">Дата создания</th>
            <th />
            {isAdmin ? <th /> : null}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            <>
              {data?.map(({ name, _id, createdAt }) => (
                <tr key={_id}>
                  <Td>{name}</Td>
                  <Td>{dayjs(createdAt).format("DD.MM.YYYY HH:mm")}</Td>
                  <Td>
                    <Link to={_id}>Открыть</Link>
                  </Td>
                  {isAdmin ? (
                    <Td>
                      <DeleteButton id={_id} />
                    </Td>
                  ) : null}
                </tr>
              ))}
            </>
          ) : (
            <EmptyTable />
          )}
        </tbody>
      </Table>
      <CreateChatModal />
    </PageLayout>
  );
};

const EmptyTable: FC = () => {
  return (
    <tr>
      <td colSpan={"100%" as unknown as number}>
        <div className="py-8 gap-3 text-center grid justify-center items-center">
          <div>
            <FontAwesomeIcon fontSize={40} icon={faMagnifyingGlass} />
          </div>
          Чатов совсем нет...
        </div>
      </td>
    </tr>
  );
};

const DeleteButton: FC<{ id: string }> = ({ id }) => {
  const { deleteChat } = useApi();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: deleteChat,
    mutationKey: ["deleteChat", id],
    onSuccess: (deletedChat) => {
      queryClient.setQueriesData<ChatModel[]>("getChats", (_previousData) => {
        const previousData = _previousData ?? [];
        return previousData.filter((chat) => chat._id !== deletedChat._id);
      });
      toast.success("Чат успешно удален!");
    },
  });
  return (
    <Button
      onClick={() => mutateAsync(id)}
      isLoading={isLoading}
      variant="danger"
    >
      Удалить
    </Button>
  );
};

const Td: FC<PropsWithChildren> = ({ children }) => (
  <td className="align-middle text-center">{children}</td>
);

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApi } from "api";
import { ChatModel } from "api/responses";
import { Button, PageLayout } from "components";
import dayjs from "dayjs";
import { useChats, useNotifications } from "libs";
import { CreateChatModal } from "modals";
import { FC, PropsWithChildren } from "react";
import { Table } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const ChatsPage: FC = () => {
  const { chats } = useChats();
  useNotifications();
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
            <th />
          </tr>
        </thead>
        <tbody>
          {chats.length ? (
            <>
              {chats?.map(({ name, _id, createdAt }) => (
                <tr key={_id}>
                  <Td>{name}</Td>
                  <Td>{dayjs(createdAt).format("DD.MM.YYYY HH:mm")}</Td>
                  <Td>
                    <Link to={_id}>Открыть</Link>
                  </Td>
                  <Td>
                    <DeleteButton id={_id} />
                  </Td>
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
  const { chatApi } = useApi();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: chatApi.deleteChat,
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

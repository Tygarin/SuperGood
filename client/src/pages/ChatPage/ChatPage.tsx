import { useApi } from "api";
import { ChatModel, MessageModel } from "api/responses";
import { Button, PageLayout } from "components";
import dayjs from "dayjs";
import { getErrorMessage, useCurrentUser, useUsersList } from "libs";
import { FC, useState } from "react";
import { Form } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isNonNullish } from "remeda";

export const ChatPage: FC = () => {
  const { chatID } = useParams();
  const { chatApi, messagesApi } = useApi();
  const { userInfo } = useCurrentUser();
  const { usersMap } = useUsersList();
  const [messageText, setMessageText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: currentChat } = useQuery({
    queryFn: () => chatApi.getChatByID(`${chatID}`),
    queryKey: ["chat", chatID],
  });

  const { data } = useQuery({
    queryFn: () => messagesApi.getMessages(`${chatID}`),
    queryKey: ["getMessages", chatID],
  });

  const queryClient = useQueryClient();

  const { mutateAsync: createMessage } = useMutation({
    mutationFn: messagesApi.createMessage,
    mutationKey: ["createMessage"],
    onSuccess: (message) => {
      queryClient.setQueriesData<MessageModel[]>(
        { queryKey: ["getMessages", chatID] },
        (previousData) => {
          return [...(previousData ?? []), message];
        }
      );
    },
  });

  const messages = data ?? [];

  if (!currentChat) return <Navigate to="/chatsPage" />;
  return (
    <PageLayout title={currentChat.name}>
      <section className="flex">
        <div className="h-[800px] flex-1 flex flex-col">
          <div className="flex-1 gap-2 flex flex-col-reverse py-2 overflow-auto pr-1">
            {messages
              .sort((a, b) => {
                return dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? -1 : 1;
              })
              .map(({ senderID, text, createdAt }) => {
                const user = usersMap.get(senderID);
                const isMyself = senderID === userInfo?._id;
                return (
                  <div
                    key={`${senderID}-${text}`}
                    className={`flex gap-3 items-center ${
                      isMyself ? "justify-end" : ""
                    }`}
                  >
                    <div
                      className={`${
                        isMyself ? "bg-blue-400" : "bg-teal-400"
                      } text-white p-2`}
                    >
                      {user?.name && (
                        <p className="m-0 text-[12px]">{user.name}</p>
                      )}
                      <div className="flex justify-between items-end gap-5">
                        <p className="m-0">{text}</p>
                        <p className="m-0 text-[12px]">
                          {dayjs(createdAt).format("DD.MM.YYYY HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setIsLoading(true);
              try {
                if (isNonNullish(chatID)) {
                  await createMessage({ chatID, text: messageText });
                  setMessageText("");
                }
              } catch (error) {
                toast.error(getErrorMessage(error));
              } finally {
                setIsLoading(false);
              }
            }}
            className="flex gap-3"
          >
            <Form.Control
              type="text"
              placeholder="Введите текст сообщения"
              className="flex-1"
              onChange={(event) => setMessageText(event.target.value)}
              value={messageText}
            />
            <Button isLoading={isLoading} type="submit">
              Отправить
            </Button>
          </form>
        </div>
        <div className="w-[20%]">
          <p>Список сотрудников в чате:</p>
          <UserList members={currentChat.members} />
        </div>
      </section>
    </PageLayout>
  );
};

const UserList: FC<{ members: ChatModel["members"] }> = ({ members }) => {
  const { usersMap } = useUsersList();
  return (
    <ul className="pl-0">
      {members.map((memberID) => {
        const user = usersMap.get(memberID);
        return <li key={memberID}>{user?.name}</li>;
      })}
    </ul>
  );
};

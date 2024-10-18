import { useApi } from "api";
import { MessageModel } from "api/responses";
import { PageLayout } from "components";
import { useSocketContext } from "context";
import { FC, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Navigate, useParams } from "react-router-dom";
import { UserList } from "./UserList";
import { Message } from "./Message";
import { useCurrentChat } from "./libs";
import { CreateUserForm } from "./CreateUserForm";

export const ChatPage: FC = () => {
  const { chatID } = useParams();
  const { messagesApi } = useApi();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement | null>(null);
  const currentChat = useCurrentChat();

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      queryClient.setQueriesData<MessageModel[]>(
        { queryKey: ["getMessages", chatID] },
        (_previousData) => {
          const previousData = _previousData ?? [];
          if (previousData.some((element) => element._id === data._id)) {
            return previousData;
          }
          return [...previousData, data];
        }
      );
    });

    return () => {
      socket?.off("getMessage");
    };
  }, [chatID, queryClient, socket]);

  const { data: messages } = useQuery({
    queryFn: () => messagesApi.getMessages(`${chatID}`),
    queryKey: ["getMessages", chatID],
  });

  if (!currentChat) return <Navigate to="/chatsPage" />;

  return (
    <PageLayout title={currentChat.name}>
      <section className="flex">
        <div className="h-[800px] flex-1 flex flex-col">
          <div
            ref={ref}
            className="flex-1 gap-2 flex  flex-col py-2 overflow-auto pr-1"
          >
            {(messages ?? []).map((message) => (
              <Message key={message._id} {...message} />
            ))}
          </div>
          <CreateUserForm />
        </div>
        <div className="w-[20%]">
          <p>Список сотрудников в чате:</p>
          <UserList members={currentChat.members} />
        </div>
      </section>
    </PageLayout>
  );
};

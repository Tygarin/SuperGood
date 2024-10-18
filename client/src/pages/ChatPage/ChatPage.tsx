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
import { ActiveMessagesActions } from "./ActiveMessagesActions";

export const ChatPage: FC = () => {
  const { chatID } = useParams();
  const { messagesApi } = useApi();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const currentChat = useCurrentChat();

  const updateScroll = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

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
      setTimeout(updateScroll, 1);
    });

    socket?.on("getDeletedMessages", (messageIDs) => {
      queryClient.setQueriesData<MessageModel[]>(
        { queryKey: ["getMessages", chatID] },
        (_previousData) => {
          const previousData = _previousData ?? [];
          return previousData.filter((oldMessage) =>
            !messageIDs.includes(oldMessage._id)
          );
        }
      );
    });

    return () => {
      socket?.off("getMessage");
      socket?.off("getDeletedMessages");
    };
  }, [chatID, queryClient, socket, messageContainerRef]);

  const { data: messages } = useQuery({
    queryFn: () => messagesApi.getMessages(`${chatID}`),
    queryKey: ["getMessages", chatID],
    refetchOnMount: "always",
  });

  useEffect(() => {
    updateScroll();
  }, []);

  if (!currentChat) return <Navigate to="/chatsPage" />;

  return (
    <PageLayout title={currentChat.name}>
      <section className="flex">
        <div className="h-[83vh] flex-1 flex flex-col">
          <div
            ref={messageContainerRef}
            style={{ scrollbarWidth: "thin" }}
            className="flex-1 gap-2 flex  flex-col py-2 overflow-auto pr-1"
          >
            <ActiveMessagesActions />
            {(messages ?? []).map((message) => (
              <Message key={message._id} {...message} />
            ))}
          </div>
          <CreateUserForm messageContainerRef={messageContainerRef} />
        </div>
        <div className="w-[20%] pl-4">
          <p>Список сотрудников в чате:</p>
          <UserList members={currentChat.members} />
        </div>
      </section>
    </PageLayout>
  );
};

import { FC } from "react";
import { useCurrentChat, useMessagesStore } from "./libs";
import { Button } from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getPlural } from "libs";
import { useMutation, useQueryClient } from "react-query";
import { useApi } from "api";
import { MessageModel } from "api/responses";
import { useConfirmationStore } from "stores";
import { useSocketContext } from "context";

export const ActiveMessagesActions: FC = () => {
  const { activeMessages, clearMessages } = useMessagesStore();
  const { messagesApi } = useApi();
  const queryClient = useQueryClient();
  const { confirm } = useConfirmationStore();
  const { socket } = useSocketContext();
  const currentChat = useCurrentChat();

  const activeMessagesList = Array.from(activeMessages);

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ["deleteMessages", activeMessagesList],
    mutationFn: messagesApi.deleteMessages,
    onSuccess: () => {
      socket?.emit(
        "sendDeletedMessages",
        activeMessagesList,
        currentChat?.members ?? []
      );
      queryClient.setQueriesData<MessageModel[]>(
        { queryKey: ["getMessages", currentChat?._id] },
        (_previousData) => {
          const previousData = _previousData ?? [];
          return previousData.filter(
            (oldMessage) => !activeMessages.has(oldMessage._id)
          );
        }
      );
      clearMessages();
    },
  });

  if (activeMessages.size === 0) return null;

  const pluralValue = getPlural(
    activeMessages.size,
    "сообщение",
    "сообщения",
    "сообщений"
  );

  return (
    <div className="flex py-1 justify-center items-center gap-3 sticky top-[-0.5rem] bg-white">
      Выбрано: {activeMessages.size} {pluralValue}
      <Button
        onClick={() => {
          confirm({
            actionButtonText: "Удалить",
            description: `Вы уверены, что хотите удалить ${activeMessages.size} ${pluralValue}?`,
            onSubmit: async () => mutateAsync(activeMessagesList),
            title: `Удаление сообщений`,
          });
        }}
        isLoading={isLoading}
        size="sm"
        variant="danger"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </Button>
      <Button onClick={clearMessages} size="sm">
        Отмена
      </Button>
    </div>
  );
};

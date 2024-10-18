import { useApi } from "api";
import { MessageModel } from "api/responses";
import { useSocketContext } from "context";
import { getErrorMessage } from "libs";
import { FC, useState } from "react";
import { Form } from "react-bootstrap";
import { useQueryClient, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isNonNullish } from "remeda";
import { useCurrentChat } from "./libs";
import { Button } from "components";

export const CreateUserForm: FC = () => {
  const { chatID } = useParams();
  const { messagesApi } = useApi();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const currentChat = useCurrentChat();

  const [messageText, setMessageText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync: createMessage } = useMutation({
    mutationFn: messagesApi.createMessage,
    mutationKey: ["createMessage"],
    onSuccess: (data) => {
      socket?.emit("sendMessage", data, currentChat?.members ?? []);
      queryClient.setQueriesData<MessageModel[]>(
        { queryKey: ["getMessages", chatID] },
        (_previousData) => {
          const previousData = _previousData ?? [];
          return [...previousData, data];
        }
      );
    },
  });

  return (
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
  );
};

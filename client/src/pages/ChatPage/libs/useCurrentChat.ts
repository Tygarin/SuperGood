import { useApi } from "api";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const useCurrentChat = () => {
  const { chatApi } = useApi();
  const { chatID } = useParams();
  const { data: currentChat } = useQuery({
    queryFn: () => chatApi.getChatByID(`${chatID}`),
    queryKey: ["chat", chatID],
  });

  return currentChat;
};

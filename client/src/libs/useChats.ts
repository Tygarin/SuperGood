import { useApi } from "api";
import { useMemo } from "react";
import { useQuery } from "react-query";

export const useChats = () => {
  const { chatApi } = useApi();

  const { data } = useQuery({
    queryKey: ["getChats"],
    queryFn: chatApi.getChats,
  });

  return useMemo(() => {
    const chats = data ?? [];
    const chatsMap = new Map(chats.map((chat) => [chat._id, chat]));

    return { chats, chatsMap };
  }, [data]);
};

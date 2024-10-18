import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_URL } from "api";
import { useChats, useCurrentUser, useUsersList } from "libs";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

interface OnlineUser {
  userID: string;
  socketID: string;
}

interface SocketContextInterface {
  socket: Socket | undefined;
  onlineUsers: OnlineUser[];
}

const SocketContext = createContext<SocketContextInterface>({
  socket: undefined,
  onlineUsers: [],
});

const SocketContextProvider = SocketContext.Provider;

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] =
    useState<SocketContextInterface["socket"]>(undefined);
  const [onlineUsers, setOnlineUsers] = useState<
    SocketContextInterface["onlineUsers"]
  >([]);
  const { userInfo } = useCurrentUser();
  const { usersMap } = useUsersList();
  const { chatsMap } = useChats();
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.emit("addNewUser", userInfo?._id);
    socket?.on("getOnlineUsers", (onlineUsers) => {
      setOnlineUsers(onlineUsers ?? []);
    });

    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [socket, userInfo?._id]);

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      if (data.senderID !== userInfo?._id) {
        const chatName = chatsMap.get(data.chatID)?.name;
        const userName = usersMap.get(data.senderID)?.name;
        const audio = new Audio(require("../sounds/Notification.mp3"));
        if (chatName && userName) {
          audio.play();
          toast(
            <div>
              <strong>{userName}:</strong>
              <div>
                <i>- {data.text}</i>
              </div>
              <strong>
                <FontAwesomeIcon icon={faComments} /> {chatName}
              </strong>
            </div>,
            { onClick: () => navigate(`chatsPage/${data.chatID}`) }
          );
        }
      }
    });
    return () => {
      socket?.off("getMessage");
    };
  }, [chatsMap, navigate, socket, userInfo?._id, usersMap]);

  return (
    <SocketContextProvider value={{ socket, onlineUsers }}>
      {children}
    </SocketContextProvider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

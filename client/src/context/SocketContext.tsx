import { BASE_URL } from "api";
import { useCurrentUser } from "libs";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
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

  return (
    <SocketContextProvider value={{ socket, onlineUsers }}>
      {children}
    </SocketContextProvider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

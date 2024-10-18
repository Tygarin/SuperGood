import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSocketContext } from "context";
import { useUsersList, useChats, useCurrentUser } from "libs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useNotifications = () => {
  const { usersMap } = useUsersList();
  const { chatsMap } = useChats();
  const { socket } = useSocketContext();
  const { userInfo } = useCurrentUser();

  const navigate = useNavigate();

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
};

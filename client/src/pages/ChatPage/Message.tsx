import { MessageModel } from "api/responses";
import dayjs from "dayjs";
import { useCurrentUser, useUsersList } from "libs";
import { FC } from "react";
import { useMessagesStore } from "./libs";

export const Message: FC<MessageModel> = ({
  senderID,
  text,
  createdAt,
  _id,
}) => {
  const { userInfo } = useCurrentUser();
  const { usersMap } = useUsersList();
  const { toggleActiveMessage, activeMessages } = useMessagesStore();

  const user = usersMap.get(senderID);
  const isMyself = senderID === userInfo?._id;
  const hoverColor = isMyself ? "bg-blue-200" : "bg-teal-200";
  const messageColor = isMyself ? "bg-blue-400" : "bg-teal-400";
  const isChecked = activeMessages.has(_id);

  return (
    <button
      onClick={() => toggleActiveMessage(_id)}
      key={`${senderID}-${text}`}
      className={`flex ${
        isChecked ? hoverColor : ""
      } hover:${hoverColor} gap-3 items-center ${
        isMyself ? "justify-end" : ""
      }`}
    >
      <div className={`${messageColor} text-start text-white p-2`}>
        {user?.name && <p className="m-0 text-[12px]">{user.name}</p>}
        <div className="flex  justify-between items-end gap-5">
          <p className="m-0">{text}</p>
          <p className="m-0 text-[12px]">
            {dayjs(createdAt).format("DD.MM.YYYY HH:mm")}
          </p>
        </div>
      </div>
    </button>
  );
};

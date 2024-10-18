import { MessageModel } from "api/responses";
import dayjs from "dayjs";
import { useCurrentUser, useUsersList } from "libs";
import { FC } from "react";

export const Message: FC<MessageModel> = ({ senderID, text, createdAt }) => {
  const { userInfo } = useCurrentUser();
  const { usersMap } = useUsersList();

  const user = usersMap.get(senderID);
  const isMyself = senderID === userInfo?._id;
  return (
    <div
      key={`${senderID}-${text}`}
      className={`flex gap-3 items-center ${isMyself ? "justify-end" : ""}`}
    >
      <div
        className={`${isMyself ? "bg-blue-400" : "bg-teal-400"} text-white p-2`}
      >
        {user?.name && <p className="m-0 text-[12px]">{user.name}</p>}
        <div className="flex justify-between items-end gap-5">
          <p className="m-0">{text}</p>
          <p className="m-0 text-[12px]">
            {dayjs(createdAt).format("DD.MM.YYYY HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

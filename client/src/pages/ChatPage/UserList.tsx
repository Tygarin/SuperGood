import { ChatModel } from "api/responses";
import { useSocketContext } from "context";
import { useUsersList } from "libs";
import { FC } from "react";
import { Badge } from "react-bootstrap";

export const UserList: FC<{ members: ChatModel["members"] }> = ({
  members,
}) => {
  const { usersMap } = useUsersList();
  const { onlineUsers } = useSocketContext();
  const onlineUsersSet = new Set(onlineUsers.map((user) => user.userID));
  return (
    <ul className="pl-0">
      {members.map((memberID) => {
        const user = usersMap.get(memberID);
        return (
          <li key={memberID}>
            {user?.name}{" "}
            {user?._id && onlineUsersSet.has(user?._id) ? (
              <Badge>online</Badge>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

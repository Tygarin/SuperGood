import { useApi } from "api";
import { useAuthContext } from "context";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useCurrentUser } from "./useCurrentUser";

export function useUsersList(otherUsers?: boolean) {
  const { userInfo } = useCurrentUser();
  const { token } = useAuthContext();
  const { authApi } = useApi();
  const { data, ...rest } = useQuery({
    queryKey: ["usersList", token],
    queryFn: authApi.getUsers,
  });

  const [users, usersMap] = useMemo(() => {
    const _users = data ?? [];
    const users = otherUsers
      ? _users.filter((user) => user.userIdentify !== userInfo?.userIdentify)
      : _users;
    return [users, new Map(users.map((user) => [user.userIdentify, user]))];
  }, [data, otherUsers, userInfo?.userIdentify]);

  return { users, usersMap, ...rest };
}

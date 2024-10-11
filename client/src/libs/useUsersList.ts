import { useApi } from "api";
import { useAuthContext } from "context";
import { useMemo } from "react";
import { useQuery } from "react-query";

export function useUsersList() {
  const { token } = useAuthContext();
  const { getUsers } = useApi();
  const { data, ...rest } = useQuery({
    queryKey: ["usersList", token],
    queryFn: getUsers,
  });
  const [users, usersMap] = useMemo(() => {
    const users = data ?? [];
    return [users, new Map(users.map((user) => [user.userIdentify, user]))];
  }, [data]);
  return { users, usersMap, ...rest };
}

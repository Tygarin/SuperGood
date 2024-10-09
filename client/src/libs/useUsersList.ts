import { useApi } from "api";
import { useAuthContext } from "context";
import { useQuery } from "react-query";

export function useUsersList() {
  const { token } = useAuthContext();
  const { getUsers } = useApi();
  const { data, ...rest } = useQuery({
    queryKey: ["usersList", token],
    queryFn: getUsers,
  });
  return { users: data, ...rest };
}

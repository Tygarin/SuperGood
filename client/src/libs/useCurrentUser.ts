import { getCurrentUser } from "api";
import { useAuthContext } from "context";
import { useQuery } from "react-query";

export function useCurrentUser() {
  const { token } = useAuthContext();
  const { data, ...rest } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: getCurrentUser,
  });
  return { userInfo: data, ...rest };
}

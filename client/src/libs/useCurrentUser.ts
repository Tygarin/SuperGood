import { useApi } from "api";
import { useAuthContext } from "context";
import { useQuery } from "react-query";

export function useCurrentUser() {
  const { token } = useAuthContext();
  const { authApi } = useApi();
  const { data, ...rest } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: authApi.getCurrentUser,
  });
  return { userInfo: data, ...rest };
}

import { getCurrentUser } from "api";
import { useQuery } from "react-query";

export function useCurrentUser() {
  const { data, ...rest } = useQuery({
    queryKey: "currentUser",
    queryFn: getCurrentUser,
  });
  return { userInfo: data, ...rest };
}

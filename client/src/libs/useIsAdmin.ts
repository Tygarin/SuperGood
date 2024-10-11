import { Roles } from "constant";
import { useCurrentUser } from "./useCurrentUser";

export const useIsAdmin = () => {
  const { userInfo } = useCurrentUser();
  return userInfo?.roles.includes(Roles.admin);
};

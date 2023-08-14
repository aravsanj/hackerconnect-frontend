import { useContext } from "react";
import UserContext, { UserContextType } from "../contexts/userContext";

function useUser() {
  return useContext<UserContextType>(UserContext);
}

export default useUser;

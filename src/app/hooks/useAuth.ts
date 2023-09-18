import { useContext } from "react";
import AuthContext, { AuthContextType } from "../contexts/AuthContext";

function useAuth() {
  return useContext<AuthContextType>(AuthContext);
}

export default useAuth;
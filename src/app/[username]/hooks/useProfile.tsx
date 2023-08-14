import { useContext } from "react";
import ProfileContext from "../contexts/profileContext";

function useProfile() {
  return useContext(ProfileContext);
}

export default useProfile;

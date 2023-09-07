"use client";

import { useEffect, useState } from "react";
import ProfileContext, { profile } from "../contexts/profileContext";
import axios from "axios";
import { usePathname } from "next/navigation";
import { BASE_URL } from "../../config";

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<profile>();
  const [posts, setPosts] = useState();
  const [connectionStatus, setConnectionStatus] = useState<string>();
  const [hasReceivedFirstResponse, setHasReceivedFirstResponse] =
    useState(false);

  const pathname = usePathname();

  async function getProfile() {
    try {
      const response = await axios.get(`${BASE_URL}/user/${pathname}`, {
        withCredentials: true,
      });

      setConnectionStatus(response.data.connectionStatus);
      setProfile(response.data.user);
      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
    setHasReceivedFirstResponse(true);
  }

  const refetch = () => getProfile();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        refetch,
        posts,
        hasReceivedFirstResponse,
        connectionStatus,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;

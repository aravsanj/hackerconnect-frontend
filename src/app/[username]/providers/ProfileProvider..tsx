"use client";

import { useEffect, useState } from "react";
import ProfileContext, { profile } from "../contexts/profileContext";
import axios from "axios";
import { usePathname } from "next/navigation";
import { BASE_URL } from "../../config";


function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<profile>();
  const [posts, setPosts] = useState();

  const pathname = usePathname();

  async function getProfile() {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/${pathname}`,
        {
          withCredentials: true,
        }
      );

      setProfile(response.data.user);
      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  }

  const refetch = () => getProfile();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refetch, posts }}>
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;

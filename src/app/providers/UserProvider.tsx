"use client";

import { useEffect, useState } from "react";
import UserContext, { User } from "../contexts/userContext";
import axios from "axios";
import { BASE_URL } from "../config";

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    _id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    profile: "",
    isLoggedIn: null,
    hasReceivedFirstResponse: false,
  });

  async function getUserData() {
    try {
      const response = await axios.get(`${BASE_URL}/user/getUser`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUser({ ...response.data.user, isLoggedIn: true, hasReceivedFirstResponse: true });
    } catch (error) {
      setUser({ isLoggedIn: false, hasReceivedFirstResponse: true } as User);
      console.error(error);
    }
  }

  const refetch = () => getUserData();

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refetch }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

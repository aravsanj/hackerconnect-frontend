"use client";

import { useEffect, useState } from "react";
import UserContext, { User } from "../contexts/userContext";
import axios from "axios";
import { BASE_URL } from "../config";
import { socket } from "../socket.config";

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    _id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    profile: "",
    title: "",
    cover: "",
    isLoggedIn: null,
    connections: [],
    hasReceivedFirstResponse: false,
    chatInfo: [],
    groupInfo: [],
  });

  const [notifications, setNotifications] = useState([]);

  async function getUserData() {
    try {
      const response = await axios.get(`${BASE_URL}/user/getUser`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setUser({
        ...response.data.combinedData.user,
        chatInfo: response.data.combinedData.chatInfo,
        groupInfo: response.data.combinedData.groupChats,
        isLoggedIn: true,
        hasReceivedFirstResponse: true,
      });
    } catch (error) {
      setUser({ isLoggedIn: false, hasReceivedFirstResponse: true } as User);
      console.error(error);
    }
  }
  const refetch = () => getUserData();

  async function getNotifications() {
    try {
      const response = await axios.get(`${BASE_URL}/user/getNotifications`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  async function updateNotifications() {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/updateNotifications`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getNotifications();
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user?.isLoggedIn) {
      getNotifications();
      socket?.connect();
      socket?.emit("join", user?._id);
    }
  }, [user]);

  useEffect(() => {
    socket?.on("notification", () => {
      getNotifications();
    });
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refetch,
        notifications,
        updateNotifications,
        socket,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

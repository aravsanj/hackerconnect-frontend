"use client";

import { createContext } from "react";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  profile: string;
  cover: string;
  title: string;
  connections: Array<any>;
  isLoggedIn: boolean | null;
  hasReceivedFirstResponse: boolean;
  chatInfo: any;
  groupInfo: any;
};

type setUser = (user: User | null) => void;

type refetch = () => void;

export type UserContextType = {
  user: User | undefined | null;
  setUser: setUser;
  refetch: refetch;
  socket?: any;
  notifications: any[];
  updateNotifications: () => void;
  zegoInstance?: any
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export default UserContext;

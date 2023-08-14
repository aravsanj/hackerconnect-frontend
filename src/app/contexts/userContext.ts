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
  isLoggedIn: boolean | null;
  hasReceivedFirstResponse: boolean;
};

type setUser = (user: User) => void;

type refetch = () => void;

export type UserContextType = {
  user: User | undefined;
  setUser: setUser;
  refetch: refetch;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export default UserContext;

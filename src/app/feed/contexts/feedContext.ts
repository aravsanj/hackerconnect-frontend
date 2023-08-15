"use client";

import { createContext } from "react";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profile: string;
};

export type Post = {
  _id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export type FeedContextType = {
  posts: Post[] | undefined;
  refetch: () => void;
};

const FeedContext = createContext({} as FeedContextType);

export default FeedContext;

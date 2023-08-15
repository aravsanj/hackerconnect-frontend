"use client";

import { useEffect, useState } from "react";
import FeedContext, { Post } from "../contexts/feedContext";
import axios from "axios";
import { BASE_URL } from "../../config";

function FeedContextProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>();

  async function getPosts() {
    try {
      const response = await axios.get(`${BASE_URL}/post/getPosts`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  }

  const refetch = () => getPosts();

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <FeedContext.Provider value={{ posts, refetch }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedContextProvider;

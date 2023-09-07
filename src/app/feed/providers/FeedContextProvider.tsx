"use client";

import { useEffect, useState } from "react";
import FeedContext, { Post } from "../contexts/feedContext";
import axios from "axios";
import { BASE_URL } from "../../config";

function FeedContextProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>();
  const [page, setPage] = useState(1);

  async function getPosts() {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/getPosts`,
        { page },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (posts) {
        setPosts((posts: any) => [...posts, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const refetch = () => getPosts();

  const updatePosts = (post: any) => {
    setPosts((posts: any) => [post, ...posts]) 
  }

  useEffect(() => {
    getPosts();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      nextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FeedContext.Provider value={{ posts, refetch, updatePosts }}>
      {children}
    </FeedContext.Provider>
  );
}

export default FeedContextProvider;

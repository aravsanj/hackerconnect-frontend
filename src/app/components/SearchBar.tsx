import React, { useEffect, useState } from "react";
import { Input, Popover, List, Avatar, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "../config";
import PostSearchCard from "./PostSearchCard";
import Link from "next/link";

const { TabPane } = Tabs;

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [postResults, setPostResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [page, setPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);

  const controller = new AbortController();

  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/search`,
        {
          signal: controller.signal,
          searchText: searchQuery,
          page,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (searchResults.length !== 0) {
        setSearchResults((prev) => [...prev, ...response.data]);
      } else {
        setSearchResults(response.data);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const nextPagePost = () => {
    setPostsPage((prevPage) => prevPage + 1);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/search`,
        {
          signal: controller.signal,
          searchText: searchQuery,
          page: postsPage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if ([postResults].length !== 0) {
        setPostResults((prev) => [...prev, ...response.data]);
      } else {
        setPostResults(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = async (value: any) => {
    setSearchQuery(value);
    controller.abort();
    fetchUsers();
    fetchPosts();
  };

  useEffect(() => {
    if (page !== 1) fetchUsers();
  }, [page]);

  useEffect(() => {
    if (postsPage !== 1) fetchPosts();
  }, [postsPage]);

  const handleScroll = (event: any) => {
    const container = event.target;
    if (
      container.scrollHeight - container.scrollTop ==
      container.clientHeight
    ) {
      if (activeTab === "users") nextPage();

      if (activeTab === "posts") nextPagePost();
    }
  };

  useEffect(() => {
    const container = document.querySelector(".popover-content");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  });

  const handleTabChange = async (key: string) => {
    setActiveTab(key);
  };

  const userContent = (
    <List
      dataSource={searchResults}
      renderItem={(searchResult) => (
        <Link href={`/${searchResult?.username}`}>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={searchResult.profile} />}
              title={`${searchResult.firstName} ${searchResult.lastName}`}
              description={searchResult.title}
            />
          </List.Item>
        </Link>
      )}
    />
  );
  const postContent = (
    <List
      dataSource={postResults}
      renderItem={(postResult) => (
        <Link href={`/${postResult.user?.username}/post/${postResult?._id}`}>
          <List.Item>
            <PostSearchCard
              name={`${postResult.user.firstName} ${postResult.user.lastName}`}
              profile={postResult.user.profile}
              content={postResult.content}
            />
          </List.Item>
        </Link>
      )}
    />
  );

  const popoverContent = (
    <div
      className="ml-2 custom-scrollbar popover-content"
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Users" key="users">
          {userContent}
        </TabPane>
        <TabPane tab="Posts" key="posts">
          {postContent}
        </TabPane>
      </Tabs>
    </div>
  );

  return (
    <div>
      <Popover
        content={popoverContent}
        title="Search Results"
        trigger="click"
        open={searchQuery.length > 0}
        overlayStyle={{ width: "400px", height: "500px" }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          className="w-64"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </Popover>
    </div>
  );
};

export default SearchBar;

import React, { useState } from "react";
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

  const fetchUsers = async (value: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/search`,
        {
          searchText: searchQuery,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSearchResults(response.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const fetchPosts = async (value: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post/search`,
        {
          searchText: searchQuery,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setPostResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = async (value: any) => {
    setSearchQuery(value);
    fetchUsers(value);
    fetchPosts(value);
  };

  const handleTabChange = async (key: string) => {
    setActiveTab(key);
    if (key === "posts") {
    }
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
    <div className="ml-2">
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

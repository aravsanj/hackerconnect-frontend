import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "@/app/config";

const RecommendationList = () => {
  const [connections, setConnections] = useState<any[]>([]);

  const getRecommendations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getRecommendations`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setConnections(response.data)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getRecommendations();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4  mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Recommendations</h2>
      </div>
      <List
        dataSource={connections}
        locale={{
          emptyText: "Wow, such empty!",
        }}
        renderItem={(connection) => (
          <List.Item key={connection._id}>
            <List.Item.Meta
              avatar={<Avatar src={connection.profile} />}
              title={
                <Link href={`/${connection.username}`}>{connection.firstName} {connection.lastName}</Link>
              }
              // description={"Online"}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default RecommendationList;

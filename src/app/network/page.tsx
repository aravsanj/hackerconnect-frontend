"use client";
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import NetworkCard from "./components/NetworkCard"; // Provide the correct path to NetworkCard component
import axios from "axios";
import { BASE_URL } from "../config";
import useUser from "../hooks/useUser";


const NetworkPage = () => {
  const [connections, setConnections] = useState<any[]>();

  const { user } = useUser();
  const senderId = user?._id;

  const getConnections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getConnections`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setConnections(response.data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const refetch = () => getConnections();

  useEffect(() => {
    getConnections();
  }, []);

  if (connections) {
    return (
      <div className="p-8 min-h-screen">
          <h1 className="flex justify-center text-xl ">Your network</h1>
        <Row justify="center" gutter={[16, 16]}>
          {connections.map((connection) => (
            <Col key={connection._id}>
              <NetworkCard
                name={`${connection?.firstName} ${connection?.lastName}`}
                profile={connection.profile}
                cover={connection.cover}
                title={connection.title}
                senderId={senderId}
                receiverId={connection._id}
                refetch={refetch}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return <></>;
};

export default NetworkPage;

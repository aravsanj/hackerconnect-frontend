// @ts-nocheck
"use client";

import { BASE_URL } from "@/app/config";
import useUser from "@/app/hooks/useUser";
import { createZegoInstance } from "@/app/zego.config";
import {
  ZegoCloudRoomConfig,
  ZegoUIKitPrebuilt,
} from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import React, { useEffect } from "react";

type Props = {};

const LiveStream = (props: Props) => {
  const { user } = useUser();
  const userName = user?.username
  const roomName = "test" + userName;
  const connections  = user?.connections;
  const userId = user?._id

  const zegoInstance = createZegoInstance({
    userName: user?.username as string,
    userID: user?._id as string,
  });

  const sharedLinks: ZegoCloudRoomConfig["sharedLinks"] = [];
  const role = "Host";
  const myMeeting = async (element: ZegoCloudRoomConfig["container"]) => {
    zegoInstance.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role,
        },
      },
      showPreJoinView: false,
      sharedLinks,
      onLiveStart: async () => {
        try {
          const response = await axios.post(
            `${BASE_URL}/user/sendLiveRequests`,
            {
              roomName,
              connections,
              senderId: userId,
              userName: userName,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  useEffect(() => {
    myMeeting();
  }, []);

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}
    ></div>
  );
};

export default LiveStream;

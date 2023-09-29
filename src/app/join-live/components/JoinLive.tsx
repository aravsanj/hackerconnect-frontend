// @ts-nocheck
"use client";

import useUser from "@/app/hooks/useUser";
import { createZegoInstance } from "@/app/zego.config";
import {
  ZegoCloudRoomConfig,
  ZegoUIKitPrebuilt,
} from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const JoinLive = (props: Props) => {
  const { user } = useUser();
  const roomName = useSearchParams().get("roomName");

  const zegoInstance = createZegoInstance({
    userName: user?.username,
    userID: user?._id,
    roomName: roomName,
  });

  const sharedLinks: ZegoCloudRoomConfig["sharedLinks"] = [];
  const role = "Audience";
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
      //   onLiveStart: (user) => console.log("test"),
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

export default JoinLive;

// @ts-nocheck
"use client"

import useUser from "@/app/hooks/useUser";
import { createZegoInstance } from "@/app/zego.config";
import {
  ZegoCloudRoomConfig,
  ZegoUIKitPrebuilt,
} from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect } from "react";

type Props = {};

const LiveStream = (props: Props) => {
  const { user } = useUser();

  const zegoInstance = createZegoInstance({
    userName: user?.username as string,
    userID: user?._id as string,
  });

  let sharedLinks: ZegoCloudRoomConfig["sharedLinks"] = [];
  const role = "Host";
  let myMeeting = async (element: ZegoCloudRoomConfig["container"]) => {
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
      onLiveStart: (user) => console.log("test"),
     });
  };

  useEffect(() => {
    myMeeting()
  }, [])

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}
    ></div>
  );
};

export default LiveStream;

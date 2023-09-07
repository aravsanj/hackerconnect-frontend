"use client";

import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Button } from "antd";
import useUser from "@/app/hooks/useUser";

// Generate a Token by calling a method.
// @param 1: appID
// @param 2: serverSecret
// @param 3: Room ID
// @param 4: User ID
// @param 5: Username

const InviteBtn = () => {
  const { user } = useUser();

  const userID = user?._id as string;
  const userName = user?.username;
  const appID = 1162536625;
  const serverSecret = "05b287c9d279bc78eb811f30ca53946f";
  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    "test" + userName,
    userID,
    userName
  );


  const zp = ZegoUIKitPrebuilt.create(TOKEN);


  function invite() {
    const targetUser = {
      userID: "64ecb398a8f8a3874e146925",
      userName: "mayalawson82",
    };

    zp?.sendCallInvitation({
      callees: [targetUser],
      callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
      timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
    })
      .then((res) => {
        console.warn(res);
      })
      .catch((err) => {
        console.warn(err);
      });
  }


  return <Button onClick={invite}>Invite</Button>;
};

export default InviteBtn;

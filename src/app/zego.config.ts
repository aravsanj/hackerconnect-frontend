import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZEGO_APP_ID, ZEGO_SERVER_SECRET } from "./config";

interface ICreateZegoInstance {
  userName: string;
  userID: string;
  roomName?: string;
}

function generateKitTokenForTest({
  userName,
  userID,
  roomName  = "test" + userName
}: ICreateZegoInstance): string | null {
  if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
    return null;
  }

  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    parseInt(ZEGO_APP_ID),
    ZEGO_SERVER_SECRET,
    roomName,
    userID,
    userName
  );

  return TOKEN;
}

function createZegoInstance({ userName, userID, roomName }: ICreateZegoInstance) {
  const TOKEN: string | null = generateKitTokenForTest({ userName, userID, roomName });
  if (TOKEN) {
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zp?.addPlugins({ ZIM });
    console.log("Zego Instance created successfully")
    return zp;
  } else {
    throw new Error("failed to create Zego instance")
  }
}

export { createZegoInstance, generateKitTokenForTest};

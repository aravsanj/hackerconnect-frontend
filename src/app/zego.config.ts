import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZEGO_APP_ID, ZEGO_SERVER_SECRET } from "./config";

interface createZegoInstance {
  userName: string;
  userID: string;
}

function generateKitTokenForTest({
  userName,
  userID,
}: createZegoInstance): string | null {
  if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
    return null;
  }

  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    parseInt(ZEGO_APP_ID),
    ZEGO_SERVER_SECRET,
    "test" + userName,
    userID,
    userName
  );

  return TOKEN;
}

function createZegoInstance({ userName, userID }: createZegoInstance) {
  const TOKEN: string | null = generateKitTokenForTest({ userName, userID });
  if (TOKEN) {
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zp?.addPlugins({ ZIM });
    console.log("Zego Instance created successfully")
    return zp;
  } else {
    throw new Error("failed to create Zego instance")
  }
}

export { createZegoInstance};

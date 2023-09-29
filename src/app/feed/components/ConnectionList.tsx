import React, { useEffect, useState } from "react";
import { Avatar, Badge, List, Popconfirm } from "antd";
import useUser from "@/app/hooks/useUser";
import Link from "next/link";
import { MessageTwoTone, PhoneTwoTone } from "@ant-design/icons";
import ChatBox from "./ChatBox";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { createZegoInstance } from "@/app/zego.config";

type openConnection = {
  name: string;
  connectionId: string;
};

type sendCallInvitation = {
  userID: string;
  userName: string;
};

const ConnectionList = () => {
  const { user, socket, refetch } = useUser();
  const [openConnections, setOpenConnections] = useState<openConnection[]>([]);
  const [connection, setConnection] = useState<openConnection | null>();
  const [connections, setConnections] = useState([]);

  const zegoInstance = createZegoInstance({
    userName: user?.username as string,
    userID: user?._id as string,
  });

  const openChat = (userId: string, connectionId: string, name: string) => {
    setConnection({ name, connectionId });
  };

  const closeChat = (connectionId: string) => {
    setConnection(null);
  };

  function sendCallInvitation({ userID, userName }: sendCallInvitation) {
    const targetUser = {
      userID: userID,
      userName: userName,
    };

    zegoInstance
      ?.sendCallInvitation({
        callees: [targetUser],
        callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
        timeout: 60,
      })
      .then((res: any) => {
        console.warn(res);
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }

  useEffect(() => {
    const connections = user?.chatInfo.map((conn: any) => {
      const connection = conn.connection;
      return {
        _id: connection._id,
        name: `${connection.firstName} ${connection.lastName}`,
        username: connection.username,
        profile: connection.profile,
        hasUnreadMessages: conn.unreadMessages,
        isOnline: connection.isOnline,
      };
    });
    setConnections(connections);
  }, [user]);

  useEffect(() => {
    socket?.on(
      "message-received",
      (item: { identifier: string; senderId: string; name: string }) => {
        refetch();
      }
    );
    socket?.on("update-online-status", (users: any) => {
      console.log(users);
      setConnections((prevState) => {
        const updatedConnections = [...prevState];
    
        users.forEach((user: any) => {
          updatedConnections.forEach((conn: any) => {
            if (user._id === conn._id) {
              conn.isOnline = false;
              console.log("reached here");
            }
          });
        });
    
        return updatedConnections;
      });
    });
    return () => {
      socket?.off("message-received");
      socket?.off("update-online-status");
    };
  });

  return (
    <div className="bg-white rounded-xl p-4 mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Connections</h2>
      </div>
      <List
        dataSource={connections}
        locale={{
          emptyText: "Wow, such empty!",
        }}
        renderItem={(connection: any) => (
          <List.Item key={connection._id}>
            <List.Item.Meta
              avatar={<Avatar src={connection.profile} />}
              title={
                <>
                  <Link href={`/${connection.username}`}>
                    {connection.name}
                  </Link>
                  {!connection.hasUnreadMessages && (
                    <MessageTwoTone
                      onClick={() =>
                        openChat(
                          user?._id as string,
                          connection?._id,
                          connection?.name
                        )
                      }
                      className="ml-2"
                    />
                  )}
                  {connection.hasUnreadMessages && (
                    <Badge dot offset={[5, -2]}>
                      <MessageTwoTone
                        onClick={() =>
                          openChat(
                            user?._id as string,
                            connection?._id,
                            connection?.name
                          )
                        }
                        className="ml-2"
                      />
                    </Badge>
                  )}

                  <Popconfirm
                    title={`Calling ${connection.name}`}
                    description={`Are you sure?`}
                    onConfirm={() => {
                      sendCallInvitation({
                        userID: connection?._id,
                        userName: connection?.username,
                      });
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <PhoneTwoTone className="ml-2" />
                  </Popconfirm>
                  {connection.isOnline && (
                    <Badge
                      dot
                      className="text-2xl"
                      color="green"
                      offset={[5, -2]}
                    ></Badge>
                  )}
                </>
              }
            />
          </List.Item>
        )}
      />
      {connection && (
        <ChatBox
          key={connection.connectionId}
          senderId={user?._id as string}
          receiverId={connection.connectionId}
          name={connection.name}
          closeChat={closeChat}
          // index={index}
        />
      )}
    </div>
  );
};

export default ConnectionList;

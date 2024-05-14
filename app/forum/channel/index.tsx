import { View, Text } from "react-native";
import React from "react";
import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { useAppContext } from "@/context/chatContext";
import { useRouter } from "expo-router";

const ForumChannel = () => {
  const { channel, setThread } = useAppContext();
  const router = useRouter();

  return (
    <Channel channel={channel}>
      <MessageList
        onThreadSelect={(message) => {
          if (channel?.id) {
            setThread(message);
            router.push("/forum/thread/");
          }
        }}
      />
      <MessageInput />
    </Channel>
  );
};

export default ForumChannel;

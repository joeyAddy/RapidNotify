import React from "react";
import { Channel, Thread } from "stream-chat-expo";
import { useAppContext } from "@/context/chatContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const MessageThread = () => {
  const { channel, thread } = useAppContext();

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Channel channel={channel} thread={thread} threadList>
        <Thread />
      </Channel>
    </SafeAreaView>
  );
};

export default MessageThread;

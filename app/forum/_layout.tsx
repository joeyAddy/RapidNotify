import React from "react";
import { Chat } from "stream-chat-expo";
import { Stack } from "expo-router";
import { chatApiKey } from "@/chatConfig";
import { StreamChat } from "stream-chat";

const chatClient = StreamChat.getInstance(chatApiKey);

const _layout = () => {
  return (
    <Chat client={chatClient}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="channel/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="thread/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Chat>
  );
};

export default _layout;

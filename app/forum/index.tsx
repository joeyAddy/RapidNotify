import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageType,
  Thread,
} from "stream-chat-expo";
import { Sort, StreamChat, Channel as ChannelType } from "stream-chat";
import { useRouter } from "expo-router";
import { chatApiKey } from "@/chatConfig";
import { useAppContext } from "@/context/chatContext";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/user";

const chatClient = StreamChat.getInstance(chatApiKey);

const Forum = () => {
  const [clientIsReady, setClientIsReady] = useState(false);

  const [currentUser] = useAtom(currentUserAtom);

  const chatUserId = currentUser.uid;
  const chatUserName = currentUser.fullName;

  const router = useRouter();

  const { setChannel } = useAppContext();

  const user = {
    id: chatUserId,
    name: chatUserName,
  };

  const filters = {
    members: {
      $in: [chatUserId],
    },
  };

  const sort: Sort<unknown> = {
    last_message_at: -1,
  };

  useEffect(() => {
    const setupClient = async () => {
      try {
        console.log("seeting client");

        chatClient.connectUser(user, chatClient.devToken(chatUserId));
        setClientIsReady(true);

        const channel = chatClient.channel(
          "team",
          `${currentUser.location.city}_forum`,
          {
            name: `${currentUser.location.city} forum`,
            members: [chatUserId],
          }
        );

        await channel.watch();
        // connectUser is an async function. So you can choose to await for it or not depending on your use case (e.g. to show custom loading indicator)
        // But in case you need the chat to load from offline storage first then you should render chat components
        // immediately after calling `connectUser()`.
        // BUT ITS NECESSARY TO CALL connectUser FIRST IN ANY CASE.
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      } finally {
        console.log("done");
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID) {
      setupClient();
    }
  }, [chatClient.userID]);

  if (!clientIsReady && !chatClient.userID) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={40} color="orange" />
      </View>
    );
  }
  return (
    <View className="flex-1 px-4">
      <Text className="mt-3 mb-4 font-bold text-lg">
        Recommended based on location
      </Text>
      <ChannelList
        onSelect={(channel) => {
          setChannel(channel);
          router.push("/forum/channel/");
        }}
        filters={filters}
        sort={sort}
      />
    </View>
  );
};

export default Forum;

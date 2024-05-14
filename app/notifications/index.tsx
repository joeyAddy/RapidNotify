import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Notifications = () => {
  return (
    <View className="flex-1 bg-white px-4">
      <Pressable className="flex-row space-x-4 my-5 self-center">
        <AntDesign name="reload1" size={24} />
        <Text className="text-lg">Refresh</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-row space-x-4 p-4 ">
          <FontAwesome name="gear" size={40} color="blue" />
          <View className="space-y-2">
            <Text className="font-bold text-2xl">Account verification</Text>
            <Text className="text-lg font-thin leading-5">
              Your account has been verified successfully. Please proceed!
            </Text>
            <Text className="text-sm text-gray-600 font-bold">Just Now</Text>
          </View>
        </View>
        <View className="flex-row space-x-4 p-4 ">
          <FontAwesome name="refresh" size={40} />
          <View className="space-y-2">
            <Text className="font-bold text-2xl">App Update Available</Text>
            <Text className="text-lg font-thin leading-5">
              A new version of our app is now available! Update to the latest
              version to enjoy the following improvements:{" "}
            </Text>
            <Text className="text-sm text-gray-600 font-extrabold">
              5 minutes ago
            </Text>
          </View>
        </View>
        <View className="flex-row space-x-4 p-4 ">
          <MaterialCommunityIcons
            name="message-text-clock"
            size={40}
            color="green"
          />
          <View className="space-y-2">
            <Text className="font-bold text-2xl">Incident Response Update</Text>
            <Text className="text-lg font-thin leading-5">
              The incident reported earlier has been responded to and is now in
              the resolution process.{" "}
            </Text>
            <Text className="text-sm text-gray-600 font-bold">5-05-2024</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;

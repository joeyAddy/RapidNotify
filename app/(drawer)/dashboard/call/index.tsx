import { View, Text, ImageBackground, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Call = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("@assets/images/call.jpg")}
      className="flex-1 bg-black items-center"
      blurRadius={20}
    >
      <Text className="text-white italic text-lg text-center mt-20">
        Calling
      </Text>
      <Text className="text-white font=bold text-2xl text-center mt-10">
        Toll free emergency line
      </Text>
      <Text className="text-white font=bold text-4xl text-center mt-10">
        Community Watch
      </Text>
      <Pressable
        onPress={() => router.push("/(drawer)/dashboard")}
        className="mt-auto mb-20 bg-red-500 p-4 rounded-full h-20 w-20 items-center justify-center"
      >
        <FontAwesome name="phone" size={50} color="white" />
      </Pressable>
    </ImageBackground>
  );
};

export default Call;

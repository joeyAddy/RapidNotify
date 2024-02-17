import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "@/components/Themed";

const ProfileScreen = () => {
  return (
    <SafeAreaView className="flex-1 px-6">
      <View className="flex-1 items-center justify-center ">
        <Text className="text-lg text-center font-bold">Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

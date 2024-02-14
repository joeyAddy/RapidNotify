import { View, Text } from "react-native";
import React from "react";
import { OnboardFlow } from "react-native-onboard";
import { useRouter } from "expo-router";

export default function indext() {
  const router = useRouter();

  const renderPageHeader = () => {
    return (
      <View className="w-full items-center mt-3">
        <Text className="text-xl font-bold">GUAGEIT</Text>
      </View>
    );
  };
  return (
    <OnboardFlow
      onDone={() => router.replace("/(user)/auth")}
      HeaderComponent={() => renderPageHeader()}
      pages={[
        {
          title: "Welcome to Gaute!",
          subtitle:
            "Your one-stop app for efficient staff management and financial tracking",
          imageUri: "https://frigade.com/img/example1.png",
        },
        {
          title: "Manage Your Sales with Ease",
          subtitle:
            "Save time and effort with our intuitive tools for scheduling, tasks, and communication",
          imageUri: "https://frigade.com/img/example2.png",
        },
        {
          title: "Stay on Top of Your Finances",
          subtitle:
            "Gain real-time visibility into sales, expenses, and profitability with our comprehensive reports",
          imageUri: "https://frigade.com/img/example2.png",
        },
      ]}
      type={"fullscreen"}
    />
  );
}

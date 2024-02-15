import { View, Text, useColorScheme, Image } from "react-native";
import React from "react";
import { OnboardFlow } from "react-native-onboard";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

export default function indext() {
  const router = useRouter();

  const PageHeader = () => {
    return (
      <View className="w-full items-center mt-3 bg-transparent">
        <Text className="text-xl font-bold dark:text-white">GUAGEIT</Text>
      </View>
    );
  };

  const colorScheme = useColorScheme();
  return (
    <OnboardFlow
      onDone={() => router.replace("/(user)/auth")}
      HeaderComponent={() => <PageHeader />}
      primaryButtonStyle={{
        backgroundColor: "#9333ea",
      }}
      paginationSelectedColor={Colors[colorScheme ?? "light"].text}
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
      titleStyle={{
        color: Colors[colorScheme ?? "light"].text,
      }}
      subtitleStyle={{
        color: Colors[colorScheme ?? "light"].text,
      }}
      pages={[
        {
          title: "Welcome!",
          subtitle:
            "Your one-stop app for efficient filling station staff management and financial tracking",
          imageUri: Image.resolveAssetSource(
            require("../../../assets/images/onboarding-illustration-1.png")
          ).uri,
        },
        {
          title: "Manage Your Sales with Ease",
          subtitle:
            "Save time and effort with our intuitive tools for scheduling, tasks, and communication",
          imageUri: Image.resolveAssetSource(
            require("../../../assets/images/onboarding-illustration-2.png")
          ).uri,
        },
        {
          title: "Stay on Top of Your Finances",
          subtitle:
            "Gain real-time visibility into sales, expenses, and profitability with our comprehensive reports",
          imageUri: Image.resolveAssetSource(
            require("../../../assets/images/onboarding-illustration-3.png")
          ).uri,
        },
      ]}
      type={"fullscreen"}
    />
  );
}

import { View, Text, useColorScheme, Image } from "react-native";
import React from "react";
import { OnboardFlow } from "react-native-onboard";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { OnboardingDataType, onboardingData } from "@/locales";

export default function indext() {
  const router = useRouter();

  const PageHeader = () => {
    return (
      <View className="w-full items-center mt-3 bg-transparent">
        <Text className="font-extrabold dark:text-white text-4xl">. . .</Text>
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
      pages={
        onboardingData.map((item: OnboardingDataType) => ({
          title: item.title,
          subtitle: item.subtitle,
          imageUri: item.imageUri,
        })) as any
      }
      type={"fullscreen"}
    />
  );
}

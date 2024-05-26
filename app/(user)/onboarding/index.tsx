import {
  View,
  Text,
  useColorScheme,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { OnboardFlow } from "react-native-onboard";
import { Redirect, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { OnboardingDataType, onboardingData } from "@/locales";
import { FooterProps } from "react-native-onboard/lib/OnboardFlow/Footer";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function Onboarding() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const onboardingCompleted = await SecureStore.getItemAsync(
        "onboardingCompleted"
      );
      if (onboardingCompleted === "true") {
        // User has completed onboarding, navigate to the appropriate screen
        <Redirect href="/(user)/auth/signin" />;
      }
    })();
  }, []);

  // Todo: fucnton to print hello world

  const FooterComponent = (props: FooterProps) => {
    const isLastPage = props.currentPage + 1 === props.pages?.length;
    return (
      <View className="w-full mb-5 flex-row h-auto justify-between bg-black items-center py-6 px-[30px] bg-transparent">
        <TouchableOpacity
          onPress={() => {
            if (props.setCanContinue) {
              props.setCanContinue(false);
            }
            router.replace("/(user)/auth/signin");
          }}
        >
          <Text className="font-extrabold text-[#111] dark:text-white text-lg">
            Skip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.goToNextPage();
          }}
          className="h-[72px] w-[72px] rounded-full items-center justify-center"
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].buttonColors,
          }}
        >
          {isLastPage ? (
            <FontAwesome
              className="w-fit bg-transparent p-6"
              name="sign-in"
              size={24}
              color="white"
            />
          ) : (
            <AntDesign
              className="w-fit bg-transparent p-6"
              name="arrowright"
              size={24}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <OnboardFlow
      pageStyle={{ paddingHorizontal: 30 }}
      onDone={async () => {
        await SecureStore.setItemAsync("onboardingCompleted", "true");
        router.replace("/(user)/auth/signin");
      }}
      paginationSelectedColor={Colors[colorScheme ?? "light"].text}
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
      FooterComponent={(props) => <FooterComponent {...props} />}
      titleStyle={{
        textAlign: "left",
        color: Colors[colorScheme ?? "light"].text,
      }}
      subtitleStyle={{
        textAlign: "left",
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

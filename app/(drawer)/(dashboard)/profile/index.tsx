import { SafeAreaView, Text, View } from "@/components/Themed";
import { Image, Pressable, ScrollView, useColorScheme } from "react-native";
import { Button } from "react-native-paper";
import Currency from "react-currency-formatter";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const colorScheme = useColorScheme();
  // Reference to lottie
  const animationRef = useRef<LottieView>(null);
  const router = useRouter();
  useEffect(() => {
    animationRef.current?.play();
  }, []);
  return (
    <View className="flex-1">
      <ScrollView className="px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <View nativeID="1" className="">
          <View className="w-full h-28 self-center mb-4 items-center">
            <LottieView
              source={require("../../../../assets/lottie/avatar.json")}
              style={{ width: "100%", height: "100%" }}
              ref={animationRef}
            />
          </View>

          <Text className="text-center text-2xl text-gray-500">
            Hello{" "}
            <Text className="font-bold text-black dark:text-white">
              Ifebuche
            </Text>
          </Text>
        </View>
        <View className="w-full h-[28%] rounded-xl bg-purple-700 mt-6">
          <View className="flex-row justify-between bg-white/30 rounded-tr-xl rounded-tl-xl items-center px-6 py-3">
            <Text className="text-lg text-white font-bold">
              Today{" | "}
              <Text className="text-white font-thin">
                <FontAwesome
                  className="w-fit bg-white text-whte"
                  name="sign-out"
                  size={20}
                  color="white"
                />
              </Text>
            </Text>
            <Button className="bg-white px-1 py-0 rounded-mlg">
              <Text darkColor="black" className="font-bold">
                View Sales
              </Text>
            </Button>
          </View>
          <View className="bg-transparent flex-row px-6 py-3 flex-1 justify-between">
            <View className="bg-transparent h-auto justify-between">
              <View className="bg-transparent">
                <Text className="text-lg text-white/50">Total sales</Text>
                <Text className="text-xl text-white font-bold">
                  <Currency currency="NGN" quantity={2000} />
                </Text>
              </View>
              <View className="flex-row bg-transparent items-center space-x-2">
                <FontAwesome
                  className="w-fit bg-transparent"
                  name="arrow-circle-o-down"
                  size={20}
                  color="white"
                />
                <Text className="text-white text-lg font-medium">45%</Text>
              </View>
            </View>
            <View className="bg-transparent h-auto justify-between items-end">
              <View className="bg-transparent">
                <Text className="text-lg text-white/50 text-right">
                  Total Income
                </Text>
                <Text className="text-xl text-white font-bold">
                  <Currency currency="NGN" quantity={5400} />
                </Text>
              </View>
              <View className="flex-row bg-transparent items-center space-x-2">
                <FontAwesome
                  className="w-fit bg-transparent"
                  name="arrow-circle-o-up"
                  size={20}
                  color="white"
                />
                <Text className="text-white text-lg font-medium">45%</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            borderWidth: 2,
            borderColor: Colors[colorScheme ?? "dark"].text,
          }}
          className="bg-slate-50 dark:bg-black border-dashed rounded-xl h-[10%] mt-5 flex-row items-center px-6 justify-between"
        >
          <View className="flex-row space-x-2 items-center bg-transparent">
            <Image
              source={require("../../../../assets/images/balance-icon.png")}
              className="w-8 h-8"
              style={{ resizeMode: "contain" }}
            />
            <Text darkColor="white" className="font-bold text-base">
              Balance your account
            </Text>
          </View>
          <View className="bg-transparent">
            <FontAwesome
              name="long-arrow-right"
              size={24}
              color={Colors[colorScheme ?? "dark"].text}
            />
          </View>
        </View>

        <View className="flex-row justify-between my-5 h-[25%]">
          <View
            style={{
              borderWidth: 2,
              borderColor: Colors[colorScheme ?? "light"].text,
            }}
            className="rounded-xl h-full items-center p-[23.5px] w-fit justify-between"
          >
            <FontAwesome
              name="minus-circle"
              size={24}
              color={Colors[colorScheme ?? "dark"].text}
            />
            <View className="items-center bg-transparent">
              <Text className="text-gray-500">Shortage</Text>
              <Text className="text-xl dark:text-white font-bold">
                <Currency currency="NGN" quantity={5400} />
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 2,
              borderColor: Colors[colorScheme ?? "dark"].text,
            }}
            className="rounded-xl h-full items-center p-[23.5px] w-fit justify-between"
          >
            <FontAwesome
              name="plus-circle"
              size={24}
              color={Colors[colorScheme ?? "dark"].text}
            />
            <View className="items-center bg-transparent">
              <Text className="text-gray-500">Overgage</Text>
              <Text className="text-xl dark:text-white font-bold">
                <Currency currency="NGN" quantity={5200} />
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

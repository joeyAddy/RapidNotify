import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { Pressable, StatusBar } from "react-native";
import { Image } from "react-native";
import MapView from "react-native-maps";
import { BarChart } from "react-native-gifted-charts";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/user";

const Account = () => {
  const colorScheme = useColorScheme();
  // Reference to lottie
  const router = useRouter();

  const [currentUser] = useAtom(currentUserAtom);

  const barData = [
    { value: 250, label: "M", frontColor: "#177AD5" },
    { value: 500, label: "T", frontColor: "#fb923c" },
    { value: 745, label: "W", frontColor: "#177AD5" },
    { value: 320, label: "T", frontColor: "#fb923c" },
    { value: 600, label: "F", frontColor: "#177AD5" },
    { value: 256, label: "S", frontColor: "#fb923c" },
    { value: 300, label: "S", frontColor: "#177AD5" },
  ];

  return (
    <View className="flex-1 relative">
      <StatusBar translucent />
      <Image
        resizeMode="contain"
        className="-mt-5 w-full"
        source={require("@assets/images/top-wave.png")}
      />
      <View className="flex-1 -mt-12 px-4">
        <View className="rounded-3xl p-6 space-y-2 bg-[#FFF5E6]">
          <View className="flex-row space-x-3 bg-transparent">
            <Image
              source={require("@assets/images/avatar.png")}
              className="h-20 w-20 rounded-full"
              resizeMode="contain"
            />
            <View className="bg-transparent">
              <Text className="text-blue-500">
                {currentUser.isSubscribed ? "Premium" : "Basic"}
              </Text>
              <Text className="font-bold text-2xl">
                {currentUser.fullName ?? "No name"}
              </Text>
              <Text className="text-sm font-thin">{currentUser.email}</Text>
            </View>
          </View>
          <View className="flex-row bg-transparent justify-between space-x-2">
            <View className="flex-row bg-transparent space-x-2">
              <Text className="text-xl font-bold">Reputation:</Text>
              <Text className="text-xl font-bold text-green-600">
                {currentUser.reputation}%
              </Text>
            </View>
            <View className="flex-row bg-transparent items-center space-x-2">
              <Text className="text-xl font-bold">Edit</Text>
              <FontAwesome name="edit" size={24} />
            </View>
          </View>
        </View>
        {/* <View>
          <Text className="font-bold mt-3 mb-2 text-xl">Location Map</Text>

          <MapView className="w-full h-28" />
        </View> */}
        <View>
          <Text className="font-bold mt-5 mb-2 text-xl">Reports Timeline</Text>

          <View className="w-full">
            <BarChart
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              data={barData}
              yAxisThickness={0}
              xAxisThickness={0}
            />
          </View>
        </View>
        <View className="flex-row space-x-12 px-8 items-center justify-center relative bottom-0 mt-auto">
          <Pressable
            onPress={() => router.push("/call/")}
            className="items-center space-y-1"
          >
            <FontAwesome name="phone" size={30} color={Colors.light.tint} />
            <Text className="text-sm">Quick call</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/report/")}
            className="items-center space-y-1 relative -top-6"
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: "#3B94FD",
              }}
              className=" rounded-full p-2 border-dashed"
            >
              <View
                style={{
                  // shadowColor: "bg-[#1c518d]",
                  shadowColor: "black",
                  shadowRadius: 10,
                  shadowOpacity: 1,
                }}
                className="bg-[#3B94FD] rounded-full p-3 shadow-lg shadow-"
              >
                <MaterialIcons
                  name="record-voice-over"
                  size={30}
                  color="white"
                />
              </View>
            </View>
            <Text className="text-sm">Send report</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/forum/")}
            className="items-center space-y-1"
          >
            <FontAwesome name="wechat" size={30} color={Colors.light.tint} />
            <Text className="text-sm">Forum</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Account;

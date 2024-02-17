import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "../Themed";
import { Image, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

const DashboardDrawerMenu = (props: DrawerContentComponentProps) => {
  console.log("====================================");
  console.log("PROPS", props.state);
  console.log("====================================");
  const colorScheme = useColorScheme();
  return (
    <View className="flex-1 pt-20 px-4">
      <View className="w-full h-14 mb-4">
        <Image
          className="h-full w-auto -ml-[38%]"
          style={{
            resizeMode: "contain",
          }}
          source={{
            uri: Image.resolveAssetSource(require("@assets/images/logo.png"))
              .uri,
          }}
        />
      </View>
      <DrawerItem
        pressColor={Colors[colorScheme ?? "light"].tint}
        labelStyle={{ color: Colors[colorScheme ?? "light"].text }}
        label={"Blog"}
        icon={({ color, size }) => (
          <FontAwesome name="newspaper-o" size={size} color={color} />
        )}
        onPress={() => {
          router.push("/(drawer)/blog");
        }}
      />
    </View>
  );
};

export default DashboardDrawerMenu;

import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { View } from "../Themed";
import { Image, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

const DashboardDrawerMenu = (props: DrawerContentComponentProps) => {
  console.log("====================================");
  console.log("PROPS", props.state);
  console.log("====================================");

  const colorScheme = useColorScheme();

  const pathName = usePathname();
  return (
    <View className="flex-1 pt-20">
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
        labelStyle={[
          style.drawerItemsStyle,
          {
            color: Colors[colorScheme ?? "light"].drawerItemIcon,
          },
        ]}
        style={{
          justifyContent: "center",
          backgroundColor: pathName === "/blog" ? "#9333ea" : "white",
          paddingHorizontal: 5,
        }}
        label={"Blog"}
        icon={({ color, size }) => (
          <FontAwesome
            name="newspaper-o"
            size={size}
            color={Colors[colorScheme ?? "light"].tint}
          />
        )}
        onPress={() => {
          router.push("/(drawer)/blog");
        }}
      />
    </View>
  );
};

export default DashboardDrawerMenu;

const style = StyleSheet.create({
  drawerItemsStyle: {
    marginLeft: -20,
    fontSize: 18,
  },
});

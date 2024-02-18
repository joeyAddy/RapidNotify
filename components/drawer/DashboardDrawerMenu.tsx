import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "../Themed";
import { Image, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import {
  drawerItems,
  FontAwesomeIconName,
  MaterialCommunityIconsIconName,
} from "@/locales";

const DashboardDrawerMenu = (props: DrawerContentComponentProps) => {
  const colorScheme = useColorScheme();

  const pathName = usePathname();

  const isFontAwesomeIconName = (name: string): name is FontAwesomeIconName => {
    return name in FontAwesome.glyphMap;
  };

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
      <View className="w-full border-[0.5px]" />
      {drawerItems.map((item) => (
        <DrawerItem
          key={item.label}
          pressColor={Colors[colorScheme ?? "light"].tint}
          labelStyle={[
            style.drawerItemsStyle,
            {
              color:
                pathName === `/${item.label.toLowerCase()}`
                  ? "white"
                  : Colors[colorScheme ?? "light"].drawerItemColor,
            },
          ]}
          style={{
            justifyContent: "center",
            backgroundColor:
              pathName === `/${item.label.toLowerCase()}` ? "#9333ea" : "white",
            paddingHorizontal: 5,
          }}
          label={item.label}
          icon={({ size }) =>
            isFontAwesomeIconName(item.iconName) ? (
              <FontAwesome
                name={item.iconName}
                size={size}
                color={
                  pathName === "/blog"
                    ? "white"
                    : Colors[colorScheme ?? "light"].drawerItemColor
                }
              />
            ) : (
              <MaterialCommunityIcons
                name={item.iconName}
                size={size}
                color={
                  pathName === "/blog"
                    ? "white"
                    : Colors[colorScheme ?? "light"].drawerItemColor
                }
              />
            )
          }
          onPress={() => {
            router.push(`${item.path}`);
          }}
        />
      ))}
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

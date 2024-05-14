import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "../Themed";
import { Image, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { drawerItems } from "@/locales";
import { FontAwesomeIconName } from "@/interfaces/icon-names.interfaces";
import { removeUserFromSecureStore } from "@/utils/removeUserFromSecureStore copy";
import { currentUserAtom } from "@/store/user";
import { useAtom } from "jotai";

const DashboardDrawerMenu = (props: DrawerContentComponentProps) => {
  const [currentUser] = useAtom(currentUserAtom);
  const colorScheme = useColorScheme();

  console.log("CURRENT USER", currentUser);

  const pathName = usePathname();

  const isFontAwesomeIconName = (name: string): name is FontAwesomeIconName => {
    return name in FontAwesome.glyphMap;
  };

  return (
    <View className="flex-1 pt-20">
      <View className="h-20 w-full mb-14 mx-auto items-center space-y-2">
        {currentUser.profilePhotoUrl !== "" ? (
          <Image
            className="h-full w-20 rounded-full bg-black"
            style={{
              resizeMode: "contain",
            }}
            source={{
              uri: currentUser.profilePhotoUrl,
            }}
          />
        ) : (
          <View className="h-full w-20 rounded-full bg-gray-50 items-center justify-center">
            <FontAwesome name="user-circle" size={70} />
          </View>
        )}
        <Text className="font-bold capitalize">{currentUser.fullName}</Text>
      </View>
      {drawerItems.map((item) => (
        <DrawerItem
          key={item.label}
          pressColor={Colors[colorScheme ?? "light"].tint}
          labelStyle={[
            style.drawerItemsStyle,
            {
              color:
                pathName === `/${item.label.toLowerCase()}`
                  ? Colors[colorScheme ?? "light"].tint
                  : Colors[colorScheme ?? "light"].drawerItemColor,
            },
          ]}
          style={{
            justifyContent: "center",
            paddingHorizontal: 5,
          }}
          label={item.label}
          icon={({ size }) =>
            isFontAwesomeIconName(item.iconName) ? (
              <FontAwesome
                name={item.iconName}
                size={size}
                color={
                  pathName === `/${item.label.toLowerCase()}`
                    ? Colors[colorScheme ?? "light"].tint
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

      <DrawerItem
        style={{
          backgroundColor: Colors.light.tint,
          borderRadius: 30,
          width: "90%",
          marginTop: "auto",
          marginBottom: 40,
          alignSelf: "center",
          justifyContent: "center",
          paddingHorizontal: 30,
          paddingVertical: 2,
        }}
        labelStyle={{
          color: "white",
          fontWeight: "700",
        }}
        icon={() => <FontAwesome name="power-off" size={24} color="white" />}
        label={"Log out"}
        onPress={async () => {
          await removeUserFromSecureStore();
          router.push("/(user)/auth/signin");
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
    fontWeight: "bold",
  },
});

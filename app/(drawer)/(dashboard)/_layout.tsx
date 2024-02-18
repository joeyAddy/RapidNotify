import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text, View } from "@/components/Themed";
import {
  useNavigation,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const navigation = useNavigation();

  const getTabBarLabelColor = (isFocused: boolean) => {
    if (isFocused) {
      return "#9333ea";
    }
    return "gray";
  };

  const getTabBarLabelStyle = (isFocused: boolean) => {
    return {
      color: getTabBarLabelColor(isFocused),
      marginTop: -5,
      fontSize: 15,
    };
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: true,
        tabBarLabelStyle: getTabBarLabelStyle(
          route.name ===
            getFocusedRouteNameFromRoute(
              navigation.getState().routes[navigation.getState().index]
            )
        ),

        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 8,
          height: 70,
          paddingHorizontal: 15,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          href: "/",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent">
              <TabBarIcon name="home" color={focused ? "#9333ea" : color} />
            </View>
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="sales/index"
        options={{
          title: "Sales",
          href: "/sales",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent">
              <TabBarIcon
                name="shopping-bag"
                color={focused ? "#9333ea" : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore/index"
        options={{
          title: "Explore",
          href: "/explore",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="bg-transparent items-center">
              <TabBarIcon name="globe" color={focused ? "#9333ea" : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          href: "/profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent">
              <TabBarIcon name="user" color={focused ? "#9333ea" : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

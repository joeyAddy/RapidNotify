import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text, View } from "@/components/Themed";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent">
              <TabBarIcon name="home" color={focused ? "#9333ea" : color} />
              <Text
                className="text-[10px]"
                lightColor={focused ? "#9333ea" : color}
                darkColor={focused ? "#9333ea" : color}
              >
                Dashboard
              </Text>
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
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent">
              <TabBarIcon name="user" color={focused ? "#9333ea" : color} />
              <Text
                className={`text-[10px]`}
                lightColor={focused ? "#9333ea" : color}
                darkColor={focused ? "#9333ea" : color}
              >
                Me
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center bg-transparent items-center">
              <TabBarIcon name="gear" color={focused ? "#9333ea" : color} />
              <Text
                className={`text-[10px]`}
                lightColor={focused ? "#9333ea" : color}
                darkColor={focused ? "#9333ea" : color}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

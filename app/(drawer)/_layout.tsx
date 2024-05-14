import {
  View,
  Text,
  Pressable,
  useColorScheme,
  Image,
  ImageBackground,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DashboardDrawerMenu from "@/components/drawer/DashboardDrawerMenu";
import { Link, router, usePathname } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  DrawerContentComponentProps,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import React from "react";

const DrawerLayout = () => {
  const colorScheme = useColorScheme();

  const pathName = usePathname();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        className="flex-1 absolute top-0 right-0 left-0 bottom-0"
        resizeMode="cover"
        source={require("@assets/images/top-wave.png")}
      />
      <Drawer
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={(draweProps: DrawerContentComponentProps) => (
          <DashboardDrawerMenu {...draweProps} />
        )}
      >
        <Drawer.Screen
          name="dashboard/index"
          options={{
            headerShown: true,
            headerTitle: "Dashboard",
            headerTitleStyle: {
              color: "white",
            },
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "transparent",
              height: 115,
            },
            headerTransparent: true,
            headerLeft: () => <DrawerToggleButton tintColor="white" />,
            headerRight: () => (
              <Link href="/notifications/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      className="w-fit bg-transparent"
                      name={"bell-o"}
                      size={24}
                      color="white"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Drawer.Screen
          name="account/index"
          options={{
            headerShown: true,
            headerTitle: "Account",
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "white",
            },
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "transparent",
              height: 115,
            },
            headerTransparent: true,
            headerLeft: () => <DrawerToggleButton tintColor="white" />,
            headerRight: () => (
              <Link href="/notifications/" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      className="w-fit bg-transparent"
                      name={"bell-o"}
                      size={24}
                      color="white"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Drawer.Screen
          name="reports/index"
          options={{
            headerShown: true,
            headerTitle: "Reports",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} className="pl-4">
                <AntDesign name={"arrowleft"} size={24} color="black" />
              </Pressable>
            ),
            headerRight: () => (
              <Link href="/(user)/auth/signin" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign
                      className="w-fit bg-transparent"
                      name={"search1"}
                      size={24}
                      color="black"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Drawer.Screen
          name="resource-directory/index"
          options={{
            headerShown: true,
            headerTitle: "Resource Directory",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} className="pl-4">
                <AntDesign name={"arrowleft"} size={24} color="black" />
              </Pressable>
            ),
            headerRight: () => (
              <Link href="/(user)/auth/signin" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign
                      className="w-fit bg-transparent"
                      name={"search1"}
                      size={24}
                      color="black"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Drawer.Screen
          name="settings/index"
          options={{
            headerShown: true,
            headerTitle: "Settings",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerLeft: () => (
              <Pressable onPress={() => router.back()} className="pl-4">
                <AntDesign name={"arrowleft"} size={24} color="black" />
              </Pressable>
            ),
            headerRight: () => (
              <Link href="/(user)/auth/signin" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign
                      className="w-fit bg-transparent"
                      name={"search1"}
                      size={24}
                      color="black"
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;

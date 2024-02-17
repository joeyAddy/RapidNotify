import { View, Text, Pressable, useColorScheme } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DashboardDrawerMenu from "@/components/drawer/DashboardDrawerMenu";
import { Link, usePathname } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { DrawerToggleButton } from "@react-navigation/drawer";

const DrawerLayout = () => {
  const colorScheme = useColorScheme();

  const pathName = usePathname();

  console.log(pathName);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerTitle: () => (
            <Text className="text-xl text-gray-500">
              Welcome{" "}
              <Text className="font-bold text-black dark:text-white">
                Ifebuche
              </Text>
            </Text>
          ),
          headerLeft: () => (
            <DrawerToggleButton
              tintColor={Colors[colorScheme ?? "light"].text}
            />
          ),
          headerRight: () => (
            <Link href="/(user)/auth" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    className="w-fit bg-transparent"
                    name={pathName === "/" ? "support" : "sign-out"}
                    size={30}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
        drawerContent={(draweProps) => <DashboardDrawerMenu {...draweProps} />}
      >
        <Drawer.Screen
          name="blog/index"
          options={{
            headerTitle: "Blog",
            headerRight: () => (
              <Link href="/(user)/auth" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      className="w-fit bg-transparent"
                      name="search"
                      size={30}
                      color={Colors[colorScheme ?? "light"].text}
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

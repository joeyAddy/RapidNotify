import { AllRoutes } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// Extract the available icon names from the FontAwesome component
export type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;
export type MaterialCommunityIconsIconName =
  keyof typeof MaterialCommunityIcons.glyphMap;

interface DrawerItems {
  label: string;
  path: AllRoutes;
  iconName: FontAwesomeIconName | MaterialCommunityIconsIconName;
}

export const drawerItems: DrawerItems[] = [
  {
    label: "Blog",
    path: "/(drawer)/blog",
    iconName: "newspaper-o",
  },
  {
    label: "Leaderboard",
    path: "/(drawer)/blog",
    iconName: "podium",
  },
  {
    label: "Settings",
    path: "/(drawer)/blog",
    iconName: "gear",
  },
];

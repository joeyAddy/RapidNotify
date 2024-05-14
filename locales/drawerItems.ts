import {
  FontAwesomeIconName,
  MaterialCommunityIconsIconName,
} from "@/interfaces/icon-names.interfaces";
import { AllRoutes } from "expo-router";

interface DrawerItems {
  label: string;
  path: AllRoutes;
  iconName: FontAwesomeIconName | MaterialCommunityIconsIconName;
}

export const drawerItems: DrawerItems[] = [
  {
    label: "Dashboard",
    path: "/(drawer)/dashboard",
    iconName: "newspaper-o",
  },
  {
    label: "Account",
    path: "/(drawer)/account",
    iconName: "account",
  },
  {
    label: "Report",
    path: "/(drawer)/reports",
    iconName: "file-chart",
  },
  {
    label: "Resource directory",
    path: "/(drawer)/resource-directory",
    iconName: "database-marker",
  },
  {
    label: "Settings",
    path: "/(drawer)/settings",
    iconName: "gear",
  },
];

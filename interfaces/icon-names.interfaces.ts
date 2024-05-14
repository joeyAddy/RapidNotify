import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// Extract the available icon names from the FontAwesome component
export type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;
export type MaterialCommunityIconsIconName =
  keyof typeof MaterialCommunityIcons.glyphMap;

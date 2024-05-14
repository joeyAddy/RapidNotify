import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable } from "react-native";

const Settings = () => {
  return (
    <View className="flex-1 pt-10">
      <Image
        source={require("@assets/images/avatar.png")}
        className="h-20 w-20 rounded-full self-center"
        resizeMode="contain"
      />
      <View className="mt-10 space-y-4 px-4">
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="account" size={30} />
          <Text className="text-xl font-medium">Account</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="diamond-stone" size={30} />
          <Text className="text-xl font-medium">Suscription</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="form-textbox-password" size={30} />
          <Text className="text-xl font-medium">Change password</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="shield-alert" size={30} />
          <Text className="text-xl font-medium">Add emergency contact(s)</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="shield-check" size={30} />
          <Text className="text-xl font-medium">Security & Privacy Policy</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;

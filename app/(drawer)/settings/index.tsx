import { Text, View } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();
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
          <Text className="text-lg font-bold">Account</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push("/suscription/");
          }}
          className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5"
        >
          <MaterialCommunityIcons name="diamond-stone" size={30} />
          <Text className="text-lg font-bold">Suscription</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="form-textbox-password" size={30} />
          <Text className="text-lg font-bold">Change password</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push("/add-emergency-contacts/");
          }}
          className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5"
        >
          <MaterialCommunityIcons name="shield-alert" size={30} />
          <Text className="text-lg font-bold">Add emergency contacts</Text>
        </Pressable>
        <Pressable className="flex-row space-x-4 items-center w-full border-b pt-1 pb-5">
          <MaterialCommunityIcons name="shield-check" size={30} />
          <Text className="text-lg font-bold">Security & Privacy Policy</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;

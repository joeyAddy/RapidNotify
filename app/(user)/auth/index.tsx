import React from "react";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-paper";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const Login = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(dashboard)");
    Toast.show({
      swipeable: true,
      text1: "You have successfully logged",
      text2: "Welcome back",
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-gray px-6 pt-8 space-y-5">
      <StatusBar translucent />
      <View>
        <View className="w-full mt-3 items-center">
          <Image
            source={require("../../../assets/images/lock.png")}
            className="w-full h-32 self-center mb-20"
            style={{ resizeMode: "contain" }}
          />
          <Text className="text-4xl font-bold text-center">
            Enter Staff Code
          </Text>
          <Text className="text-xl text-center text-gray-600 font-bold">
            The code sent to your email
          </Text>
        </View>
      </View>

      <View className="w-full space-y-4">
        <TextInput
          mode="outlined"
          label="6-digits Staff Code"
          keyboardType="phone-pad"
          placeholder="e.g 123456"
          outlineColor="gray"
          activeOutlineColor="rgb(147 51 234)"
          placeholderTextColor="rgb(147 51 234)"
          className="h-14 text-2xl text-center text-slate-600 bg-gray-50 px-2"
          outlineStyle={{ borderRadius: 230 }}
        />

        <Pressable
          onPress={handleLogin}
          className="bg-purple-600 !rounded-full w-fit h-14 items-center justify-center"
        >
          <Text className="text-white font-medium text-lg">Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Login;

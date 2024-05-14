import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Divider, TextInput } from "react-native-paper";
import { Image, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Colors from "@/constants/Colors";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { createUser } from "@/services/user";
import { getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";

const Login = () => {
  const router = useRouter();

  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    console.log("asdfasd");

    if (email.trim().length < 1 || password.trim().length < 1) {
      Toast.show({
        text1: "Missing required fields!",
        text2: "Please field all fields",
        swipeable: true,
        autoHide: true,
        topOffset: 40,
        position: "top",
        type: "error",
      });

      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const location = await getCurrentPositionAsync();

      const address = await reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const finalLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...address[0],
      };
      const user = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        isSubcribed: false,
        reputation: 100,
        fullName,
        location: finalLocation,
        profilePhotoUrl: "",
      };

      await createUser(user);

      router.push("/(user)/auth/signin");
      Toast.show({
        swipeable: true,
        text1: "Your account has been created",
        text2: "Please log in to continue",
        position: "top",
        autoHide: true,
        type: "success",
        topOffset: 40,
      });
      // Handle success, e.g., navigate to a new screen, show a success message, etc.
      console.log("Signed up:", user);
    } catch (error) {
      // Handle error, e.g., show an error message to the user
      Toast.show({
        text1: "An error occurred!",
        text2: "Pleasee try again",
        swipeable: true,
        autoHide: true,
        topOffset: 40,
        position: "top",
        type: "error",
      });
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      password.trim().length > 1 &&
      fullName.trim().length > 1 &&
      email.trim().length > 1 &&
      confirmPassword === password
    ) {
      setCanSubmit(true);
    }
  }, [password, email, confirmPassword]);
  return (
    <View className="flex-1 bg-gray px-6">
      <StatusBar translucent />
      <View className="w-full mt-16">
        <Text className="text-3xl font-bold mb-4">Sign up</Text>
        <Text className="leading-5 mb-2">
          Sign up now to access powerful tools for emergency reporting,
          communication, and collaboration.
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TextInput
          mode="outlined"
          label="Full Name"
          placeholder="Enter your full name"
          outlineColor={
            fullName.trim().length > 0 ? "green" : Colors.light.tint
          }
          activeOutlineColor={fullName.trim().length > 0 ? "green" : "red"}
          placeholderTextColor="red"
          right={<TextInput.Icon icon="account" size={24} />}
          className="h-14 text-base font-semiboldr text-slate-600 bg-gray-50 px-2"
          outlineStyle={{ borderRadius: 0 }}
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <TextInput
          mode="outlined"
          label="Email address"
          keyboardType="email-address"
          placeholder="Enter your email address"
          outlineColor={email.trim().length > 0 ? "green" : Colors.light.tint}
          activeOutlineColor={email.trim().length > 0 ? "green" : "red"}
          placeholderTextColor="red"
          right={<TextInput.Icon icon="email" size={24} />}
          className="h-14 text-base font-semiboldr text-slate-600 bg-gray-50 px-2"
          outlineStyle={{ borderRadius: 0 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry={true}
          placeholder="Enter your password"
          outlineColor={
            password.trim().length > 0 ? "green" : Colors.light.tint
          }
          activeOutlineColor={password.trim().length > 0 ? "green" : "red"}
          placeholderTextColor="red"
          right={<TextInput.Icon icon="lock" size={24} />}
          className="h-14 text-base font-semiboldr text-slate-600 bg-gray-50 px-2"
          outlineStyle={{ borderRadius: 0 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          mode="outlined"
          label="Confirm Password"
          secureTextEntry={true}
          placeholder="Confirm Password"
          outlineColor={canSubmit ? "green" : Colors.light.tint}
          activeOutlineColor={canSubmit ? "green" : "red"}
          placeholderTextColor="red"
          right={<TextInput.Icon icon="lock" size={24} />}
          className="h-14 text-base font-semiboldr text-slate-600 bg-gray-50 px-2"
          outlineStyle={{ borderRadius: 0 }}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (text !== password) {
              Toast.show({
                text1: "Match error",
                text2: "Your passwords must be the same.",
                swipeable: true,
                autoHide: true,
                topOffset: 40,
                position: "top",
                type: "error",
              });
            } else {
              Toast.show({
                text1: "Great!",
                text2: "Your passwords match",
                swipeable: true,
                autoHide: true,
                topOffset: 40,
                position: "top",
                type: "success",
              });
            }
          }}
        />

        <Pressable
          onPress={handleSignup}
          disabled={!canSubmit}
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].buttonColors,
            opacity: canSubmit ? 1 : 0.5,
          }}
          className="w-fit h-14 items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator size={24} color="white" />
          ) : (
            <Text className="text-white font-medium text-lg">Sign up</Text>
          )}
        </Pressable>
        <View className="w-full items-center space-y-4">
          <View className="flex-row space-x-1 items-center">
            <Text className="font-medium text-gray-500 text-base">
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push("/(user)/auth/signin")}>
              <Text className="font-extrabold text-base">Sign in here</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="border-b border-gray-500 flex-[6]" />
            <Text>or</Text>
            <View className="border-b border-gray-500 flex-[6]" />
          </View>
          <Pressable className="h-14 flex-row items-center px-8 border w-full border-gray-500">
            <Image
              source={require("@assets/images/google-icon.png")}
              className="h-8 w-8 mr-8"
            />
            <Text className="font-medium">Sign in with google</Text>
          </Pressable>
          <Pressable className="h-14 flex-row items-center px-8 border w-full border-gray-500">
            <Image
              source={require("@assets/images/facebook-icon.png")}
              className="h-8 w-8 mr-8"
            />
            <Text className="font-medium">Sign in with facebook</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Login;

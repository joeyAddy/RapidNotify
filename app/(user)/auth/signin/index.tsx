import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Divider, TextInput } from "react-native-paper";
import { Image, Pressable, useColorScheme } from "react-native";
import { Redirect, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Colors from "@/constants/Colors";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { gooogleProvider, facebookProvider, auth } from "@/firebaseConfig";
import * as SecureStore from "expo-secure-store";
import { getCurrentPositionAsync, reverseGeocodeAsync } from "expo-location";
import { UpdateCurrentUserAtom } from "@/store/user";
import { useAtom } from "jotai";
import { getUserByUid, updateUserByUid } from "@/services/user";
import { getUserFromSecureStore } from "@/utils/getUserFromSecureStore";

const Login = () => {
  const router = useRouter();

  const colorScheme = useColorScheme();

  const [_, updateCurrentUser] = useAtom(UpdateCurrentUserAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = await getUserByUid(userCredential.user.uid);

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

      const finalUserData = { ...user, location: finalLocation };

      await updateUserByUid(userCredential.user.uid, {
        location: finalLocation,
      });

      await updateCurrentUser(finalUserData);

      await SecureStore.setItemAsync(
        "userDetails",
        JSON.stringify(finalUserData)
      );

      router.push("/(drawer)/dashboard");
      Toast.show({
        swipeable: true,
        text1: "You have successfully logged",
        text2: "Welcome back",
      });
      // Handle success, e.g., navigate to a new screen, show a success message, etc.
      console.log("Signed in:", user);
    } catch (error: any) {
      // Handle error, e.g., show an error message to the user
      console.error("Sign-in failed:", error);
      if (error.code === "auth/invalid-credential") {
        Toast.show({
          text1: "Incorrect credentials!",
          text2: "Please make sure you email and passord are correct.",
          swipeable: true,
          autoHide: true,
          topOffset: 40,
          position: "top",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (password.trim().length > 1 && email.trim().length > 1) {
      setCanSubmit(true);
    }
  }, [password, email]);

  useEffect(() => {
    (async () => {
      const user = await getUserFromSecureStore();
      if (user !== null) {
        <Redirect href="/(drawer)/dashboard" />;
        return;
      }
    })();
  }, []);

  // signInWithPopup(auth, gooogleProvider)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential?.accessToken;
  //     // The signed-in user info.
  //     const user = result.user;
  //     // IdP data available using getAdditionalUserInfo(result)
  //     // ...
  //   })
  //   .catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });

  // signInWithPopup(auth, facebookProvider)
  //   .then((result) => {
  //     // The signed-in user info.
  //     const user = result.user;

  //     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //     const credential = FacebookAuthProvider.credentialFromResult(result);
  //     const accessToken = credential?.accessToken;

  //     // IdP data available using getAdditionalUserInfo(result)
  //     // ...
  //   })
  //   .catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = FacebookAuthProvider.credentialFromError(error);

  //     // ...
  //   });

  return (
    <SafeAreaView className="flex-1 bg-gray px-6 space-y-5">
      <StatusBar translucent />
      <View className="w-full">
        <Text className="text-3xl font-bold mb-4">Sign in</Text>
        <Text className="leading-5">
          Sign in to access your account and stay connected with your community
          in times of need
        </Text>
      </View>

      <View className="w-full space-y-4">
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

        <Pressable>
          <Text className="text-right font-bold text-lg">Forgot password?</Text>
        </Pressable>

        <Pressable
          onPress={handleSignIn}
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
            <Text className="text-white font-medium text-lg">Sign in</Text>
          )}
        </Pressable>
        <View className="w-full items-center space-y-4">
          <View className="flex-row space-x-1 items-center">
            <Text className="font-medium text-gray-500 text-base">
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push("/(user)/auth/signup")}>
              <Text className="font-extrabold text-base">Sign up here</Text>
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
    </SafeAreaView>
  );
};

export default Login;

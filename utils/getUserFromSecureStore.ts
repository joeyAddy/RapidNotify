import * as SecureStore from "expo-secure-store";

export const getUserFromSecureStore = async () => {
  let user;
  try {
    const savedUser = await SecureStore.getItemAsync("userDetails");

    user = JSON.parse(savedUser!);
    console.log("CURRENT USER: " + user);
  } catch (error) {
    console.log("GET_SAVED_USER_ERROR", error);
    user = null;
  }

  return user;
};

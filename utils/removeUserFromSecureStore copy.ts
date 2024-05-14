import * as SecureStore from "expo-secure-store";

export const removeUserFromSecureStore = async () => {
  try {
    await SecureStore.deleteItemAsync("userDetails");
  } catch (error) {
    console.log("REMOVE_SAVED_USER_ERROR", error);
  }
};

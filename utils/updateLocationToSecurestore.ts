import * as SecureStore from "expo-secure-store";
import { LocationGeocodedAddress } from "expo-location";

// eslint-disable-next-line no-undef
export const updateLocationToSecureStore = async (
  location: LocationGeocodedAddress
) => {
  const savedUser = await SecureStore.getItemAsync("userDetails");
  if (!savedUser) return;
  try {
    const parsedUserDetails = JSON.parse(savedUser);
    parsedUserDetails.location = location;
    await SecureStore.setItemAsync(
      "userDetails",
      JSON.stringify(parsedUserDetails)
    );
  } catch (error) {
    console.log("FATAL_ERROR_LOCATION_UPDATE_ERROR", error);
  }
};

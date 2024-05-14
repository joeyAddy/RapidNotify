import { getCurrentPositionAsync, Accuracy } from "expo-location";

export const getCurrentLocation = async () => {
  // Start geofencing for Kaduna regions
  const location = await getCurrentPositionAsync({
    accuracy: Accuracy.Highest,
  });

  console.log("CURRENT_LOCATION", location);

  return location;
};

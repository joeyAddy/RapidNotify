import { getCurrentPositionAsync, Accuracy } from "expo-location";

export const reverseGeocodeLatLng = async () => {
  // Start geofencing for Kaduna regions
  const location = await getCurrentPositionAsync({
    accuracy: Accuracy.Highest,
  });

  console.log("CURRENT_LOCATION", location);

  return location;
};

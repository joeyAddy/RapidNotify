import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useRef, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";

// Jotai is a primitive and flexible state management library for React.
//  is a smaller, faster and more flexible alternative to Recoil.
import { Provider as JotaiProvider, useAtom } from "jotai";
// The store is a collection of atoms and derived values
// that can be used to manage the state of your application.
import { store } from "@/store";
import { View } from "@/components/Themed";
import { AppProvider } from "@/context/chatContext";

import { OverlayProvider } from "stream-chat-expo";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { updateLocationToSecureStore } from "@/utils/updateLocationToSecurestore";
import { Alert, Linking, Platform } from "react-native";
import { PermissionsAndroid } from "react-native";
import * as Notifications from "expo-notifications";
import useNotificationObserver from "@/hooks/useNotificationObserver";
import registerForPushNotificationsAsync from "@/utils/notifications/registerPushNotification";
import { UpdatePushTokentom } from "@/store/user";

import * as IntentLauncher from "expo-intent-launcher";

interface GeofencingEventData {
  eventType: Location.GeofencingEventType;
  region: Location.LocationRegion;
}

interface Region {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface LocationTaskData {
  locations: Location.LocationObject[];
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(user)/onboarding/index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useNotificationObserver();

  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const [_, updatePushToken] = useAtom(UpdatePushTokentom);

  // Location task definitiona
  const BACKGROUND_LOCATION_UPDATE = "background-location-task";
  const LOCATION_GEOFENCING = "user-location-geofencing";

  const regions: Region[] = [
    {
      identifier: "Ungwan Maigero",
      latitude: 10.486223,
      longitude: 7.460618,
      radius: 1000,
    },
    {
      identifier: "region2",
      latitude: 10.5167,
      longitude: 7.4333,
      radius: 2000,
    },
    // Add more regions as needed
  ];

  const kadunaStateBounds = {
    minLatitude: 9.3636,
    maxLatitude: 11.3636,
    minLongitude: 6.0461,
    maxLongitude: 8.0461,
  };

  const filterRegionsInKaduna = (regions: Region[]): Region[] => {
    return regions.filter(
      (region) =>
        region.latitude >= kadunaStateBounds.minLatitude &&
        region.latitude <= kadunaStateBounds.maxLatitude &&
        region.longitude >= kadunaStateBounds.minLongitude &&
        region.longitude <= kadunaStateBounds.maxLongitude
    );
  };

  const startGeofencingForKadunaRegions = async () => {
    const kadunaRegions = filterRegionsInKaduna(regions);

    // Start geofencing for Kaduna regions
    await Location.startGeofencingAsync(LOCATION_GEOFENCING, kadunaRegions);
  };

  const requestPermissions = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATE, {
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("Granted permission for foreground");

        // Call the function to start geofencing for Kaduna regions
        await startGeofencingForKadunaRegions();
      } else {
        Alert.alert("alert Message", "Instructions based on OS", [
          {
            text: "Open Settings",
            onPress: () => goToSettings(),
            style: "cancel",
          },
          // { text: Languages.DENY, onPress: () => router.goback()},
        ]);
      }
    }
  };

  const goToSettings = () => {
    if (Platform.OS == "ios") {
      // Linking for iOS
      Linking.openURL("app-settings:");
    } else {
      // IntentLauncher for Android
      IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.MANAGE_ALL_APPLICATIONS_SETTINGS
      );
    }
  };

  useEffect(() => {
    (async () => {
      await requestPermissions();
    })();
  }, []);

  // handle notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (!token) return;
      updatePushToken(token);
      console.log("PUSH TOKEN", token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (!notification) return;

        setNotification(notification);
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener?.current!
      );
      Notifications.removeNotificationSubscription(responseListener?.current!);
    };
  }, []);

  TaskManager.defineTask(
    BACKGROUND_LOCATION_UPDATE,
    async ({ data, error }) => {
      if (error) {
        // Error occurred - check `error.message` for more details.
        return;
      }
      if (data) {
        const { locations } = data as LocationTaskData;
        // console.log("LOCATION", locations);

        const address = await Location.reverseGeocodeAsync({
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
        });

        const finalLocation = {
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
          ...address[0],
        };

        await updateLocationToSecureStore(finalLocation);
        // do something with the locations captured in the background
      }
    }
  );

  TaskManager.defineTask(LOCATION_GEOFENCING, ({ data, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }

    const eventData = data as GeofencingEventData; // Type assertion to GeofencingEventData

    if (eventData.eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", eventData.region);
    } else if (eventData.eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", eventData.region);
    }
  });

  return (
    <JotaiProvider {...store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
              <OverlayProvider>
                <Stack>
                  <Stack.Screen
                    name="(user)/onboarding/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="forum"
                    options={{
                      headerTitle: "Forum",
                      headerShadowVisible: false,
                      headerRight: () => (
                        <View className="flex-row items-center space-x-4">
                          <FontAwesome name="search" size={24} />
                          <FontAwesome name="bell-o" size={24} />
                        </View>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="notifications/index"
                    options={{
                      headerTitle: "Notifications",
                      headerShadowVisible: false,
                      headerRight: () => (
                        <View className="flex-row items-center space-x-4">
                          <FontAwesome name="search" size={24} />
                        </View>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="(user)/auth/signin/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(user)/auth/signup/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(drawer)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="report/index"
                    options={{
                      headerTitle: "Send report",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="emergency-contacts/index"
                    options={{
                      headerTitle: "Add emergency contact",
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="call/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="map/index"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                </Stack>
              </OverlayProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </AppProvider>
        <Toast position="bottom" bottomOffset={20} />
      </ThemeProvider>
    </JotaiProvider>
  );
}

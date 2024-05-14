import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { currentUserAtom } from "@/store/user";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import { SecurityUnit } from "@/constants/IncidentTypes";
import { Image } from "react-native";

const ReportMap = () => {
  const router = useRouter();

  const params = useLocalSearchParams();

  const [currentUser] = useAtom(currentUserAtom);

  const [useLocation, setUseLocation] = useState("");

  const [securityUnits, setSecurityUnits] = useState<Array<SecurityUnit>>([]);

  const [nearestUnit, setNearestUnit] = useState<SecurityUnit | null>(null);

  const [coords, setCoords] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      if (nearestUnit === null) return;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentUser.location.latitude},${currentUser.location.longitude}&destination=${nearestUnit?.location.latitude},${nearestUnit?.location.longitude}&mode=driving&key=AIzaSyB8zC7w2pEDpwjV0QQI9IsiE-vdViBSEv4`
      );
      const data = await response.json();
      console.log("DATA DIRECTIONS", data);

      if (data.status === "OK") {
        const { routes } = data;
        const { legs } = routes[0];
        const { distance, duration, steps } = legs[0];
        setDistance(distance.text);
        setDuration(duration.text);

        const newCoords = steps.map((step: any) => {
          return {
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
          };
        });

        setCoords(newCoords);
      }
    };
    fetchDirections();
  }, [currentUser.location, nearestUnit]);

  useEffect(() => {
    setUseLocation(
      `${currentUser.location.city}, ${currentUser.location.region}, ${currentUser.location.country}`
    );
  }, [currentUser.location]);

  useEffect(() => {
    (async () => {
      const securityUnits = await SecureStore.getItemAsync("security-unit");
      const parsedSecurityUnits = JSON.parse(securityUnits!) as SecurityUnit[];
      console.log("UNITS", parsedSecurityUnits);
      console.log("UNITS FROM PARAMS", params);

      // Find the nearest security unit
      let minDistance = Number.MAX_VALUE;
      let nearestUnit: SecurityUnit | null = null;
      parsedSecurityUnits.forEach((unit) => {
        const unitDistance = calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          unit.location.latitude,
          unit.location.longitude
        );
        if (unitDistance < minDistance) {
          minDistance = unitDistance;
          nearestUnit = unit;
        }
      });
      // Filter out the nearest unit from the security units list
      const filteredSecurityUnits = parsedSecurityUnits.filter(
        (unit) => unit !== nearestUnit
      );

      setSecurityUnits(filteredSecurityUnits);
      setNearestUnit(nearestUnit);
    })();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  return (
    <View className="flex-1 relative">
      <View className="h-[55%]">
        <MapView
          initialRegion={{
            latitude: currentUser.location.latitude,
            longitude: currentUser.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          className="w-full h-full"
        >
          <Marker
            coordinate={{
              latitude: currentUser.location.latitude,
              longitude: currentUser.location.longitude,
            }}
            title="You"
            description="This is where you are at the moment"
          />
          {securityUnits.map((unit, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: unit.location.latitude,
                longitude: unit.location.longitude,
              }}
              title={unit.unitName}
              description={unit.emergencyNumber}
            >
              <Image
                source={require("@assets/images/police-marker.png")}
                className="h-8 w-8"
              />
            </Marker>
          ))}

          {nearestUnit && (
            <Marker
              coordinate={{
                latitude: nearestUnit.location.latitude,
                longitude: nearestUnit.location.longitude,
              }}
              title={nearestUnit?.unitName}
              description={nearestUnit?.emergencyNumber}
            >
              <Image
                source={require("@assets/images/nearest-marker.png")}
                className="h-12 w-12"
              />
            </Marker>
          )}
          {coords.length > 0 && (
            <Polyline coordinates={coords} strokeWidth={4} strokeColor="red" />
          )}
        </MapView>
      </View>
      <View className="px-4 py-8 w-full absolute top-0 right-0 left-0 bg-transparent">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="h-[62px] w-[62px] rounded-full items-center justify-center"
          style={{
            backgroundColor: Colors.light.buttonColors,
          }}
        >
          <AntDesign
            className="w-fit bg-transparent p-6"
            name="arrowleft"
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View className="bg-black rounded-tr-3xl rounded-tl-3xl h-[50%] p-4 absolute right-0 left-0 bottom-0">
        <View className="bg-white rounded-2xl p-4 flex-row space-x-3 items-center">
          <FontAwesome6 name="location-crosshairs" size={36} color="red" />
          <View>
            <Text className="font-bold text-xl">Location</Text>
            <Text className="text-lg capitalize">{useLocation}</Text>
          </View>
        </View>
        <View className="h-10 w-0 border-l-2 border-dashed ml-5 mt-2" />
        <View className="bg-transparent flex-row space-x-3 items-center">
          <MaterialCommunityIcons
            name="police-station"
            size={40}
            color="#fb923c"
          />
          <View className="bg-black">
            <Text className="font-extrabold text-xl text-orange-400">
              Nearest security operative
            </Text>
            <Text className="text-lg capitalize text-white">{useLocation}</Text>
          </View>
        </View>
        <View className="flex-row p-4 space-x-4 bg-transparent w-full">
          <View className="bg-[#32312F] p-4 flex-row space-x-3 items-center rounded-2xl flex-[.5]">
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={24}
              color="white"
            />
            <View className="bg-transparent">
              <Text className="font-extrabold text-white text-lg w-auto">
                Distance
              </Text>
              <Text className="text-sm capitalize text-white">
                {distance ? distance : "......"}
              </Text>
            </View>
          </View>
          <View className="bg-[#32312F] p-4 flex-row space-x-3 items-center rounded-2xl flex-[.5]">
            <MaterialCommunityIcons
              name="clock-time-two"
              size={24}
              color="white"
            />
            <View className="bg-transparent">
              <Text className="font-extrabold text-white text-lg">Time</Text>
              <Text className="text-sm capitalize text-white">
                {duration ? duration : "......"}
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-transparent p-4 items-center justify-center flex-1">
          <Pressable
            onPress={() => router.push("/call/")}
            className="items-center space-y-1"
          >
            <View
              style={{
                borderWidth: 2,
                borderColor: "#4CAF50",
              }}
              className=" rounded-full p-2 border-dashed bg-transparent"
            >
              <View
                style={{
                  // shadowColor: "bg-[#1c518d]",
                  shadowColor: "black",
                  shadowRadius: 10,
                  shadowOpacity: 1,
                }}
                className="bg-[#4CAF50] rounded-full h-14 w-14 items-center justify-center p-3 shadow-lg shadow-"
              >
                <FontAwesome6 name="phone" size={24} color="white" />
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ReportMap;

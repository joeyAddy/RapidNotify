import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { Pressable, StatusBar } from "react-native";
import { Image } from "react-native";
import MapView from "react-native-maps";
import { BarChart } from "react-native-gifted-charts";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/user";
import { Button, Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { SecurityUnit, incidents } from "@/constants/IncidentTypes";
import { TouchableOpacity } from "react-native";

const Account = () => {
  const colorScheme = useColorScheme();
  // Reference to lottie
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const [securityUnits, setSecurityUnits] = useState<SecurityUnit[]>();

  const [errorMessage, setErrorMessage] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [currentUser] = useAtom(currentUserAtom);

  const barData = [
    { value: 250, label: "M", frontColor: "#177AD5" },
    { value: 500, label: "T", frontColor: "#fb923c" },
    { value: 745, label: "W", frontColor: "#177AD5" },
    { value: 320, label: "T", frontColor: "#fb923c" },
    { value: 600, label: "F", frontColor: "#177AD5" },
    { value: 256, label: "S", frontColor: "#fb923c" },
    { value: 300, label: "S", frontColor: "#177AD5" },
  ];

  const incidentsWithIcons = [
    { title: "theft", icon: "security" },
    { title: "accident", icon: "ambulance" },
    { title: "Fire", icon: "fire" },
    { title: "cyber crime", icon: "shield-lock" },
    { title: "health emergency", icon: "hospital" },
    { title: "kidnapping", icon: "police-badge" },
  ];

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            margin: 20,
            borderRadius: 10,
            backgroundColor: "white",
            padding: 20,
          }}
        >
          <Text className="text-center mb-4 font-bold">
            You are about to place a call to a security operative{" "}
          </Text>
          <View>
            <Text className="mb-2">Incident type</Text>
            <SelectDropdown
              data={incidentsWithIcons}
              onSelect={async (selectedItem, index) => {
                console.log(selectedItem, index);
                const incidentTypeWithDetails = incidents.find(
                  (incident) => incident.type === selectedItem.title
                );

                setSecurityUnits(incidentTypeWithDetails?.securityUnits);
                setErrorMessage("");
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    {selectedItem && (
                      <MaterialCommunityIcons
                        name={selectedItem.icon}
                        style={styles.dropdownButtonIconStyle}
                      />
                    )}
                    <Text
                      style={styles.dropdownButtonTxtStyle}
                      className="capitalize"
                    >
                      {(selectedItem && selectedItem.title) || "Incident type"}
                    </Text>
                    <MaterialCommunityIcons
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      style={styles.dropdownButtonArrowStyle}
                    />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      style={styles.dropdownItemIconStyle}
                    />
                    <Text
                      style={styles.dropdownItemTxtStyle}
                      className="capitalize"
                    >
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            {errorMessage.trim().length > 0 ? (
              <Text className="text-red-500">{errorMessage}</Text>
            ) : null}
          </View>

          <View className="flex-row space-x-4 mt-6">
            <TouchableOpacity
              onPress={hideModal}
              className="rounded-md border border-orange-400 items-center h-14 justify-center flex-[.5]"
            >
              <Text className="font-bold">No, cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (securityUnits) {
                  hideModal();
                  router.push("/call/");
                } else {
                  setErrorMessage("Choose Incident first");
                }
              }}
              className="rounded-md border bg-green-700 items-center h-14 justify-center flex-[.5] flex-row space-x-2"
            >
              <FontAwesome name="phone" color="white" size={20} />
              <Text className="font-bold text-white">Yes</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
      <View className="flex-1 relative">
        <StatusBar translucent />
        <Image
          resizeMode="contain"
          className="-mt-5 w-full"
          source={require("@assets/images/top-wave.png")}
        />
        <View className="flex-1 -mt-12 px-4">
          <View className="rounded-3xl p-6 space-y-2 bg-[#FFF5E6]">
            <View className="flex-row space-x-3 bg-transparent">
              <Image
                source={require("@assets/images/avatar.png")}
                className="h-20 w-20 rounded-full"
                resizeMode="contain"
              />
              <View className="bg-transparent">
                <View className="flex-row justify-between w-auto bg-transparent">
                  <Text className="text-blue-500">
                    {currentUser.isSubscribed ? "Premium" : "Basic"}
                  </Text>
                  {currentUser.isCommunityWatch && (
                    <MaterialCommunityIcons
                      name="police-badge"
                      size={30}
                      color="gold"
                    />
                  )}
                </View>
                <Text className="font-bold text-2xl">
                  {currentUser.fullName ?? "No name"}
                </Text>
                <Text className="text-sm font-thin">{currentUser.email}</Text>
              </View>
            </View>
            <View className="flex-row bg-transparent justify-between space-x-2">
              <View className="flex-row bg-transparent space-x-2">
                <Text className="text-xl font-bold">Reputation:</Text>
                <Text className="text-xl font-bold text-green-600">
                  {currentUser.reputation}%
                </Text>
              </View>
              <View className="flex-row bg-transparent items-center space-x-2">
                <Text className="text-xl font-bold">Edit</Text>
                <FontAwesome name="edit" size={24} />
              </View>
            </View>
          </View>
          {/* <View>
          <Text className="font-bold mt-3 mb-2 text-xl">Location Map</Text>

          <MapView className="w-full h-28" />
        </View> */}
          <View>
            <Text className="font-bold mt-5 mb-2 text-xl">
              Reports Timeline
            </Text>

            <View className="w-full">
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
              />
            </View>
          </View>
          <View className="flex-row space-x-12 px-8 items-center justify-center relative mt-auto bottom-0">
            <Pressable onPress={showModal} className="items-center space-y-1">
              <FontAwesome name="phone" size={30} color={Colors.light.tint} />
              <Text className="text-sm">Quick call</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/report/")}
              className="items-center space-y-1 relative -top-6"
            >
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#3B94FD",
                }}
                className=" rounded-full p-2 border-dashed"
              >
                <View
                  style={{
                    // shadowColor: "bg-[#1c518d]",
                    shadowColor: "black",
                    shadowRadius: 10,
                    shadowOpacity: 1,
                  }}
                  className="bg-[#3B94FD] rounded-full p-3 shadow-lg shadow-"
                >
                  <MaterialIcons
                    name="record-voice-over"
                    size={30}
                    color="white"
                  />
                </View>
              </View>
              <Text className="text-sm">Send report</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/forum/")}
              className="items-center space-y-1"
            >
              <FontAwesome name="wechat" size={30} color={Colors.light.tint} />
              <Text className="text-sm">Forum</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "orange",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    marginTop: -10,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

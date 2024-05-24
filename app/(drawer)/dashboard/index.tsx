import React, { useEffect, useState } from "react";
import { Text, View } from "@/components/Themed";
import {
  Image,
  ScrollView,
  useColorScheme,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesomeIconName,
  MaterialCommunityIconsIconName,
} from "@/interfaces/icon-names.interfaces";
import { StyleSheet } from "react-native";
import { SecurityUnit, incidents } from "@/constants/IncidentTypes";
import { DocumentData } from "firebase/firestore";
import { getAllReports, getUserReports } from "@/services/report";

interface CardItem {
  key: string;
  iconName: FontAwesomeIconName | MaterialCommunityIconsIconName;
  count: number;
  label: string;
  color: string;
}

export default function DashboardHome() {
  const colorScheme = useColorScheme();
  // Reference to lottie
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const [securityUnits, setSecurityUnits] = useState<SecurityUnit[]>();

  const [errorMessage, setErrorMessage] = useState("");

  const [allReports, setAllReports] = useState<DocumentData[]>([]);
  const [userReports, setUserReports] = useState<DocumentData[]>([]);
  const [recentReports, setRecentReports] = useState<DocumentData[]>([]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const isFontAwesomeIconName = (name: string): name is FontAwesomeIconName => {
    return name in FontAwesome.glyphMap;
  };

  const data: CardItem[] = [
    {
      key: "1",
      iconName: "clock-o",
      count: recentReports.length ?? 0,
      label: "Recent incidents",
      color: "#D22419",
    },
    {
      key: "2",
      iconName: "warning",
      count: allReports.length ?? 0,
      label: "Security Alerts",
      color: "#FFC107",
    },
    {
      key: "3",
      iconName: "file-chart",
      count: userReports.length ?? 0,
      label: "No of reports",
      color: "#4CAF50",
    },
    {
      key: "4",
      iconName: "warning",
      count: 0,
      label: "Recent broadcasts",
      color: "#1976D2",
    },
    // Add more objects for additional cells
  ];

  const CardItem = ({ item }: { item: CardItem }) => (
    <View
      style={{
        shadowColor: "gray",
        shadowOpacity: 0.2,
        shadowRadius: 40,
      }}
      className="px-5 w-[45%]  py-8 shadow-xl rounded-xl m-2"
    >
      <View className="space-y-4">
        <View className="items-end">
          {isFontAwesomeIconName(item.iconName) ? (
            <FontAwesome name={item.iconName} size={30} color={item.color} />
          ) : (
            <MaterialCommunityIcons
              name={item.iconName}
              size={30}
              color={item.color}
            />
          )}
        </View>
        <View className="flex-row justify-between items-center space-x-3">
          <Text className="text-4xl">{item.count}</Text>
          <Text
            className={`text-right capitalize ${item.key === "3" && "w-2/3"}`}
          >
            {item.label}
          </Text>
        </View>
      </View>
    </View>
  );

  const incidentsWithIcons = [
    { title: "theft", icon: "security" },
    { title: "accident", icon: "ambulance" },
    { title: "Fire", icon: "fire" },
    { title: "cyber crime", icon: "shield-lock" },
    { title: "health emergency", icon: "hospital" },
    { title: "kidnapping", icon: "police-badge" },
  ];

  // Function to filter recent reports
  function filterRecentReports(reports: DocumentData[]): DocumentData[] {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const weekInSeconds = 7 * 24 * 60 * 60; // Number of seconds in a week

    return reports.filter(
      (report) => now - report.createdAt.seconds <= weekInSeconds
    );
  }

  useEffect(() => {
    (async () => {
      const reports = await getAllReports();
      const userReports = await getUserReports();
      console.log("ALL REPORTS", reports);
      console.log("USER REPORTS", userReports);

      const recent = filterRecentReports(userReports);
      setRecentReports(recent);

      setAllReports(reports);
      setUserReports(userReports);
    })();
  }, []);

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
                  router.push("/(drawer)/dashboard/call");
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
        <View className="flex-1 -mt-14">
          <View className="">
            <FlatList
              data={data}
              renderItem={({ item }) => <CardItem item={item} />}
              numColumns={2}
              keyExtractor={(item) => item.key}
              contentContainerStyle={{
                padding: 10,
              }}
            />
          </View>
          <View className="flex-row items-center justify-between px-5 pb-3">
            <Text className="text-lg font-bold">Community report</Text>
            <Text>See more</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="py-5 space-y-5">
              {allReports.length > 0 ? (
                allReports.map((report, index) => (
                  <View
                    key={index}
                    style={{
                      shadowColor: "gray",
                    }}
                    className="shadow-xl rounded-xl p-3 mx-5 space-y-2"
                  >
                    <View className="flex-row items-center justify-between space-x-4 s">
                      <Image
                        resizeMode="cover"
                        className="h-16 w-16 rounded-xl"
                        src={
                          report.attachment ??
                          require("@assets/images/onboarding-image-1.png")
                        }
                      />
                      <View className="flex-1">
                        <Text className="capitalize font-bold text-lg">
                          {report.incidentType}
                        </Text>
                        <Text className="">{report.description}</Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between">
                      <View className="flex-row space-x-1">
                        <Text className="text-sm">News Validity:</Text>
                        <Text className="text-green-700 text-sm">
                          {report.senderReputaion}
                        </Text>
                      </View>
                      <Text className="text-sm font-bold">
                        {report.time}, {report.date}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="font-bold text-lg text-gray-500 text-center">
                  No reports yet
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
        <View className="flex-row space-x-12 px-8 items-center justify-center relative bottom-0">
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
    </>
  );
}

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

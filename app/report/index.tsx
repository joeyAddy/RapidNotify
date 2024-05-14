import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import {
  LocationGeocodedAddress,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
  LocationObject,
} from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ActivityIndicator, ProgressBar, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { createReport } from "@/services/report";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { SecurityUnit, incidents } from "@/constants/IncidentTypes";
import * as SecureStore from "expo-secure-store";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Timestamp } from "firebase/firestore";

export interface IndidentForm {
  incidentType: string;
  location: (LocationGeocodedAddress & LocationObject) | null;
  time: string;
  date: string;
  description: string;
  attachment: string;
}

const Report = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  const router = useRouter();
  // Get the current date
  const currentDate = new Date();

  // Format the date as a string (e.g., "May 14, 2024")
  const date = currentDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time as a string (e.g., "12:30 PM")
  const time = currentDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const [stringLocation, setStringLocation] = useState("");

  const [attachedFile, setAttachedFile] =
    useState<DocumentPicker.DocumentPickerResult>();

  const [securityUnits, setSecurityUnits] = useState<SecurityUnit[]>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const [uploadingPercent, setUploadingPercent] = useState<number>();

  const [form, setForm] = useState<IndidentForm>({
    incidentType: "",
    location: null,
    time: time,
    date: date,
    description: "",
    attachment: "",
  });

  const handleUploadAndGetUrl = async (
    file: Blob,
    folderName: string,
    type: string
  ) => {
    if (!file) return;
    const storage = getStorage();

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: type,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, folderName + Timestamp.now());
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setUploadingPercent(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setForm({ ...form, attachment: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    (async () => {
      const location = await getCurrentPositionAsync();

      const address = await reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setStringLocation(
        `   (latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}.)`
      );

      console.log("USER ADDRESS", address[0]);

      const finalLocation = {
        ...location,
        ...address[0],
      };

      if (address) {
        setForm({ ...form, location: finalLocation });
      }
    })();
  }, []);

  const incidentsWithIcons = [
    { title: "theft", icon: "security" },
    { title: "accident", icon: "ambulance" },
    { title: "Fire", icon: "fire" },
    { title: "cyber crime", icon: "shield-lock" },
    { title: "health emergency", icon: "hospital" },
    { title: "kidnapping", icon: "police-badge" },
  ];

  const handleAddAttachment = async () => {
    const attachment = await DocumentPicker.getDocumentAsync();
    console.log("ATTACHMENT", attachment);
    if (!attachment.canceled && attachment.assets.length > 0) {
      setAttachedFile(attachment);
      console.log("Starting upload");

      const fileUri = attachment.assets[0].uri;
      await fetch(fileUri)
        .then((response) => response.blob())
        .then(async (blob) => {
          // Use the blob
          console.log(blob);
          await handleUploadAndGetUrl(
            blob,
            "reportImages",
            attachment.assets[0].mimeType!
          );
        })
        .catch((error) => {
          console.error("Error fetching file:", error);
        });
    }
  };

  const handleSubmit = async () => {
    if (
      form.incidentType.trim().length < 1 ||
      form.description.trim().length < 1 ||
      form.attachment.trim().length < 1
    ) {
      Toast.show({
        type: "error",
        swipeable: true,
        autoHide: true,
        position: "top",
        topOffset: 40,
        text1: "All fields are important!",
        text2: "Please cross check and  fill every empty field.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport(form);

      Toast.show({
        type: "success",
        swipeable: true,
        autoHide: true,
        position: "top",
        topOffset: 40,
        text1: "You report has reached us.",
        text2: "Please stay calm while the authorities get to you",
      });
      if (securityUnits) {
        router.push({
          pathname: "/map/",
          params: { securityUnits: JSON.stringify(securityUnits) },
        });
      }
    } catch (error) {
      console.log("ERROR REPORTING", error);
      Toast.show({
        type: "error",
        swipeable: true,
        autoHide: true,
        position: "top",
        topOffset: 40,
        text1: "Something went wrong",
        text2: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <Text className="text-center text-xl text-orange-400 font-bold -mt-10">
        Please fill the form below
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-4 space-y-4 flex-1"
      >
        <View>
          <Text className="mb-2">Incident type</Text>
          <SelectDropdown
            data={incidentsWithIcons}
            onSelect={async (selectedItem, index) => {
              console.log(selectedItem, index);
              setForm({ ...form, incidentType: selectedItem.title });
              const incidentTypeWithDetails = incidents.find(
                (incident) => incident.type === selectedItem.title
              );

              setSecurityUnits(incidentTypeWithDetails?.securityUnits);
              await SecureStore.setItemAsync(
                "security-unit",
                JSON.stringify(incidentTypeWithDetails?.securityUnits)
              );
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View
                  style={{
                    ...styles.dropdownButtonStyle,
                    borderColor: form.incidentType !== "" ? "green" : "orange",
                    borderWidth: form.incidentType !== "" ? 2 : 1,
                  }}
                >
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
        </View>
        <View>
          <Text className="mb-2 text-green-700">Time (Autogenerated)</Text>
          <View className="border-2 border-green-700 rounded-md p-3">
            <Text>{time}</Text>
          </View>
        </View>
        <View>
          <Text className="mb-2 text-green-700">Date (Autogenerated)</Text>
          <View className="border-2 border-green-700 rounded-md p-3">
            <Text>{date}</Text>
          </View>
        </View>
        <View>
          <Text className="mb-2 text-green-700">Location (Autogenerated)</Text>
          <View className="border-2 border-green-700 rounded-md p-3">
            <Text>
              {form.location?.formattedAddress}{" "}
              {/* <Text className="font-bold text-sm">{stringLocation}</Text> */}
            </Text>
          </View>
        </View>
        <View>
          <Text className="mb-2">Description</Text>
          <TextInput
            mode="outlined"
            multiline={true}
            style={{ height: 150, textAlignVertical: "top" }}
            numberOfLines={7}
            placeholder="Briefly describe the incident"
            outlineColor={
              form.description.trim().length > 0 ? "green" : Colors.light.tint
            }
            activeOutlineColor={
              form.description.trim().length > 0 ? "green" : "red"
            }
            className="h-14 text-base font-semiboldr text-slate-600 bg-gray-50 px-2"
            outlineStyle={{ borderRadius: 5 }}
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            onFocus={scrollToBottom}
          />
        </View>
        <View>
          <Text className="mb-2">Attachment</Text>
          <Pressable
            onPress={handleAddAttachment}
            className={`${attachedFile?.assets ? "border-2 border-green-700 " : "border border-orange-400 "} rounded-md py-4 px-3 flex-row items-center justify-between space-y-2`}
          >
            <>
              {attachedFile?.assets ? (
                <Text>{attachedFile.assets[0].name}</Text>
              ) : (
                <Text>Upload an Attachment</Text>
              )}
              {uploadingPercent && uploadingPercent === 100 ? (
                <FontAwesome
                  name={attachedFile?.assets ? "thumbs-up" : "upload"}
                  size={24}
                  color="green"
                />
              ) : attachedFile ? (
                <ActivityIndicator size={24} color="blue" />
              ) : null}
            </>
            {uploadingPercent && uploadingPercent <= 99 ? (
              <ProgressBar progress={uploadingPercent} color="orange" />
            ) : null}
          </Pressable>
        </View>
      </ScrollView>
      <View className="pt-3 items-center">
        <TouchableOpacity
          // onPress={() => router.push("/map/")}
          onPress={handleSubmit}
          className="bg-orange-400 rounded-full justify-center h-14 items-center w-1/2"
        >
          {isSubmitting ? (
            <ActivityIndicator size={24} color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Report;
const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 5,
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

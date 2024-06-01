import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Searchbar } from "react-native-paper";
import { DocumentData } from "firebase/firestore";
import {
  addEmergencyContact,
  getAllUsers,
  getUserByUid,
  getUsersByLocationAndQuery,
  removeEmergencyContact,
} from "@/services/user";
import { useAtom } from "jotai";
import { UpdateCurrentUserAtom, currentUserAtom } from "@/store/user";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";

const EmergencyContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [contactLoadingStates, setContactLoadingStates] = useState<{
    [key: string]: { isAdding: boolean; isRemoving: boolean };
  }>({});
  const [allUsers, setAllUsers] = useState<DocumentData[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<DocumentData[]>(
    []
  );

  const [currentUser] = useAtom(currentUserAtom);
  const [_, updateCurrentUser] = useAtom(UpdateCurrentUserAtom);

  const updateContactLoadingState = (
    userId: string,
    loadingType: "isAdding" | "isRemoving",
    value: boolean
  ) => {
    setContactLoadingStates((prevStates) => ({
      ...prevStates,
      [userId]: {
        ...prevStates[userId],
        [loadingType]: value,
      },
    }));
  };

  const handleRemoveContact = async (user: DocumentData) => {
    if (!user) return;
    updateContactLoadingState(user.uid, "isRemoving", true);
    try {
      await removeEmergencyContact(currentUser.uid, user);

      const finalUserData = await getUserByUid(currentUser.uid);

      await updateCurrentUser(finalUserData);

      await SecureStore.setItemAsync(
        "userDetails",
        JSON.stringify(finalUserData)
      );

      // Remove the removed user from emergencyContacts array
      setEmergencyContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.uid !== user.uid)
      );
    } catch (error) {
      Toast.show({
        text1: "Something went wrong!",
        text2: "Please try again",
        swipeable: true,
        autoHide: true,
        topOffset: 40,
        position: "top",
        type: "error",
      });
    } finally {
      updateContactLoadingState(user.uid, "isRemoving", false);
    }
  };

  useEffect(() => {
    (async () => {
      if (searchQuery !== "") {
        try {
          setIsSearching(true);

          const users = await getUsersByLocationAndQuery(
            currentUser.location.region,
            searchQuery
          );

          console.log("USERS", users);

          setAllUsers(users);
        } catch (error) {
          console.log("Error fetching contacts");
        } finally {
          setIsSearching(false);
        }
      } else {
        setAllUsers([]);
      }
    })();
  }, [searchQuery]);

  useEffect(() => {
    (async () => {
      // Fetch details for each emergency contact
      const contactsDetailsPromises = currentUser.emergencyContacts.map(
        async (contactUid: string) => {
          return await getUserByUid(contactUid);
        }
      );

      const contactsDetails = await Promise.all(contactsDetailsPromises);

      // Filter out any null results
      const validContactsDetails = contactsDetails.filter(
        (contact) => contact !== null
      );

      setEmergencyContacts(validContactsDetails as DocumentData[]);
    })();
  }, [currentUser]);

  return (
    <View className="flex-1 p-4 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {currentUser.emergencyContacts.length > 0 ? (
            emergencyContacts.map((user: any) => (
              <View key={user.uid} className="flex-row space-x-3 items-center">
                <View className="items-center justify-center rounded-full h-12 w-12 border-2 p-1">
                  {currentUser.profilePhotoUrl !== "" ? (
                    <Image
                      className="h-full w-full rounded-full bg-black"
                      style={{
                        resizeMode: "contain",
                      }}
                      source={{
                        uri: currentUser.profilePhotoUrl,
                      }}
                    />
                  ) : (
                    <View className="h-full w-full rounded-full bg-orange-200 items-center justify-center">
                      <Text className="font-bold text-xl">
                        {user.fullName.slice(0, 1)}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-xl">{user.fullName}</Text>
                  <Text className="text-md font-thin">{user.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleRemoveContact(user);
                  }}
                >
                  {!contactLoadingStates[user.uid]?.isRemoving ? (
                    <MaterialCommunityIcons
                      name="account-remove"
                      color="red"
                      size={30}
                    />
                  ) : (
                    <ActivityIndicator size={24} color="#f97316" />
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View>
              <Text className="font-bold text-gray-300 my-4">
                Add people to see them here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EmergencyContacts;

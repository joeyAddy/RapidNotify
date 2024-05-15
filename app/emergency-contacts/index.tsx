import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Searchbar } from "react-native-paper";
import { DocumentData } from "firebase/firestore";
import { getAllUsers, getUsersByLocationAndQuery } from "@/services/user";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/user";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

const EmergencyContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<DocumentData[]>([]);

  const [currentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    (async () => {
      if (searchQuery === "") return;
      const users = await getUsersByLocationAndQuery(
        currentUser.city,
        searchQuery
      );

      console.log("USERS", users);

      setAllUsers(users);
    })();
  }, [searchQuery]);
  return (
    <View className="flex-1 p-4 bg-white">
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          borderRadius: 15,
          backgroundColor: "white",
          borderWidth: 1,
        }}
      />

      <ScrollView className="py-4" showsVerticalScrollIndicator={false}>
        {allUsers.length > 0 ? (
          <View className="flex-row space-x-3 items-center">
            <View>
              <Image
                source={require("@/assets/images/avatar.png")}
                className="h-10 w-10 rounded-full"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-xl">Lily Onyeka</Text>
              <Text className="text-md font-thin">LilyOnyeka@gmail.com</Text>
            </View>
            <View>
              <FontAwesome name="plus-circle" color="black" size={30} />
            </View>
          </View>
        ) : (
          <View>
            <Text className="font-bold text-gray-300 my-4">
              Your search result will here
            </Text>
          </View>
        )}
      </ScrollView>

      <ScrollView className="mt-8" showsVerticalScrollIndicator={false}>
        <Text className="font-bold text-lg">Added Contacts</Text>
        {currentUser.emergencyContacts.length > 0 ? (
          <View className="flex-row space-x-3">
            <Image
              source={require("@/assets/images/avatar.png")}
              className="h-10 w-10 rounded-full"
            />
            <View>
              <Text className="font-bold text-xl">Lily Onyeka</Text>
              <Text className="text-md font-thin">LilyOnyeka@gmail.com</Text>
            </View>
            <FontAwesome name="plus-circle" color="black" size={30} />
          </View>
        ) : (
          <View>
            <Text className="font-bold text-gray-300 my-4">
              Add people to see them here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EmergencyContacts;

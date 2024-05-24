import { atom } from "jotai";
import { getUserFromSecureStore } from "@/utils/getUserFromSecureStore";
import { ExpoPushToken } from "expo-notifications";

export const currentUserAtom = atom(getUserFromSecureStore());

export const UpdateCurrentUserAtom = atom(
  null,
  async (get, set, newUserDetails: any) => {
    // if (!newUserDetails) return;
    console.log("Updating current user", newUserDetails);
    set(currentUserAtom, newUserDetails);
  }
);

export const userPushTokenAtom = atom("");

export const UpdatePushTokentom = atom(null, async (get, set, token: any) => {
  // if (!token) return;
  console.log("Updating push utokenser", token);
  set(userPushTokenAtom, token);
});

const emergencyContactsAtom = atom([]);

export const updateEmergencyContacts = atom(
  null,
  async (get, set, newContact: any) => {
    // if (!newContact) return;
    console.log("Updating emergency contact", newContact);
    set(emergencyContactsAtom, newContact);
  }
);

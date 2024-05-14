import { atom } from "jotai";
import { getUserFromSecureStore } from "@/utils/getUserFromSecureStore";

export const currentUserAtom = atom(getUserFromSecureStore());

export const UpdateCurrentUserAtom = atom(
  null,
  async (get, set, newUserDetails: any) => {
    // if (!newUserDetails) return;
    console.log("Updating current user", newUserDetails);
    set(currentUserAtom, newUserDetails);
  }
);

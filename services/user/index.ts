import { db } from "@/firebaseConfig";
import { getUserFromSecureStore } from "@/utils/getUserFromSecureStore";
import {
  collection,
  DocumentData,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  Timestamp,
  QuerySnapshot,
  DocumentReference,
  FirestoreError,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

// Function to create a user in Firestore
export const createUser = async (user: DocumentData): Promise<void> => {
  try {
    const userData = {
      ...user,
      createdAt: Timestamp.now(),
    };
    const docRef: DocumentReference = await addDoc(
      collection(db, "users"),
      userData
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (error: unknown) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Function to get all users
export const getAllUsers = async (): Promise<DocumentData[]> => {
  try {
    const userRef = collection(db, "users");
    const querySnapshot: QuerySnapshot = await getDocs(userRef);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error: unknown) {
    console.error("Error getting users: ", error);
    throw error;
  }
};

// Function to get a user by UID
export const getUserByUid = async (
  uid: string
): Promise<DocumentData | undefined> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return undefined;
    }

    return querySnapshot.docs[0].data();
  } catch (error: unknown) {
    console.error("Error getting user by UID:", error);
    throw error;
  }
};

// Function to update a user by UID
export const updateUserByUid = async (
  uid: string,
  newData: Partial<DocumentData>
): Promise<void> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, newData);
    console.log("User updated successfully");
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Retrieves users from Firestore based on location, query text, and email, while excluding the current user and their emergency contacts.
 * @param {string} location - The location (e.g., city) to filter the users by.
 * @param {string} queryText - The query text to filter the users by (e.g., full name or email).
 * @returns {Promise<DocumentData[]>} A promise that resolves to an array of DocumentData representing the filtered users.
 */
export const getUsersByLocationAndQuery = async (
  location: string,
  queryText: string
): Promise<DocumentData[]> => {
  if (!location || !queryText) return [];
  try {
    // Retrieve the current user from secure storage
    const user = await getUserFromSecureStore();

    // Query the Firestore collection to get the current user's data
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    // Handle the case where the query does not return any documents
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    // Extract the current user's document and emergency contacts from the query result
    const userDoc = querySnapshot.docs[0];
    const userFromStore = await getDoc(userDoc.ref);
    const emergencyContacts = userFromStore.data()?.emergencyContacts || [];

    // Create a set of emergency contact UIDs for quick lookup
    const emergencyContactUids = new Set(emergencyContacts);

    // Reference to the Firestore collection of users
    const usersRef = collection(db, "users");

    // First, query by location and email
    const locationQuery = query(
      usersRef
      // where("location.city", "==", location)
    );

    const locationSnapshot = await getDocs(locationQuery);

    // Filter results manually by full name, email, and excluding emergency contacts
    const filteredUsers: DocumentData[] = [];
    locationSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log("User found", userData);

      if (
        (userData.fullName.toLowerCase().includes(queryText.toLowerCase()) ||
          userData.email.toLowerCase().includes(queryText.toLowerCase())) &&
        userData.uid !== user.uid &&
        !emergencyContactUids.has(userData.uid)
      ) {
        filteredUsers.push(userData);
      }
    });

    return filteredUsers;
  } catch (error) {
    console.error("Error getting users by location and query:", error);
    throw error;
  }
};

// Function to add an emergency contact to a user
export const addEmergencyContact = async (
  uid: string,
  newContact: DocumentData
): Promise<void> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    console.log("====================================");
    console.log("USERdsfgfvf", querySnapshot.docs[0].data());
    console.log("====================================");

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      emergencyContacts: arrayUnion(newContact.uid),
    });

    Toast.show({
      swipeable: true,
      text1: `${newContact.fullName} is now parts emergency contactss`,
      type: "success",
      text1Style: {},
      position: "top",
      topOffset: 40,
    });
  } catch (error: unknown) {
    console.error("Error adding emergency contact:", error);
    throw error;
  }
};

// Function to remove an emergency contact from a user
export const removeEmergencyContact = async (
  uid: string,
  contactToRemove: DocumentData
): Promise<void> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    console.log("====================================");
    console.log("USERdsfgfvf", querySnapshot.docs[0].data());
    console.log("====================================");

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      emergencyContacts: arrayRemove(contactToRemove.uid),
    });

    Toast.show({
      swipeable: true,
      text1: `${contactToRemove.fullName} has been removed from emergency contacts`,
      type: "success",
      text1Style: {},
      position: "top",
      topOffset: 40,
    });
  } catch (error: unknown) {
    console.error("Error removing emergency contact:", error);
    throw error;
  }
};

// Function to get users where isCommunityWatch is true and uid is not equal to currentUserUid
export const getCommunityWatchUsers = async (
  currentUserUid: string
): Promise<DocumentData[]> => {
  try {
    const usersRef = collection(db, "users");

    // Construct a query with isCommunityWatch
    const q = query(usersRef, where("isCommunityWatch", "==", true));

    const querySnapshot = await getDocs(q);
    const users: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().uid !== currentUserUid) {
        users.push(doc.data());
      }
    });

    return users;
  } catch (error) {
    console.error("Error getting community watch users:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

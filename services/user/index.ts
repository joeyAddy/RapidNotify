import { db } from "@/firebaseConfig";
import {
  collection,
  DocumentData,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Function to create a user in Firestore
export const createUser = async (user: any): Promise<void> => {
  try {
    const userData = {
      ...user,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
// Function to get all reports
export const getAllUsers = async (): Promise<DocumentData[]> => {
  const userRef = collection(db, "users");
  const querySnapshot = await getDocs(userRef);
  const users: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  return users;
};

export const getUserByUid = async (
  uid: string
): Promise<DocumentData | undefined> => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return undefined;
    }

    // Assuming there's only one document per UID
    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error) {
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
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    // Assuming there's only one document per UID
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, newData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

import { IndidentForm } from "@/app/report";
import { db } from "@/firebaseConfig";
import { getUserFromSecureStore } from "@/utils/getUserFromSecureStore";
import {
  collection,
  addDoc,
  Timestamp,
  DocumentData,
  getDocs,
  where,
  query,
} from "firebase/firestore";

export interface Location {
  city: string;
  coords: {
    speed: number;
    heading: number;
    altitude: number;
    latitude: number;
    longitude: number;
    altitudeAccuracy: number;
    accuracy: number;
  };
  country: string;
  district: string | null;
  formattedAddress: string;
  isoCountryCode: string;
  mocked: boolean;
  name: string;
  postalCode: string;
  region: string;
  street: string | null;
  streetNumber: string | null;
  subregion: string;
  timestamp: number;
  timezone: string | null;
}

export interface Report {
  attachment: string;
  createdAt: { seconds: number; nanoseconds: number };
  createdBy: string;
  date: string;
  description: string;
  incidentType: string;
  isFake: boolean;
  location: Location;
  senderReputation: number;
  time: string;
}

export const createReport = async (report: IndidentForm) => {
  const user = await getUserFromSecureStore();
  console.log("User from create report", user);

  const reportData = {
    createdAt: Timestamp.now(),
    createdBy: user.uid,
    senderReputaion: user.reputation,
    isFake: false,
    ...report,
  };
  try {
    const docRef = await addDoc(collection(db, "reports"), reportData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get reports created by a specific user
export const getUserReports = async (): Promise<DocumentData[]> => {
  const user = await getUserFromSecureStore();

  const reportsRef = collection(db, "reports");
  const q = query(reportsRef, where("createdBy", "==", user.uid));

  const querySnapshot = await getDocs(q);
  const reports: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    reports.push(doc.data());
  });
  return reports;
};

// Function to get all reports
export const getAllReports = async (): Promise<DocumentData[]> => {
  const reportsRef = collection(db, "reports");
  const querySnapshot = await getDocs(reportsRef);
  const reports: DocumentData[] = [];
  querySnapshot.forEach((doc) => {
    reports.push(doc.data());
  });
  return reports;
};

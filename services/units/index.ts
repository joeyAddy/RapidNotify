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
  getDoc,
  doc,
} from "firebase/firestore";

export const createUnit = async (type: string) => {
  const user = await getUserFromSecureStore();

  const unitData = {
    createdAt: Timestamp.now(),
    createdBy: user.uid,
    unitRepName: user.fullName,
    transitLocation: user.location,
    location: user.location,
    securityType: type,
    requests: [],
  };
  try {
    const docRef = await addDoc(collection(db, "units"), unitData);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getUnitById = async (
  unitId: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, "units", unitId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const unitData = docSnap.data();
      return unitData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

const getUnitsByLocation = async (
  location: string
): Promise<DocumentData[]> => {
  try {
    const unitsCollectionRef = collection(db, "units");
    const querySnapshot = await getDocs(unitsCollectionRef);

    const units: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      const unitData = doc.data();
      if (unitData.location.formattedAddress.includes(location)) {
        units.push(unitData);
      }
    });

    return units;
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
};

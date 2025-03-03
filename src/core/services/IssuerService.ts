import {
  IssuerApplication,
  IssuerApplicationWithStatus,
} from "../../types/Issuer";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/Firebase";

export const submitApplication = async (
  application: IssuerApplication,
  govtDocument: File
): Promise<boolean> => {
  try {
    const newDocRef = doc(collection(db, "applications"));
    const docId = newDocRef.id;

    const storageRef = ref(
      storage,
      `applications/${auth.currentUser?.uid}/${govtDocument.name}`
    );
    await uploadBytes(storageRef, govtDocument);

    const documentUrl = await getDownloadURL(storageRef);

    const applicationWithStatus: IssuerApplicationWithStatus = {
      ...application,
      aid: docId,
      status: "pending",
      govtDocument: documentUrl,
      uid: auth.currentUser?.uid || "",
    };

    await setDoc(newDocRef, applicationWithStatus);
    return true;
  } catch (error) {
    console.error("Error submitting application:", error);
    return false;
  }
};

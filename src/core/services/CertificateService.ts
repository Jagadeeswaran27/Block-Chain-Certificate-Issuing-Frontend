import { auth, db } from "../config/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Certificate } from "../../types/Certificate";

export const storeCertificate = async (
  userId: string,
  certificate: Certificate
): Promise<string> => {
  try {
    const userIssuedRef = collection(db, `users/${userId}/issued`);
    const docRef = await addDoc(userIssuedRef, certificate);
    return docRef.id;
  } catch (error) {
    console.error("Error storing certificate:", error);
    throw error;
  }
};

export const getUserIssuedCertificates = async (): Promise<Certificate[]> => {
  const userId = auth.currentUser?.uid;
  try {
    const userIssuedRef = collection(db, `users/${userId}/issued`);
    const querySnapshot = await getDocs(userIssuedRef);

    const certificates: Certificate[] = [];
    querySnapshot.forEach((doc) => {
      certificates.push(doc.data() as Certificate);
    });

    return certificates;
  } catch (error) {
    console.error("Error retrieving certificates:", error);
    throw error;
  }
};

export const getUserReceivedCertificates = async (
  recipientId: string
): Promise<Certificate[]> => {
  try {
    const allIssuedRef = collection(db, "users");
    const issuedCollections = await getDocs(allIssuedRef);

    const certificates: Certificate[] = [];

    for (const userDoc of issuedCollections.docs) {
      const userIssuedRef = collection(db, `users/${userDoc.id}/issued`);
      const recipientQuery = query(
        userIssuedRef,
        where("recipient", "==", recipientId)
      );
      const querySnapshot = await getDocs(recipientQuery);

      querySnapshot.forEach((doc) => {
        certificates.push(doc.data() as Certificate);
      });
    }

    return certificates;
  } catch (error) {
    console.error("Error retrieving received certificates:", error);
    throw error;
  }
};

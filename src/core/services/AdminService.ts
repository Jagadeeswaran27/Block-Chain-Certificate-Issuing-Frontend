import { IssuerApplicationWithStatus } from "../../types/Issuer";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/Firebase";
import { User } from "../../types/User";

export const fetchPendingApplications = async (): Promise<
  IssuerApplicationWithStatus[]
> => {
  try {
    const applicationsRef = collection(db, "applications");
    const pendingQuery = query(
      applicationsRef,
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(pendingQuery);

    const pendingApplications: IssuerApplicationWithStatus[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as IssuerApplicationWithStatus;
      pendingApplications.push(data);
    });

    return pendingApplications;
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return [];
  }
};
export const fetchRejectedApplications = async (): Promise<
  IssuerApplicationWithStatus[]
> => {
  try {
    const applicationsRef = collection(db, "applications");
    const pendingQuery = query(
      applicationsRef,
      where("status", "==", "rejected")
    );
    const querySnapshot = await getDocs(pendingQuery);

    const pendingApplications: IssuerApplicationWithStatus[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as IssuerApplicationWithStatus;
      pendingApplications.push(data);
    });

    return pendingApplications;
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return [];
  }
};
export const fetchApprovedApplications = async (): Promise<
  IssuerApplicationWithStatus[]
> => {
  try {
    const applicationsRef = collection(db, "applications");
    const pendingQuery = query(
      applicationsRef,
      where("status", "==", "approved")
    );
    const querySnapshot = await getDocs(pendingQuery);

    const pendingApplications: IssuerApplicationWithStatus[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as IssuerApplicationWithStatus;
      pendingApplications.push(data);
    });

    return pendingApplications;
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    return [];
  }
};

export const approveApplication = async (
  aid: string,
  uid: string
): Promise<boolean> => {
  try {
    const applicationRef = doc(db, "applications", aid);
    await setDoc(
      applicationRef,
      { status: "approved" } as IssuerApplicationWithStatus,
      { merge: true }
    );
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { type: "issuer" } as User, { merge: true });
    return true;
  } catch (error) {
    console.error("Error approving application:", error);
    return false;
  }
};
export const rejectApplication = async (aid: string): Promise<boolean> => {
  try {
    const applicationRef = doc(db, "applications", aid);
    await setDoc(
      applicationRef,
      { status: "rejected" } as IssuerApplicationWithStatus,
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error approving application:", error);
    return false;
  }
};

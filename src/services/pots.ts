import { db } from "@/config/firebase";
import { convertDate } from "@/lib/convertDate";
import { PotDepositTypes, PotDetailsFormTypes, PotsType } from "@/types/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const fetchPots = async (): Promise<PotsType[]> => {
  const querySnapshot = await getDocs(collection(db, "pots"));
  const fetchedData: PotsType[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    const convertedData = convertDate({ id: doc.id, ...docData });
    fetchedData.push(convertedData);
    console.log(`Document ${doc.id}:`, convertedData);
  });
  return fetchedData;
};

const fetchPot = async (id: string): Promise<PotsType | null> => {
  const docRef = doc(db, "pots", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    const convertedData = convertDate({ id: docSnap.id, ...docData });
    return convertedData as PotsType;
  }
  return null;
};

const updatePot = async (id: string, formData: PotDetailsFormTypes) => {
  const docRef = doc(db, "pots", id);
  await updateDoc(docRef, {
    name: formData.name,
    goal_amount: Number(formData.goal_amount),
    current_amount: Number(formData.current_amount),
    theme: formData.theme,
  });
};

const depositPot = async (id: string, formData: PotDepositTypes) => {
  const potRef = doc(db, "pots", id);
  const newCurrentAmount = formData.current_amount + formData.amount;
  await updateDoc(potRef, {
    current_amount: newCurrentAmount,
  });
};

const withdrawPot = async (
  id: string,
  amount: number,
  currentAmount: number
) => {
  const potRef = doc(db, "pots", id);
  const newCurrentAmount = currentAmount - amount;
  if (newCurrentAmount < 0) {
    throw new Error("Withdrawal amount exceeds current balance.");
  }
  await updateDoc(potRef, {
    current_amount: newCurrentAmount,
  });
};

export { fetchPots, fetchPot, updatePot, depositPot, withdrawPot };

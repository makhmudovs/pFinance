import { db } from "@/config/firebase";
import { convertDate } from "@/lib/convertDate";
import { TransactionDetailsFormTypes, TransactionsType } from "@/types/types";
import { collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";




const fetchTransactions = async (): Promise<TransactionsType[]> => {
  const querySnapshot = await getDocs(collection(db, "transactions"));
  const fetchedData: TransactionsType[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    const convertedData = convertDate({ id: doc.id, ...docData });
    fetchedData.push(convertedData);
    console.log(`Document ${doc.id}:`, convertedData);
  });
  return fetchedData;
};


const fetchTransaction = async (
  id: string
): Promise<TransactionsType | null> => {
  const docRef = doc(db, "transactions", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    const convertedData = convertDate({ id: docSnap.id, ...docData });
    return convertedData as TransactionsType;
  }
  return null;
};

const updateTransaction = async (id:string,formData: TransactionDetailsFormTypes) => {
  const docRef = doc(db, "transactions", id);
  await updateDoc(docRef, {
    name: formData.name,
    date: Timestamp.fromDate(new Date(formData.date)),
    category: formData.category,
    amount: Number(formData.amount),
    recurring: formData.recurring,
  });
};

export { fetchTransactions,fetchTransaction, updateTransaction };

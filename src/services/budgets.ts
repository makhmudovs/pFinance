import { db } from "@/config/firebase";
import { convertDate } from "@/lib/convertDate";
import { BudgetsType } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";

const fetchBudgets = async (): Promise<BudgetsType[]> => {
  const querySnapshot = await getDocs(collection(db, "budgets"));
  const fetchedData: BudgetsType[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    const convertedData = convertDate({ id: doc.id, ...docData });
    fetchedData.push(convertedData);
    console.log(`Document ${doc.id}:`, convertedData);
  });
  return fetchedData;
};

export { fetchBudgets };

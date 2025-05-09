import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Bills } from "@/components/overview/bills";
import { Budgets } from "@/components/overview/budgets";
import { OverviewAmt } from "@/components/overview/overview-amt";
import { Pots } from "@/components/overview/pots";
import { Transactions } from "@/components/overview/transactions";
import { useEffect, useState } from "react";

interface PotData {
  id: string;
  potName: string;
  potAmt: number;
}

interface FirestoreData {
  id: string;
  potName: string;
  potAmt: number;
  [key: string]: unknown;
}

export function Overview(){
  const [potData, setPotData] = useState<PotData[]>([
    { id: "1", potName: "Laptop", potAmt: 300 },
    { id: "2", potName: "Car", potAmt: 400 },
    { id: "3", potName: "House", potAmt: 500 },
  ]);
  const [data, setData] = useState<FirestoreData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, "testing"));
      const fetchedData: FirestoreData[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data() as FirestoreData;
        fetchedData.push({ id: doc.id, ...docData });
        console.log(`Document ${doc.id}:`, docData);
      });
      setData(fetchedData);

      // Update potData with Firestore data
      if (fetchedData.length > 0) {
        const firestorePots = fetchedData.map((doc) => ({
          id: doc.id,
          potName: doc.potName || "Unknown",
          potAmt: doc.potAmt || 0,
        }));
        setPotData(firestorePots);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching Firestore data:", err);
        if (err.message.includes("Missing or insufficient permissions")) {
          setError("You do not have permission to access this data. Please log in or contact support.");
        } else {
          setError("Failed to fetch data. Please try again later.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('data',data);

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="text-red-500">
      {error}
      <button onClick={getData} className="ml-2 text-blue-500 underline">
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10 mb-6">
        <OverviewAmt
          title="Current Balance"
          color="bg-black text-white dark:bg-white dark:text-black"
          amt={3200}
        />
        <OverviewAmt
          title="Income"
          color="bg-white text-black dark:bg-muted/50 dark:text-white"
          amt={1200}
        />
        <OverviewAmt
          title="Expenses"
          color="bg-white text-black dark:bg-muted/50 dark:text-white"
          amt={1200}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="col-span-1 lg:col-span-3">
          <Pots pots={potData} />
          <Transactions />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Budgets />
          <Bills />
        </div>
      </div>
    </div>
  );
};
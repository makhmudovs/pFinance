import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const convertDate = (firebaseObject: any): any => {
  if (!firebaseObject) return null;

  // Create a deep copy to avoid mutating the original object
  const result = Array.isArray(firebaseObject)
    ? [...firebaseObject]
    : { ...firebaseObject };

  for (const [key, value] of Object.entries(result)) {
    // Convert items inside arrays
    if (value && Array.isArray(value)) {
      result[key] = value.map((item: any) => convertDate(item));
    }

    // Convert inner objects
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = convertDate(value);
    }

    // Convert Firestore Timestamp to formatted date string
    if (value && value instanceof Timestamp) {
      const date = value.toDate();
      result[key] = format(date, "MMM d, yyyy"); // Format as "Jan 1, 2025"
    }
  }

  return result;
};
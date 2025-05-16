import { AuthError } from "firebase/auth";

export const getFirebaseErrorMessage = (error: AuthError | null): string => {
  console.log('error',error);
  if (!error) return "";

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please try again.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please try again later.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password.";
    case "duplicate-budget":
      return "This budget already exist plz add another category"
      ;
    default:
      return "An error occurred during authentication. Please try again.";
  }
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//dont expose this below  info , put it inside Envrorment variables.
const firebaseConfig = {
  apiKey: "AIzaSyDWHGwf3fHcW0CP6kJNNwd8pEl5qhSQJtA",
  authDomain: "zodtesting.firebaseapp.com",
  projectId: "zodtesting",
  storageBucket: "zodtesting.firebasestorage.app",
  messagingSenderId: "167523196971",
  appId: "1:167523196971:web:a7cb317065d6a8d769ca6e",
  measurementId: "G-YS1EBVMEP4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;

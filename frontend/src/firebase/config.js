import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  // Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const projectStorage = getStorage(app);

export { projectStorage }

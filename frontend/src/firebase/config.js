import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqrDtdx0l0XXPH2QJ6-q4a17dv-fmeKso",
  authDomain: "harbour-860f9.firebaseapp.com",
  projectId: "harbour-860f9",
  storageBucket: "harbour-860f9.appspot.com",
  messagingSenderId: "113546249057",
  appId: "1:113546249057:web:d682a013bba7e6bcd0bb20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const projectStorage = getStorage(app);

export { projectStorage }
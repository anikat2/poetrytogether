import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuGvq2R9tne2GqrwbwiiMJy-Pvsqbnv8I",
  authDomain: "poetry-e04f4.firebaseapp.com",
  databaseURL: "https://poetry-e04f4-default-rtdb.firebaseio.com",
  projectId: "poetry-e04f4",
  storageBucket: "poetry-e04f4.firebasestorage.app",
  messagingSenderId: "15678654524",
  appId: "1:15678654524:web:6b34042b0506a3bde11b39",
  measurementId: "G-HHCJFH85SH"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
   
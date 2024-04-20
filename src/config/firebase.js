// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBafqZxXpDmhyQgKJFPBa8BEZBED-IoY8c",
  authDomain: "group3-activty5-6.firebaseapp.com",
  databaseURL: "https://group3-activty5-6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "group3-activty5-6",
  storageBucket: "group3-activty5-6.appspot.com",
  messagingSenderId: "1065930611412",
  appId: "1:1065930611412:web:f66a39b4ab75207b4b3941",
  measurementId: "G-G4E2X9D3E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
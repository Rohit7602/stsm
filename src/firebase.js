import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnDazUpRDmNMYIF5V5GAZZeBO2Ovn0v6Q",
  authDomain: "save-time-save-money-a36f2.firebaseapp.com",
  databaseURL: "https://save-time-save-money-a36f2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "save-time-save-money-a36f2",
  storageBucket: "save-time-save-money-a36f2.appspot.com",
  messagingSenderId: "103361561282",
  appId: "1:103361561282:web:b0b5b63d581d2cfacaf15b",
  measurementId: "G-QTCFPJ5FPC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getFirestore(app); // Corrected from getFirestore to getStorage
const storage = getStorage(app);

export { auth, firestore, storage, db ,app};

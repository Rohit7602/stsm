import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAnDazUpRDmNMYIF5V5GAZZeBO2Ovn0v6Q",
  authDomain: "save-time-save-money-a36f2.firebaseapp.com",
  databaseURL:
    "https://save-time-save-money-a36f2-default-rtdb.asia-southeast1.firebasedatabase.app",
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
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export function permissionHandler() {
  console.log("Permission handler working");

  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        console.log("Permission granted");
        return getToken(messaging, {
          vapidKey:
            "BAo2r-3i9R7lLolDnY2C5EoRVnFzgNQnbECTIrQeoEbStEJyM9mcTXGHg0_BYpng6lrD3FD6V2j4MbQIJAE8F0A",
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("Client Token:", currentToken);
            } else {
              console.log("Failed to generate token");
            }
          })
          .catch((err) => console.error("Error getting token:", err));
      } else {
        console.log("User denied permission");
      }
    })
    .catch((err) => console.error("Error requesting permission:", err));
}

export function onMessageListener() {
  console.log("Function is working");
  onMessage(messaging, (payload) => {
    alert(`${payload.notification?.title}: ${payload.notification?.body}`);
  });
}

export { auth, firestore, storage, db, app, messaging };

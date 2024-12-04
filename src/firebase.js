import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

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

export async function permissionHandler() {
  // console.log("Permission handler working");

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // console.log("Permission granted");

      const currentToken = await getToken(messaging, {
        vapidKey:
          "BAo2r-3i9R7lLolDnY2C5EoRVnFzgNQnbECTIrQeoEbStEJyM9mcTXGHg0_BYpng6lrD3FD6V2j4MbQIJAE8F0A",
      });

      if (currentToken) {
        // console.log("Client Token:", currentToken);

        const docRef = doc(db, "User", "ti5NJbZ865UFK6iNb431iiHqCox1");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          if (!userData.token.includes(currentToken)) {
            await updateDoc(docRef, {
              token: arrayUnion(currentToken),
            });
          }
        }
      } else {
        console.log("Failed to generate token");
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

export function onMessageListener() {
  // console.log("Function is working");
  onMessage(messaging, (payload) => {
    alert(`${payload.notification?.title}: ${payload.notification?.body}`);
  });
}

export { auth, firestore, storage, db, app, messaging };

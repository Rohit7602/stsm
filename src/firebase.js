import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import {
  collection,
  getDocs,
  writeBatch,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

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


// const batchSize = 500; // Firestore allows a maximum of 500 writes per batch

// const batchUpdateTimestamps = async () => {
//   let lastDoc = null;
//   let totalUpdated = 0;

//   while (true) {
//     let ordersQuery = query(collection(db, "products"), limit(batchSize));

//     if (lastDoc) {
//       ordersQuery = query(
//         collection(db, "products"),
//         startAfter(lastDoc),
//         limit(batchSize)
//       );
//     }

//     const snapshot = await getDocs(ordersQuery);

//     if (snapshot.empty) break; // Stop when there are no more documents

//     const batch = writeBatch(db);
//     let count = 0;

//     snapshot.docs.forEach((orderDoc) => {
//       const orderData = orderDoc.data();
//       console.log('p')

//       if (orderData.created_at instanceof Timestamp) {
//         batch.update(doc(db, "products", orderDoc.id), {
//           created_at: orderData.created_at.toMillis(), // Convert Timestamp to milliseconds
//         });
//         count++;
//       }
//     });

//     // Commit the batch
//     if (count > 0) {
//       await batch.commit();
//       totalUpdated += count;
//       console.log(`Batch committed. Total updated: ${totalUpdated}`);
//     }

//     lastDoc = snapshot.docs[snapshot.docs.length - 1]; // Move to the next batch
//   }

//   console.log(`✅ Migration completed. Total updated orders: ${totalUpdated}`);
// };

// batchUpdateTimestamps();





export { auth, firestore, storage, db, app, messaging };

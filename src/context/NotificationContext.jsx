import { getMessaging } from "firebase/messaging";
import React, { createContext, useContext, useEffect, useState } from "react";
import { messaging, db } from "../firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState([]);
  const sendNotification = async (type) => {
    const serverKey =
      "AAAA8fySoyk:APA91bGHLjXYPx8D5P2kBZHzJ6BnJHL3-5sz4S2pK4U4Cg-9EsoluUI-h9Dj-HvuXz6lNgnTGbCAaMWC6adijWKysPTpSEhamRnMy5QRcn8_wE-_tYLz3gQ0fWx34unTnCReFIwDCwoY"; // Your server key from Firebase settings

    let notificationBody;

    if (type === "authorized") {
      notificationBody = {
        to: "c-oHe1A9SOGAaL1LLHYIbG:APA91bGcy4yQsOAuWgcbe3h29jBvlu5e_XqZJUq0k3T2Zocx9KA4LiC0vHhCVYejVQw6fS6-kbPkCJZubuvwtNe5aQcJTAlN-ekWGHtR-M943jYxJo-7s9ECv0Y0e2LPoFDV17P5YrQl", // You can change this to a specific token or topic
        notification: {
          title: "Authorization Status",
          body: "You are authorized!",
        },
      };
    } else if (type === "orderAccepted") {
      notificationBody = {
        to: "c-oHe1A9SOGAaL1LLHYIbG:APA91bGcy4yQsOAuWgcbe3h29jBvlu5e_XqZJUq0k3T2Zocx9KA4LiC0vHhCVYejVQw6fS6-kbPkCJZubuvwtNe5aQcJTAlN-ekWGHtR-M943jYxJo-7s9ECv0Y0e2LPoFDV17P5YrQl", // You can change this to a specific token or topic
        notification: {
          title: "Order Status",
          body: "Your order was accepted!",
        },
      };
    } else {
      alert("Invalid notification type");
      return;
    }

    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${serverKey}`,
      },
      body: JSON.stringify(notificationBody),
    });
    console.log(await response.body.values());
    // console.log(response.body.getReader());
    // console.log(response.body.pipeThrough());
    // console.log(response.body.pipeTo());
    // console.log(response.body.tee());
    if (response.ok) {
      alert("Notification sent successfully!");
    } else {
      alert("Failed to send notification");
    }
  };
  const fetchNotifications = async () => {
  
    try {
      const q = query(
        collection(db, "Notifications"),
        where("read", "==", false).where("receiverId"==="")
      );
      const querySnapshot = await getDocs(q);
      const notificationsArray = [];
      querySnapshot.forEach((doc) => {
        notificationsArray.push({ id: doc.id, ...doc.data() });
      });
      setCurrentNotifications(notificationsArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const ToggleNotification = () => {
    setShowNotification(!showNotification);
    fetchNotifications();
  };

  const CheckNotification = async () => {
    try {
      const readdata = await getDocs(query(collection(db, "Notifications")));
      readdata.forEach(async (document) => {
        if (!document.data().read) {
          const docRef = doc(db, "Notifications", document.id);
          await updateDoc(docRef, { read: true });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        sendNotification,
        ToggleNotification,
        showNotification,
        currentNotifications,
        CheckNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotification };

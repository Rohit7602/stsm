// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js");

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

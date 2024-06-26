import { createContext, useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";
const ComplainContext = createContext();

export function ComplainContextProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "Complaints"));
    // Setting up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(list);
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return <ComplainContext.Provider value={{ complaints }}>{children}</ComplainContext.Provider>;
}

export function UseComplaintsContext() {
  return useContext(ComplainContext);
}

import { createContext, useContext, useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";
const ComplainContext = createContext();

export function ComplainContextProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "Complaints"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(list);
    });
    return () => unsubscribe();
  }, []);

  return <ComplainContext.Provider value={{ complaints }}>{children}</ComplainContext.Provider>;
}

export function UseComplaintsContext() {
  return useContext(ComplainContext);
}

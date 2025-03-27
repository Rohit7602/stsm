import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where
} from "firebase/firestore";
import { db } from "../firebase";
import { useMemo } from "react";
import Loader from "../Components/Loader";
const CustomersContext = createContext();

export const useCustomerContext = () => {
  return useContext(CustomersContext);
};

export const CustomersProvider = ({ children }) => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial orders
  const fetchCustomers = async () => {
    setLoading(true);
    const orderQuery = query(
      collection(db, "customers"),
      where("is_customer", "==", true), // Filter orders where is_customer is true
      orderBy("created_at", "desc"),
      limit(100)
    );
    const querySnapshot = await getDocs(orderQuery);

    if (!querySnapshot.empty) {
      setCustomer(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }

    setLoading(false);
  };

  // Fetch next batch of orders
  const fetchMoreCustomers = async () => {
    if (!lastDoc || !hasMore || loading) return;

    setLoading(true);
    const nextQuery = query(
      collection(db, "customers"),
      where("is_customer", "==", true), // Filter orders where is_customer is true
      orderBy("created_at", "desc"),
      startAfter(lastDoc),
      limit(1500)
    );

    const querySnapshot = await getDocs(nextQuery);
    if (!querySnapshot.empty) {
      setCustomer((prev) => [
        ...prev,
        ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

    if (loading) {
      return <Loader />;
    }



  return (
    <CustomersContext.Provider
      value={{ customer, fetchMoreCustomers, loading, hasMore }}
    >
      {children}
    </CustomersContext.Provider>
  );
};

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";

const OrderContext = createContext();
export const useOrdercontext = () => {
  return useContext(OrderContext);
};

export const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial orders
  const fetchOrders = async () => {
    setLoading(true);
    const orderQuery = query(
      collection(db, "order"),
      orderBy("created_at", "desc"),
      limit(100)
    );
    const querySnapshot = await getDocs(orderQuery);


    if (!querySnapshot.empty) {
      setOrders(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }

    setLoading(false);
  };

  // Fetch next batch of orders
  const fetchMoreOrders = async () => {
    if (!lastDoc || !hasMore || loading) return;

    setLoading(true);
    const nextQuery = query(
      collection(db, "order"),
      orderBy("created_at", "desc"),
      startAfter(lastDoc),
      limit(100)
    );

    const querySnapshot = await getDocs(nextQuery);
    if (!querySnapshot.empty) {
      setOrders((prev) => [
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
    fetchOrders();
  }, []);

  const updateData = (updatedProduct) => {
    if (typeof updatedProduct === "object" && updatedProduct.id) {
      setOrders((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === updatedProduct.id
        );

        if (existingProductIndex !== -1) {
          const newData = [...prevData];
          newData[existingProductIndex] = {
            ...newData[existingProductIndex],
            ...updatedProduct,
          };
          return newData;
        } else {
          return [...prevData, updatedProduct];
        }
      });
    } else if (Array.isArray(updatedProduct)) {
      setOrders(updatedProduct);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <OrderContext.Provider
      value={{ orders, updateData, fetchMoreOrders, loading, hasMore }}
    >
      {children}
    </OrderContext.Provider>
  );
};

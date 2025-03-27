import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../Components/Loader";

const OrderContext = createContext();
export const useOrdercontext = () => {
  return useContext(OrderContext);
};

export const OrderContextProvider = ({ children }) => {
  const [ordersAll, setOrdersAll] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  // Fetch initial orders
  const fetchOrders = async () => {
    const orderQuery = query(
      collection(db, "order"),
      orderBy("created_at", "desc"),
      limit(100)
    );
    const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
      const newOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(newOrders);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setIsFiltering(false);
      setLoading(false);
    });

    return unsubscribe; // Clean up when the component unmounts
  };

  // Fetch next batch of orders
  const fetchMoreOrders = async () => {
    if (isFiltering || !lastDoc || !hasMore || loading) return;

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
    const unsubscribe = fetchOrders(); // Real-time listener

    return () => {
      unsubscribe(); // Clean up listener on component unmount
    };
  }, []);

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

  function getCreatedAtTimestamp(option, customStartDate, customEndDate) {
    const now = new Date();
    let startTime, endTime;

    switch (option) {
      case "yesterday":
        startTime = new Date(now.setDate(now.getDate() - 1));
        startTime.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)
        break;
      case "week":
        startTime = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startTime = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "six_months":
        startTime = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startTime = new Date(customStartDate);
          endTime = new Date(customEndDate);
          break;
        } else {
          return { start: null, end: null }; // Invalid custom date range
        }
      default:
        return { start: null, end: null }; // No filtering if invalid option
    }

    return {
      start: startTime.getTime(),
      end: endTime ? endTime.getTime() : null,
    };
  }

  async function fetchOrdersBasedQuery(
    assign_to,
    status,
    created_at_option,
    customStartDate,
    customEndDate
  ) {
    setLoading(true);
    console.log(assign_to, status, created_at_option);
    try {
      const ordersRef = collection(db, "order");
      let queryConstraints = [];

      if (assign_to) {
        queryConstraints.push(where("assign_to", "==", assign_to));
      }
      if (status) {
        queryConstraints.push(where("status", "==", status));
      }

      const { start, end } = getCreatedAtTimestamp(
        created_at_option,
        customStartDate,
        customEndDate
      );

      if (start) {
        queryConstraints.push(where("created_at", ">=", start)); // Filter for start time
      }
      if (end) {
        queryConstraints.push(where("created_at", "<=", end)); // Filter for end time (if custom date range)
      }

      // 🚀 If NO filters are provided, return (do nothing)
      if (queryConstraints.length === 0) {
        console.log("No filters provided. Skipping query.");
        return [];
      }

      // Execute the Firestore query with applied filters
      const q = query(ordersRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setOrders([...list]);
      setLoading(false);
      return list;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  // all orders fetched
  useEffect(() => {
    const fetchOrdersall = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, "order");
        const querySnapshot = await getDocs(ordersRef);

        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrdersAll(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersall();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <OrderContext.Provider
      value={{
        isFiltering,
        orders,
        updateData,
        fetchMoreOrders,
        loading,
        hasMore,
        fetchOrdersBasedQuery,
        setIsFiltering,
        fetchOrders,
        setLoading,
        ordersAll,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

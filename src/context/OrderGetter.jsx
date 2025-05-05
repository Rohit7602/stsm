import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
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
  const [ordersAll, setOrdersAll] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [orderAccordingDelivary, setOrderAccordingDelivary] = useState([])
  const [delivaryManId, setDelivaryManId] = useState('')
  // Fetch initial orders
  // const fetchOrders = async () => {
  //   const orderQuery = query(
  //     collection(db, "order"),
  //     orderBy("created_at", "desc"),
  //     limit(100)
      
  //   );
  //   const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
  //     const newOrders = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     setOrders(newOrders);
  //     setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //     setIsFiltering(false);
  //     setLoading(false);
  //   });

  //   return unsubscribe; // Clean up when the component unmounts
  // };

  // // Fetch next batch of orders
  // const fetchMoreOrders = async () => {
  //   if (isFiltering || !lastDoc || !hasMore || loading) return;

  //   setLoading(true);
  //   const nextQuery = query(
  //     collection(db, "order"),
  //     orderBy("created_at", "desc"),
  //     startAfter(lastDoc),
  //     limit(100)
  //   );
  //   const querySnapshot = await getDocs(nextQuery);
  //   if (!querySnapshot.empty) {
  //     setOrders((prev) => [
  //       ...prev,
  //       ...querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  //     ]);
  //     setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //   } else {
  //     setHasMore(false);
  //   }
  //   setLoading(false);
  // };
  // In OrderContextProvider.js

  
  const fetchOrders = async () => {
  try {
    setLoading(true);
    const orderQuery = query(
      collection(db, "order"),
      orderBy("created_at", "desc"),
      limit(100) // Increased initial batch size
    );
    
    const querySnapshot = await getDocs(orderQuery);
    const newOrders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setOrders(newOrders);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(newOrders.length >= 20); // Changed condition
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};

const fetchMoreOrders = async () => {
  if (loading || !lastDoc || !hasMore) return;

  try {
    setLoading(true);
    const nextQuery = query(
      collection(db, "order"),
      orderBy("created_at", "desc"),
      startAfter(lastDoc),
      limit(100) // Same as initial limit
    );

    const querySnapshot = await getDocs(nextQuery);
    const newOrders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setOrders(prev => [...prev, ...newOrders]);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(newOrders.length >= 20); // Same condition as initial
  } catch (error) {
    console.error("Error fetching more orders:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const unsubscribe = fetchOrders(); // Real-time listener

    return () => {
      unsubscribe(); // Clean up listener on component unmount
    };
  }, []);

  useEffect(() => {
    fetchOrders(); // No need to assign to a variable or return anything
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


  // Function to get the start and end timestamps based on the selected option
  function getCreatedAtTimestamp(option, customStartDate, customEndDate) {
    const now = new Date();
    let startTime, endTime;


    switch (option) {
      case "yesterday":
        startTime = new Date(now);
        startTime.setDate(now.getDate() - 1);
        startTime.setHours(0, 0, 0, 0);

        endTime = new Date(startTime);
        endTime.setHours(23, 59, 59, 999);
        break;

      case "week":
        startTime = new Date();
        startTime.setDate(now.getDate() - 7);
        startTime.setHours(0, 0, 0, 0);

        endTime = new Date();
        endTime.setHours(23, 59, 59, 999);
        break;

      case "month":
        startTime = new Date();
        startTime.setMonth(now.getMonth() - 1);
        startTime.setHours(0, 0, 0, 0);

        endTime = new Date();
        endTime.setHours(23, 59, 59, 999);
        break;

      case "six_months":
        startTime = new Date();
        startTime.setMonth(now.getMonth() - 6);
        startTime.setHours(0, 0, 0, 0);

        endTime = new Date();
        endTime.setHours(23, 59, 59, 999);
        break;

      case "custom":
        if (customStartDate && customEndDate) {
          const startTime = new Date(customStartDate);  // Custom Start Date
          const endTime = new Date(customEndDate);      // Custom End Date

          if (isNaN(startTime) || isNaN(endTime)) {
            console.error("Invalid custom dates:", customStartDate, customEndDate);
            return { start: null, end: null }; // Early return if invalid
          }

          // 👇 Fix: Set END time to 23:59:59.999 *BEFORE* taking .getTime()
          endTime.setHours(23, 59, 59, 999);

          const startMillis = startTime.getTime();
          const endMillis = endTime.getTime();

          console.log("Custom Start Time (ms):", startMillis);
          console.log("Custom End Time (ms):", endMillis);

          // Extra Fix: Make sure start is smaller than end
          const start = Math.min(startMillis, endMillis);
          const end = Math.max(startMillis, endMillis);

          return { start, end };
        } else {
          console.error("Custom dates are missing:", customStartDate, customEndDate);
          return { start: null, end: null };
        }
      default:
        return { start: null, end: null };
    }

    console.log(startTime.getTime(), endTime.getTime(), "startTime endTime");
    return {
      start: startTime.getTime(),
      end: endTime.getTime(),
    };
  }



  async function fetchOrdersBasedQuery(
    assign_to,
    status,
    created_at_option,
    customStartDate,
    customEndDate
  ) {
    setDelivaryManId(assign_to);
    setLoading(true);
    const { start, end } = getCreatedAtTimestamp(
      created_at_option,
      customStartDate,
      customEndDate
    );

    if (status === "PROCESSING") {
      console.log("Filtering PROCESSING for:", assign_to);

      // fetch deliveryman's territories
      const qs = await getDocs(collection(db, "Delivery"));
      const deliveryMen = qs.docs.map(d => ({ id: d.id, ...d.data() }));
      const matchedMan = deliveryMen.find(d => d.id === assign_to);
      const territories = matchedMan?.serviceArea?.flatMap(a => a.terretory) || [];

      if (territories.length) {
        let processingConstraints = [
          where("shipping.city", "in", territories),
          where("status", "==", "PROCESSING")
        ];

        // 🔥 Apply created_at date filter even for PROCESSING
        if (start) processingConstraints.push(where("created_at", ">=", start));
        if (end) processingConstraints.push(where("created_at", "<=", end));
        console.log(start, end, "start end")
        const processingQuery = query(collection(db, "order"), ...processingConstraints);
        console.log(processingQuery, "processingQuery")
        const snap = await getDocs(processingQuery);
        console.log(snap, "snap")
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setOrders([]);  // no territories → no orders
      }

      setLoading(false);
      return;
    }

    try {
      const ordersRef = collection(db, "order");
      let queryConstraints = [];
      queryConstraints.push(where("status", "==", status));

      queryConstraints.push(where("assign_to", "==", assign_to));


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
        ordersAll, setOrders,lastDoc
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};


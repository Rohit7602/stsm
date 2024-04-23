import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const OrderContext = createContext();

export const useOrdercontext = () => {
  return useContext(OrderContext);
};

export const OrderContextProvider = ({ children }) => {
  const [orders, setorders] = useState([]);
  const [isdatafetched, setIsDataFetched] = useState(false);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const snapshot = await getDocs((collection(db, 'order')));
        // snapshot.forEach((doc) => {
        //     list.push({ id: doc.id, ...doc.data() });
        //     setorders([...list])
        //     setIsDataFetched(true)

        // })
        const unsubscribe = onSnapshot(collection(db, 'order'), (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setorders([...list]);
          setIsDataFetched(true);
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (!isdatafetched) {
      fetchOrders();
    }
  }, [isdatafetched]);

  const memodata = useMemo(() => orders, [orders]);

  const updateData = (updatedProduct) => {
    if (typeof updatedProduct === 'object' && updatedProduct.id) {
      setorders((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === updatedProduct.id
        );

        if (existingProductIndex !== -1) {
          const newData = [...prevData];
          newData[existingProductIndex] = { ...newData[existingProductIndex], ...updatedProduct };
          return newData;
        } else {
          return [...prevData, updatedProduct];
        }
      });
    } else if (Array.isArray(updatedProduct)) {
      // Update the entire array
      setorders(updatedProduct);
    }
  };
  return (
    <OrderContext.Provider value={{ orders: memodata, updateData }}>
      {children}
    </OrderContext.Provider>
  );
};

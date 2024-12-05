import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

const productsContext = createContext();

export const useProductsContext = () => {
  return useContext(productsContext);
};

export const ProductsProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(productsList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  const updateProductData = (updatedProduct) => {
    if (typeof updatedProduct === "object" && updatedProduct.id) {
      setData((prevData) => {
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
      // Update the entire array
      setData(updatedProduct);
    }
  };

  // Function to add new data
  const addData = async (newProduct) => {
    try {
      updateProductData(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete data
  const deleteData = async (productId) => {
    try {
      setData((prevData) =>
        prevData.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <productsContext.Provider
      value={{
        productData: memoizedData,
        updateProductData,
        addData,
        deleteData,
      }}
    >
      {children}
    </productsContext.Provider>
  );
};

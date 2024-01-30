import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDocs, collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const productsContext = createContext();


export const useProductsContext = () => {
    return useContext(productsContext);
}



export const ProductsProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'products'));
                const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(productsList);
                console.log("data is fetched ")
                setIsDataFetched(true);
            } catch (error) {
                console.log(error);
            }
        };

        if (!isDataFetched) {
            fetchProducts();
        }

        const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
            const updatedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(updatedProducts);
        });

        return () => unsubscribe();
    }, [isDataFetched]);

    const memoizedData = useMemo(() => data, [data]);

    const updateData = (updatedProduct) => {
        if (typeof updatedProduct === 'object' && updatedProduct.id) {
            setData(prevData => {
                const existingProductIndex = prevData.findIndex(product => product.id === updatedProduct.id);

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
            setData(updatedProduct);
        }
    };

    // Function to add new data
    const addData = async (newProduct) => {
        try {
            updateData(newProduct);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to delete data
    const deleteData = async (productId) => {
        try {
            setData(prevData => prevData.filter(product => product.id !== productId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <productsContext.Provider value={{ data: memoizedData, updateData, addData, deleteData }}>
            {children}
        </productsContext.Provider>
    );
};

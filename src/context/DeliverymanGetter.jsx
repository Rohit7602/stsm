import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const DeliveryManContext = createContext()

export const UseDeliveryManContext = () => {
    return useContext(DeliveryManContext)
}

export const DeliverManContextProvider = ({ children }) => {
    // State for our global state.
    const [DeliveryManData, SetDeliveryManData] = useState([])
    useEffect(() => {
        const fetchservice = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'Delivery'));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                SetDeliveryManData([...list]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchservice()


    }, []);

    const memodata = useMemo(() => DeliveryManData, [DeliveryManData])

    // update data function 
    const updateDeliveryManData = (DeliveryManData) => {
        if (typeof DeliveryManData === 'object' && DeliveryManData.id) {
            SetDeliveryManData(prevData => {
                const existingProductIndex = prevData.findIndex(product => product.id === DeliveryManData.id);
                if (existingProductIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingProductIndex] = { ...newData[existingProductIndex], ...DeliveryManData };
                    return newData;
                } else {
                    return [...prevData, DeliveryManData];
                }
            });
        } else if (Array.isArray(DeliveryManData)) {
            // Update the entire array
            SetDeliveryManData(DeliveryManData);
        }
    };

    // Function to add new data
    const addDeliveryManData = async (DeliveryManData) => {
        try {
            updateDeliveryManData(DeliveryManData);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to delete data
    const deleteDeliveryManData = async (DeliveryManDataid) => {
        try {
            SetDeliveryManData(prevData => prevData.filter(deliverymandata => deliverymandata.id !== DeliveryManDataid));
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <DeliveryManContext.Provider value={{ DeliveryManData : memodata, updateDeliveryManData, deleteDeliveryManData, addDeliveryManData }}>
            {children}
        </DeliveryManContext.Provider>
    )
}
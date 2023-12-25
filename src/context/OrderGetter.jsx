import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';


const OrderContext = createContext()

export const useOrdercontext = () => {
    return useContext(OrderContext);
}

export const OrderContextProvider = ({ children }) => {
    const [orders, setorders] = useState([])
    const [isdatafetched, setIsDataFetched] = useState(false)
    useEffect(() => {
        const fetchOrders = async () => {
            let list = []
            try {
                const snapshot = await getDocs((collection(db, 'order')));
                snapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                    setorders([...list])
                    console.log("order is fetchData")
                    setIsDataFetched(true)
                })
            } catch (error) {
                console.error(error)
            }
        }
        if (!isdatafetched) {
            fetchOrders();
        }
    }, [isdatafetched])

    const memodata = useMemo(() => orders, [orders])
    return (
        <OrderContext.Provider value={{ orders: memodata }}>
            {children}
        </OrderContext.Provider>
    )
}

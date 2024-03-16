import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';


const CouponContext = createContext()

export const useCouponcontext = () => {
    return useContext(CouponContext);
}

export const CouponContextProvider = ({ children }) => {
    const [allcoupons, setcoupons] = useState([])
    const [isdatafetched, setIsDataFetched] = useState(false)
    useEffect(() => {
        const fetchCoupons = async () => {
            let list = []
            try {
                const snapshot = await getDocs((collection(db, 'Coupons')));
                snapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                    setcoupons([...list])
                    setIsDataFetched(true)

                })
            } catch (error) {
                console.error(error)
            }
        }
        if (!isdatafetched) {
            fetchCoupons();
        }
    }, [isdatafetched])

    const memodata = useMemo(() => allcoupons, [allcoupons])


    const updateCouponData = (updatedcoupon) => {
        if (typeof updatedcoupon === 'object' && updatedcoupon.id) {
            setcoupons(prevData => {
                const existingProductIndex = prevData.findIndex(product => product.id === updatedcoupon.id);

                if (existingProductIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingProductIndex] = { ...newData[existingProductIndex], ...updatedcoupon };
                    return newData;
                } else {

                    return [...prevData, updatedcoupon];
                }
            });
        } else if (Array.isArray(updatedcoupon)) {
            // Update the entire array
            setcoupons(updatedcoupon);
        }
    };


    return (
        <CouponContext.Provider value={{ allcoupons: memodata, updateCouponData }}>
            {children}
        </CouponContext.Provider>
    )
}

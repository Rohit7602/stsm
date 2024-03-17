import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { onSnapshot } from 'firebase/firestore';


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

        const unsubscribe = onSnapshot(collection(db, 'Coupons'), (querySnapshot) => {
            const updatedCoupons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setcoupons(updatedCoupons);
        });

        return () => unsubscribe();






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

    // Function to delete data
    const deleteCouponData = async (couponsId) => {
        try {
            setcoupons(prevData => prevData.filter(Coupon => Coupon.id !== couponsId));
        } catch (error) {
            console.error(error);
        }
    };

    const addCouponData = async (couponData) => {
        try {
            updateCouponData(couponData);
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <CouponContext.Provider value={{ allcoupons: memodata, addCouponData, updateCouponData, deleteCouponData }}>
            {children}
        </CouponContext.Provider>
    )
}

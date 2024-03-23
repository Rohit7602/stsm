import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { onSnapshot } from 'firebase/firestore';


const BrandContext = createContext()

export const useBrandcontext = () => {
    return useContext(BrandContext);
}

export const BrandContextProvider = ({ children }) => {
    const [allBrands, setBrands] = useState([])
    const [isdatafetched, setIsDataFetched] = useState(false)
    useEffect(() => {
        const fetchBrands = async () => {
            let list = []
            try {
                const snapshot = await getDocs((collection(db, 'Brands')));
                snapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                    setBrands([...list])
                    setIsDataFetched(true)
                })
            } catch (error) {
                console.error(error)
            }
        }
        if (!isdatafetched) {
            fetchBrands();
        }

        const unsubscribe = onSnapshot(collection(db, 'Brands'), (querySnapshot) => {
            const updatedCoupons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBrands(updatedCoupons);
        });

        return () => unsubscribe();

    }, [isdatafetched])

    const memodata = useMemo(() => allBrands, [allBrands])


    const updateBrandData = (updatebrand) => {
        if (typeof updatebrand === 'object' && updatebrand.id) {
            setBrands(prevData => {
                const existingProductIndex = prevData.findIndex(brand => brand.id === updatebrand.id);
                if (existingProductIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingProductIndex] = { ...newData[existingProductIndex], ...updatebrand };
                    return newData;
                } else {
                    return [...prevData, updatebrand];
                }
            });
        } else if (Array.isArray(updatebrand)) {
            // Update the entire array
            setBrands(updatebrand);
        }
    };

    // Function to delete data
    const deleteBrandData = async (BrandId) => {
        try {
            setBrands(prevData => prevData.filter(Coupon => Coupon.id !== BrandId));
        } catch (error) {
            console.error(error);
        }
    };

    const addBrandData = async (BrandData) => {
        try {
            updateBrandData(BrandData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <BrandContext.Provider value={{ allBrands: memodata, addBrandData, updateBrandData, deleteBrandData }}>
            {children}
        </BrandContext.Provider>
    )
}

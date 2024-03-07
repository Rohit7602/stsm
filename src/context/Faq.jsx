import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const FAQContext = createContext()
export const useFaqContext = () => {
    return useContext(FAQContext)
}

export const FaqProvider = ({ children }) => { 

    const [faq, setfaq] = useState([]);
    const [isdatafetched, setIsDataFetched] = useState(false)


    useEffect(() => {
        const fetchFAQ = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'FAQ'));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setfaq([...list]);
                setIsDataFetched(true)
            } catch (error) {
                console.log(error);
            }
        };
        if (!isdatafetched) {
            fetchFAQ()
        }

        const unsubscribe = onSnapshot(collection(db, 'FAQ'), (querySnapshot) => {
            const updatedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setfaq(updatedCategories);
        });

        return () => unsubscribe();
    }, [isdatafetched]);

    const memodata = useMemo(() => faq, [faq])


    const updatefAqData = (faq) => {
        if (typeof faq === 'object' && faq.id) {
            setfaq(prevData => {
                const existingProductIndex = prevData.findIndex(product => product.id === faq.id);
                if (existingProductIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingProductIndex] = { ...newData[existingProductIndex], ...faq };
                    return newData;
                } else {
                    return [...prevData, faq];
                }
            });
        } else if (Array.isArray(faq)) {
            // Update the entire array
            setfaq(faq);
        }
    };

    // Function to add new data
    const addfaq = async (faq) => {
        try {
            updatefAqData(faq);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to delete data
    const deletefaq = async (faqid) => {
        try {
            faq(prevData => prevData.filter(faqs => faqs.id !== faqid));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FAQContext.Provider value={{ faq: memodata, deletefaq, updatefAqData, addfaq }}>
            {children}
        </FAQContext.Provider>
    ); 




}


/** 
    const SubCategoriesContext = createContext();

export const useSubCategories = () => {
    return useContext(SubCategoriesContext);
};

export const SubCategoriesProvider = ({ children }) => {

    const [data, setData] = useState([]);
    const [isdatafetched , setIsDataFetched] = useState(false)


    useEffect(() => {
        const fetchDataSubCategories = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'sub_categories'));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setData([...list]);
                console.log("sub_categories is fetched ")
                setIsDataFetched(true)
            } catch (error) {
                console.log(error);
            }
        };
        if (!isdatafetched) {
            fetchDataSubCategories()
        }

        const unsubscribe = onSnapshot(collection(db, 'sub_categories'), (querySnapshot) => {
            const updatedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(updatedCategories);
        });

        return () => unsubscribe();
    }, [isdatafetched]);

    const memodata = useMemo(() => data, [data])

    // update data function 
    const updateSubData = (updatecategories) => {
        if (typeof updatecategories === 'object' && updatecategories.id) {
            setData(prevData => {
                const existingProductIndex = prevData.findIndex(product => product.id === updatecategories.id);
                if (existingProductIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingProductIndex] = { ...newData[existingProductIndex], ...updatecategories };
                    return newData;
                } else {

                    return [...prevData, updatecategories];
                }
            });
        } else if (Array.isArray(updatecategories)) {
            // Update the entire array
            setData(updatecategories);
        }
    };

    // Function to add new data
    const addData = async (newcategories) => {
        try {
            updateSubData(newcategories);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to delete data
    const deleteData = async (categoriesId) => {
        try {
            setData(prevData => prevData.filter(categories => categories.id !== categoriesId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SubCategoriesContext.Provider value={{ data: memodata, deleteData, updateSubData,addData }}>
            {children}
        </SubCategoriesContext.Provider>
    ); 
};
 */
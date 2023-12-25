
import  { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection,onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Import your Firebase configuration

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
    const updateData = (updatecategories) => {
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
            updateData(newcategories);
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
        <SubCategoriesContext.Provider value={{ data:memodata,deleteData,updateData,addData }}>
            {children}
        </SubCategoriesContext.Provider>
    );

    
};




const MainCategoriesContext = createContext();

export const useMainCategories = () => {
    return useContext(MainCategoriesContext);
}

export const MainCategoriesProvider = ({ children }) => {
    const [categoreis, setMainCategories] = useState([])
    const [ismaincategoriesfetched,setmaincategoryiesfetched] = useState(false)

    useEffect(() => {
        const getCategory = async () => {
            let categoreis_list = []
            try {
                const snapshot = await getDocs(collection(db, 'categories'))
                snapshot.forEach(element => {
                    categoreis_list.push({ id: element.id, ...element.data() })
                });
                setMainCategories([...categoreis_list]);
                console.log("categoreis  fetchData ")
                setmaincategoryiesfetched(true)
            } catch (error) {
                console.log(error)
            }
        }

        if (!ismaincategoriesfetched) {
            getCategory()
        }

        const unsubscribe = onSnapshot(collection(db, 'categories'), (querySnapshot) => {
            const updatedCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMainCategories(updatedCategories);
        });

        return () => unsubscribe();

    }, [ismaincategoriesfetched]);


    const memodata = useMemo(()=> categoreis,[categoreis])

    // update data function 
    const updateData = (updatecategories) => {
        if (typeof updatecategories === 'object' && updatecategories.id) {
            setMainCategories(prevData => {
                const existingcategoryIndex = prevData.findIndex(categoreis => categoreis.id === updatecategories.id);
                if (existingcategoryIndex !== -1) {
                    const newData = [...prevData];
                    newData[existingcategoryIndex] = { ...newData[existingcategoryIndex], ...updatecategories };
                    return newData;
                } else {

                    return [...prevData, updatecategories];
                }
            });
        } else if (Array.isArray(updatecategories)) {
            // Update the entire array
            setMainCategories(updatecategories);
        }
    };

    const addDataParent = async (categoreis) => {
        try {
            updateData(categoreis)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <MainCategoriesContext.Provider value={{ categoreis: memodata, updateData, addDataParent }}>
            {children}
        </MainCategoriesContext.Provider>
    )
}

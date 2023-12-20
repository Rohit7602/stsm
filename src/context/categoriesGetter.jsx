
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const SubCategoriesContext = createContext();

export const useSubCategories = () => {
    return useContext(SubCategoriesContext);
};

export const SubCategoriesProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchDataSubCategories = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'sub_categories'));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setData([...list]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDataSubCategories();
    }, []);

    return (
        <SubCategoriesContext.Provider value={{ data, setData }}>
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

    useEffect(() => {
        const getCategory = async () => {
            let categoreis_list = []
            try {
                const snapshot = await getDocs(collection(db, 'categories'))
                snapshot.forEach(element => {
                    categoreis_list.push({ id: element.id, ...element.data() })
                });
                setMainCategories([...categoreis_list]);
            } catch (error) {
                console.log(error)
            }
        }

        getCategory();
    }, []);

    return (
        <MainCategoriesContext.Provider value={categoreis}>
            {children}
        </MainCategoriesContext.Provider>
    )
}

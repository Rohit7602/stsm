import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Import your Firebase configuration

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

  const memodata = useMemo(() => data, [data]);

  // update data function
  const updateSubData = (updatecategories) => {
    if (typeof updatecategories === 'object' && updatecategories.id) {
      setData((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === updatecategories.id
        );
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

  return (
    <SubCategoriesContext.Provider value={{ data: memodata, updateSubData, addData }}>
      {children}
    </SubCategoriesContext.Provider>
  );
};

const MainCategoriesContext = createContext();

export const useMainCategories = () => {
  return useContext(MainCategoriesContext);
};

export const MainCategoriesProvider = ({ children }) => {
  const [categoreis, setMainCategories] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      let categoreis_list = [];
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        snapshot.forEach((element) => {
          categoreis_list.push({ id: element.id, ...element.data() });
        });
        setMainCategories([...categoreis_list]);

      } catch (error) {
        console.log(error);
      }
    };

    getCategory();

  }, []);

  const memodata = useMemo(() => categoreis, [categoreis]);

  // update data function
  const updateData = (updatecategories) => {
    if (typeof updatecategories === 'object' && updatecategories.id) {
      setMainCategories((prevData) => {
        const existingcategoryIndex = prevData.findIndex(
          (categoreis) => categoreis.id === updatecategories.id
        );
        if (existingcategoryIndex !== -1) {
          const newData = [...prevData];
          newData[existingcategoryIndex] = {
            ...newData[existingcategoryIndex],
            ...updatecategories,
          };
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
      updateData(categoreis);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainCategoriesContext.Provider value={{ categoreis: memodata, updateData, addDataParent }}>
      {children}
    </MainCategoriesContext.Provider>
  );
};

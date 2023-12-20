import { createContext, useContext, useEffect, useState } from "react";
import { getDocs , collection } from "firebase/firestore";
import { db } from "../firebase";

// const produtsContext = createContext()

// export const  useProductContext = () => {
//     return useContext(produtsContext)
// }

// export const produtsProvider = ({children}) => {
//     const [data, setData] = useState([])
//     useEffect(() => {
//         const fetchProducts =   async () => {
//             let products_list = []
//             try {
//                 const snapshot = await getDocs(collection(db, 'products'))
//                 snapshot.forEach((doc) => {
//                     products_list.push({id:doc.id , ...doc.data()})
//                 })
//                 setData([...products_list])
                
//             } catch (error) {
//                 console.log(error)
                
//             }
//         }
//         fetchProducts()
        
//     }, [])
    
//     return <produtsContext.Provider value={{data,setData}}>
//             {children}
//         </produtsContext.Provider>
    
// }


const productsContext = createContext();

export const useProductsContext = () => {
    return useContext(productsContext);
}

export const ProductsProvider = ({ children }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            let productsList = [];
            try {
                const snapshot = await getDocs(collection(db, 'products'));
                snapshot.forEach((doc) => {
                    productsList.push({ id: doc.id, ...doc.data() });
                });
                setData([...productsList]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchProducts();
    }, []);

    return <productsContext.Provider value={{ data, setData }}>
        {children}
    </productsContext.Provider>;
};

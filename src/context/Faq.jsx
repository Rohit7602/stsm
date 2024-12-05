import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const FAQContext = createContext();
export const useFaqContext = () => {
  return useContext(FAQContext);
};

export const FaqProvider = ({ children }) => {
  const [faq, setfaq] = useState([]);

  useEffect(() => {
    const fetchFAQ = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "FAQ"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setfaq([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFAQ();
  }, []);

  const memodata = useMemo(() => faq, [faq]);

  const updatefAqData = (faq) => {
    if (typeof faq === "object" && faq.id) {
      setfaq((prevData) => {
        const existingProductIndex = prevData.findIndex(
          (product) => product.id === faq.id
        );
        if (existingProductIndex !== -1) {
          const newData = [...prevData];
          newData[existingProductIndex] = {
            ...newData[existingProductIndex],
            ...faq,
          };
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
      faq((prevData) => prevData.filter((faqs) => faqs.id !== faqid));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FAQContext.Provider
      value={{ faq: memodata, deletefaq, updatefAqData, addfaq }}
    >
      {children}
    </FAQContext.Provider>
  );
};

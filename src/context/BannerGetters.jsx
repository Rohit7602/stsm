import { useState, useEffect, useMemo } from "react";
import { createContext, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const BannerGetterContext = createContext();

export const UseBannerData = () => {
  return useContext(BannerGetterContext);
};

export const BannerDataProvider = ({ children }) => {
  const [BannerData, SetBannerData] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const fetchDataBanner = async () => {
      try {
        unsubscribe = onSnapshot(collection(db, "Banner"), (querySnapshot) => {
          let list = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          SetBannerData([...list]);
        });
      } catch (error) {
        console.log(error);
      }
      
    };
    

    fetchDataBanner();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const deleteObjectByImageUrl = async (imageUrl) => {
    const updatedData = BannerData.map((section) => {
      if (section.data) {
        section.data = section.data.filter((item) => item.imgUrl !== imageUrl);
      }
      return section;
    });
    SetBannerData(updatedData);
  };

  const memodata = useMemo(() => BannerData, [BannerData]);

  return (
    <BannerGetterContext.Provider
      value={{ BannerData: memodata, deleteObjectByImageUrl, SetBannerData }}
    >
      {children}
    </BannerGetterContext.Provider>
  );
};

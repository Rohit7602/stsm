import { useState, useEffect, useMemo } from "react";
import { createContext, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

const BannerGetterContext = createContext();

export const UseBannerData = () => {
    return useContext(BannerGetterContext);
};

export const BannerDataProvider = ({ children }) => {
    const [BannerData, SetBannerData] = useState([]);
    const [isdatafetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        let unsubscribe;
        const fetchDataBanner = async () => {
            try {
                unsubscribe = onSnapshot(collection(db, 'Banner'), (querySnapshot) => {
                    let list = [];
                    querySnapshot.forEach((doc) => {
                        list.push({ id: doc.id, ...doc.data() });
                    });
                    SetBannerData([...list]);
                    setIsDataFetched(true);
                    console.log("banner data is fetched");
                });
            } catch (error) {
                console.log(error);
            }
        };

        if (!isdatafetched) {
            fetchDataBanner();
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isdatafetched]);

    const deleteObjectByImageUrl = async (imageUrl) => {
        const updatedData = BannerData.map((section) => {
            if (section.data) {
                section.data = section.data.filter((item) => item.imgUrl !== imageUrl);
            }
            return section;
        });
        SetBannerData(updatedData);
        console.log("Object deleted from context");
    };

    const memodata = useMemo(() => BannerData, [BannerData]);

    return (
        <BannerGetterContext.Provider value={{ BannerData: memodata, deleteObjectByImageUrl,SetBannerData }}>
            {children}
        </BannerGetterContext.Provider>
    );
};




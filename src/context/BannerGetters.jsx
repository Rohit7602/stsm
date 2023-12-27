import { useState, useEffect, useMemo } from "react";
import { createContext, useContext } from "react";
import { getDocs, collection } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { db, storage } from '../firebase'
import { getDownloadURL, ref } from "firebase/storage";

const BannerGetterContext = createContext()

export const UseBannerData = () => {
    return useContext(BannerGetterContext)
}


export const BannerDataProvider = ({ children }) => {
    const [BannerData, SetBannerData] = useState()
    const [isdatafetched, setIsDataFetched] = useState(false)
    // Function to get banner data.
    useEffect(() => {
        const fetchDataBanner = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'Banner'));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                SetBannerData([...list]);
                setIsDataFetched(true);
                console.log("banner data is fetched  ")
            } catch (error) {
                console.log(error);
            }
        }
        if (!isdatafetched) {
            fetchDataBanner()
        }
    }, [isdatafetched])

    const deleteObjectByImageUrl = async (imageUrl) => {
        // Find the object index based on imageUrl
        const updatedData = BannerData.map((section) => {
            if (section.data) {
                section.data = section.data.filter((item) => item.imgUrl !== imageUrl);
            }
            return section;
        });

        // Update the context with the modified data array
        SetBannerData(updatedData);

        // You may also want to delete the image from storage and Firestore here
        // ...

        console.log("Object deleted from context");
    };



    const memodata = useMemo(() => BannerData, [BannerData])

    return (
        <BannerGetterContext.Provider value={{ BannerData: memodata, deleteObjectByImageUrl }}>
            {children}
        </BannerGetterContext.Provider>
    )
}








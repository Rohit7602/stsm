// BannerDataFetcher.js
import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Replace with your actual Firebase config

const fetchDataFromFirestore = async (bannerType) => {
    const querySnapshot = await getDocs(collection(db, 'Banner'));
    let data = [];

    querySnapshot.forEach((doc) => {
        const bannerData = doc.data();
        if (bannerData.title === bannerType) {
            // Assuming 'title' is the field that distinguishes different banner types
            data = bannerData.data || [];
        }
    });

    return data;
};

export const UseBannerData = (bannerType) => {
    const [bannerData, setBannerData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataFromFirestore(bannerType);
            setBannerData(data);
        };

        fetchData();
    }, [bannerType]); // Fetch data whenever bannerType changes

    return bannerData;
};

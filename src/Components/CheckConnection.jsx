import React, { useEffect } from "react";
import { Detector } from 'react-detect-offline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckConnection = (props) => {
    useEffect(() => {
        const onlineHandler = () => {
            toast.dismiss();
        };

        const offlineHandler = () => {
            toast.error('No Internet Connection', {
                autoClose: false,
                toastId: 'offline-toast',
            });
        };

        window.addEventListener('online', onlineHandler);
        window.addEventListener('offline', offlineHandler);

        return () => {
            window.removeEventListener('online', onlineHandler);
            window.removeEventListener('offline', offlineHandler);
        };
    }, []);

    return (
        <>
            <ToastContainer />

            <Detector
                render={({ online }) => {
                    return online ? (
                        props.children
                    ) : null;
                }}
            />
        </>
    );
};

export default CheckConnection;

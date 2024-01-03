import React, { useEffect } from "react";
import { Detector } from 'react-detect-offline';
import nointernetimg from '../Images/Png/no-internet.png';

const CheckConnection = (props) => {
    // Preload the image to ensure it's available offline
    useEffect(() => {
        const image = new Image();
        image.src = nointernetimg;
    }, []);

    return (
        <>
            <Detector
                render={({ online }) => {
                    console.log('Online status:', online);

                    return online ? (
                        props.children
                    ) : (
                        <div style={{ paddingTop: '10px', textAlign: 'center' }}>
                            <img src={nointernetimg} alt="No Connection Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            <h1 style={{ marginBottom: '10px' }}>No Internet Connection</h1>
                            <h4 style={{ margin: '0' }}>Please Check Your Internet Connection</h4>
                        </div>
                    );
                }}
            />
        </>
    );
};

export default CheckConnection;


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
        <Detector
            render={({ online }) => {
                document.body.style.backgroundColor = online ? '' : '#3a3b39';

                return online ? (
                    props.children
                ) : (
                    <div style={{
                        paddingTop: '10px',
                        textAlign: 'center',
                        background: 'linear-gradient(to bottom right, yellow, red)',
                        padding: '20px',
                        borderRadius: '10px',
                        color: 'white',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <img src={nointernetimg} alt="No Connection" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        <h1 style={{ marginBottom: '10px' }}>No Internet Connection</h1>
                        <h4 style={{ margin: '0' }}>Please Check Your Internet Connection</h4>
                    </div>
                );
            }}
        />
    );
};

export default CheckConnection;

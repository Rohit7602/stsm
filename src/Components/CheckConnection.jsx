import React from "react";
import { Detector } from 'react-detect-offline'
import nointernetimg from  '../Images/Png/no-internet.png'
const CheckConnection = props => {
    return (
        <>
            <Detector
                render={
                    ({ online }) => (
                        online ? props.children :
                        // You can also use any other component here
                            <div style={{ paddingTop: '10px', textAlign: 'center' }}>
                                <img src={ nointernetimg } alt="No Connection Image" />
                                <h1 style={{ marginBottom: '10px', }}>No Internet Connection </h1>
                                <h4 style={{margin:'0'}} >Please Check your internet Connection </h4>

                            </div>
                    )
                
                } 
            
            
            />
        </>
    )
}

export default CheckConnection

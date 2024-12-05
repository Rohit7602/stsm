import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase'; // Assuming app is your initialized Firebase app instance

const database = getDatabase(app);

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatrooms, setChatrooms] = useState({});

    useEffect(() => {
        const chatroomsRef = ref(database, 'Chatrooms');
        const chatroomsListener = onValue(chatroomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setChatrooms(data);
            }
        });
        return () => {
            off(chatroomsRef, chatroomsListener);
        };
    }, []);

    return (
        <ChatContext.Provider value={{ chatrooms }}>
            {children}
        </ChatContext.Provider>
    );
};
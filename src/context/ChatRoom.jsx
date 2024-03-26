import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from '../firebase'; // Assuming app is your initialized Firebase app instance

const database = getDatabase(app);

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatrooms, setChatrooms] = useState({});
    const [chats, setChats] = useState({});

    useEffect(() => {
        const chatroomsRef = ref(database, 'Chatrooms');
        const chatroomsListener = onValue(chatroomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // setChatrooms(Object.keys(data));
                setChatrooms(data);
            }
        });
        // Cleanup function
        return () => {
            off(chatroomsRef, chatroomsListener);
        };
    }, []);

    // useEffect(() => {
    //     // Listen to changes in chatrooms and fetch chats for each chatroom
    //     const chatroomIds = Object.keys(chatrooms);
    //     chatroomIds.forEach((chatroomId) => {
    //         const chatsRef = ref(database, `Chatrooms/${chatroomId}/Chats`);
    //         const chatsListener = onValue(chatsRef, (snapshot) => {
    //             const data = snapshot.val();
    //             if (data) {
    //                 setChats((prevChats) => ({ ...prevChats, [chatroomId]: data }));
    //             }
    //         });

    //         // Cleanup function
    //         return () => {
    //             off(chatsRef, chatsListener);
    //         };
    //     });
    // }, [chatrooms]);


    // useEffect(() => {
    //     console.log("chatrooms is ", chatrooms)
    //     console.log("chat is ", chats)
    // }, [chatrooms, chats]);

    return (
        <ChatContext.Provider value={{ chatrooms, chats }}>
            {children}
        </ChatContext.Provider>
    );
};
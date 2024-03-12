import React, { createContext, useEffect, useState, useContext } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const AuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userSnapshot = await getDocs(query(collection(db, 'User'), where('uuid', '==', currentUser.uid)));
                const userData = userSnapshot.docs[0]?.data();
                setUserData(userData);
            } else {
                setUserData(null);
            }
        });

        return unsubscribe;
    }, []);

    console.log(userData)

    function loginUser(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logoutUser() {
        return signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ userData, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(AuthContext);
}

import React from 'react';
import loginSideimg from '../../Images/Png/login-side-img.png';
import { Link, useNavigate } from 'react-router-dom';
import { app, firestore, db } from '../../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'firebase/firestore';
import { useState } from 'react';

const auth = getAuth(app)


export default function Login(props) {

  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Fetch the user's data from Firestore using the provided email
      const userQuerySnapshot = await getDocs(query(collection(db, 'User'), where('Email', '==', email)));

      // Check if a user with the provided email exists in Firestore
      if (userQuerySnapshot.size === 1) {
        const userDoc = userQuerySnapshot.docs[0];

        // Check if the user is an admin
        if (userDoc.exists() && userDoc.data().is_admin) {
          // If the user is an admin, sign in with Firebase Authentication
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          // Store the admin status in localStorage
          localStorage.setItem('isAdmin', 'true');

          // Trigger the login function
          props.login();

          // Redirect to the dashboard or another page using the navigate function
          navigate('/dashbord');
        } else {
          // If the user is not an admin, show an error
          toast.error('User is not an admin', { position: toast.POSITION.TOP_CENTER });
        }
      } else {
        // If the user with the provided email does not exist, show an error
        toast.error('User not found', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      // Handle login error (e.g., display an error message)
      // Show a toast notification for the error
      toast.error('Invalid email or password', { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div className="min-vh- 100">
      <div className="row h-100 m-0">
        <div className="col-7 h-100 p-0">
          {/* <img className="w-100 min-vh-100" src={loginSideimg} alt="loginSideimg" /> */}
          <div className="login-side-bg"></div>
        </div>
        <div className="col-5">
          <div className="d-flex align-items-center justify-content-center h-100">
            <form className="login-form" action="">
              <h1 className="fs-lg fw-600 black">Log in to Stsm</h1>
              <p className="fs-sm pt-5">Enter your details below</p>
              <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                <input onChange={(e) => setEmail(e.target.value)} className="fs-sm fw-400 black w-100" type="text" placeholder="User Email" value={email} />
                <input value={password} onChange={(e) => setPassword(e.target.value)}
                  className="fs-sm fw-400 black w-100 mt-4"
                  type="password"
                  placeholder="Password"
                />
                <button onClick={handleLogin} className="loin-btn fs-sm fw-500 mt-5">
                  Log IN
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

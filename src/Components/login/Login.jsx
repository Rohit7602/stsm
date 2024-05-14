import React from "react";
import loginSideimg from "../../Images/Png/login-side-img.png";
import openEye from "../../Images/svgs/eye-open-icon.svg";
import colseEye from "../../Images/svgs/eye-close-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { app, firestore, db } from "../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import Loader from "../Loader";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUserAuth } from '../../context/Authcontext'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import 'firebase/firestore';
import { useState } from "react";
// const auth = getAuth(app);
export default function Login(props) {
  const [loading , setloading ] = useState(false)
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const { loginUser, logoutUser } = useUserAuth()

  const handleLogin = async (e) => {
    e.preventDefault();
    setloading(true)
    try {
      const { user } = await loginUser(email, password);
      const userSnapshot = await getDocs(query(collection(db, 'User'), where('uuid', '==', user.uid)));
      const userData = userSnapshot.docs[0]?.data();
      if (userData?.is_admin) {
        localStorage.setItem('isAdmin', 'true');
        navigate("");
        setloading(false)
      } else {
        await logoutUser()
        setloading(false)
        toast.error("User is not an admin", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      setloading(false)
      console.error("Error signing in:", error.message);
      // Show a toast notification for the error
      toast.error("Invalid email or password", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  if (loading) {
    return <Loader></Loader>
  } else {
    return (
      <>
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
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      className="fs-sm fw-400 black w-100"
                      type="text"
                      placeholder="User Email"
                      value={email}
                    />
                    <div className="d-flex align-items-center justify-content-between w-100 input mt-4">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="fs-sm fw-400 black w-100 w-100 border-0 p-0"
                        type={showPassword}
                        placeholder="Password"
                      />
                      <img
                        onClick={() =>
                          setShowPassword(
                            showPassword === "text" ? "password" : "text"
                          )
                        }
                        className="cursor_pointer"
                        src={showPassword === "text" ? openEye : colseEye}
                        alt="openEye"
                      />
                    </div>
                    <button
                      onClick={handleLogin}
                      className="loin-btn fs-sm fw-500 mt-5"
                    >
                      Log IN
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <ToastContainer />
          </div>
        </div>
      
      
      </>
    )
  }
}

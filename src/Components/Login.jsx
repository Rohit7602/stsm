import React from 'react';
import loginSideimg from '../Images/Png/login-side-img.png';
import { Link } from 'react-router-dom';

export default function Login() {
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
                <input className="fs-sm fw-400 black w-100" type="text" placeholder="User name" />
                <input
                  className="fs-sm fw-400 black w-100 mt-4"
                  type="password"
                  placeholder="Password"
                />
                <Link to="mainpanel">
                  <button className="loin-btn fs-sm fw-500 mt-5">Log IN</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

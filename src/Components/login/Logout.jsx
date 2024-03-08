import React, { useState } from "react";
import closeIcon from "../../Images/svgs/closeicon.svg";
import { NavLink } from "react-router-dom";

export default function Logout(props) {

  function handelLogout(){
    props.logout()
    props.setDeletPopup(false)
  }
  return (
    <div>
      {props.deletPopup ? <div className="bg_black_overlay z-3"></div> : null}
      <div
        className={`position-relative ${props.deletPopup === true ? "" : "d-none"}`}
      >
        <div className="Logout_popup">
          <div onClick={()=>props.setDeletPopup(false)} className="text-end">
            <img
              width={40}
              className="cursor_pointer"
              src={closeIcon}
              alt="closeIcon"
            />
          </div>
          <p className="fs-2sm fw-700 black mb-0 text-center">Logout</p>
          <p className="fs-sm fw-500 black text-center mt-4">
            Are you sure want to Logout
          </p>
          <div className="d-flex align-items-center justify-content-center gap-4 mt-4 pt-2">
            <button  onClick={()=>props.setDeletPopup(false)}  className="cancel_btn fs-sm fw-400 color_brown">
              Cancel
            </button>
            <NavLink onClick={handelLogout} to="/Login"  className="delete_btn">Logout</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

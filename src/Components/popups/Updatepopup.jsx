import React, { useState } from 'react';
import closeIcon from '../../Images/svgs/closeicon.svg';

export default function StatusPopup(props) {
  const { statusPopup, handelStatus, itemName } = props;

  const handelChangeStatus = () => {
    handelStatus();
    // Optionally, you can also hide the popup after deletion
    statusPopup(false); 
  };
  return (
    <>
      <div className="delete_popup">
        <div className="text-end">
          <img
            onClick={() => statusPopup(false)}
            width={40}
            className="cursor_pointer"
            src={closeIcon}
            alt="closeIcon"
          />
        </div>
        <p className="fs-2sm fw-700 black mb-0 text-center">Change Status</p>
        <p className="fs-sm fw-500 black text-center mt-4">
          Are you sure want to change status this {itemName}
        </p>
        <div className="d-flex align-items-center justify-content-center gap-4 mt-4 pt-2">
          <button
            className="cancel_btn fs-sm fw-400 color_brown"
            onClick={() => statusPopup(false)}>
            Cancel
          </button>
          <button className="delete_btn" onClick={handelChangeStatus}>
            Change
          </button>
        </div>
      </div>
    </>
  );
}

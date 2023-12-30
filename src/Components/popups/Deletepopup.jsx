import React, { useState } from 'react';
import closeIcon from '../../Images/svgs/closeicon.svg';

export default function Deletepopup(props) {
  const { showPopup, handleDelete, itemName } = props;
  let showdelPopup = props.showPopup;
  function handehidePopup() {
    showdelPopup(false);
  }

  const handleDeleteClick = () => {
    handleDelete();
    // Optionally, you can also hide the popup after deletion
    handehidePopup();
  };
  return (
    <>
      <div className="delete_popup">
        <div className="text-end">
          <img
            width={40}
            className="cursor_pointer"
            onClick={handehidePopup}
            src={closeIcon}
            alt="closeIcon"
          />
        </div>
        <p className="fs-2sm fw-700 black mb-0 text-center">Delete {itemName}</p>
        <p className="fs-sm fw-500 black text-center mt-4">
          Are you sure want to delete this {itemName}
        </p>
        <div className="d-flex align-items-center justify-content-center gap-4 mt-4 pt-2">
          <button className="cancel_btn fs-sm fw-400 color_brown" onClick={handehidePopup}>
            Cancel
          </button>
          <button className="delete_btn" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

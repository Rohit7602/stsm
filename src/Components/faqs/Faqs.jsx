import React, { useState } from 'react';
import faqIcon from '../../Images/svgs/ques-icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import deleteIcon from '../../Images/svgs/black-delete.svg';
import editIcon from '../../Images/svgs/pencil.svg';
export default function Faqs() {
  const [addQusPopup, setAddQusPopup] = useState(true);
  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100 mt-3 pt-1 px-1">
      {addQusPopup === true ? <div className="bg_black_overlay"></div> : null}
      {addQusPopup ? (
        <div className="addqus_popup">
          <div className="d-flex align-items-start">
            <p className="fs-sm fw-400 black">Quection </p>
            <textarea className="ques_input" rows="2" cols=""></textarea>
          </div>
        </div>
      ) : null}
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="fw-500  mb-0 black fs-lg">FAQs</h1>
        <button
          onClick={() => setAddQusPopup(true)}
          className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 px-sm-3  py-2 save_btn"
          type="button">
          <img src={faqIcon} alt="faqIcon" />
          <p className="fs-sm fw-400 black ms-2 mb-0">add your Quection’s</p>
        </button>
      </div>
      <div>
        <ol className="m-0 p-0 mt-3 pt-1">
          <li className="fs-sm fw-400 black mb-3 pb-1">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-sm fw-400 black m-0">What is [STSM ]?</p>
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton3"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img src={dropdownDots} alt="dropdownDots" />
                </button>
                <ul class="dropdown-menu faqs_dropdown" aria-labelledby="dropdownMenuButton3">
                  <li>
                    <div class="dropdown-item d-flex align-items-center cursor_pointer">
                      <img src={deleteIcon} alt="deleteIcon" />
                      <p className="m-0 ms-2">Delete Quection</p>
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item d-flex align-items-center cursor_pointer">
                      <img src={editIcon} alt="editIcon" />
                      <p className="m-0 ms-2">Edit Quction</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="m-0 ps-3">
              <li className="fs-sm fw-400 black">
                <span>- </span> [STSM] is a [brief description of your service]. We offer
                [description of services/features].
              </li>
            </ul>
          </li>
          <li className="fs-sm fw-400 black mb-3 pb-1">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-sm fw-400 black m-0">What is [STSM ]?</p>
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton3"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <img src={dropdownDots} alt="dropdownDots" />
                </button>
                <ul class="dropdown-menu faqs_dropdown" aria-labelledby="dropdownMenuButton3">
                  <li>
                    <div class="dropdown-item d-flex align-items-center cursor_pointer">
                      <img src={deleteIcon} alt="deleteIcon" />
                      <p className="m-0 ms-2">Delete Quection</p>
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item d-flex align-items-center cursor_pointer">
                      <img src={editIcon} alt="editIcon" />
                      <p className="m-0 ms-2">Edit Quction</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <ul className="m-0 ps-3">
              <li className="fs-sm fw-400 black">
                <span>- </span> [STSM] is a [brief description of your service]. We offer
                [description of services/features].
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}

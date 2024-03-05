import React, { useState } from 'react';
import faqIcon from '../../Images/svgs/ques-icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import deleteIcon from '../../Images/svgs/black-delete.svg';
import editIcon from '../../Images/svgs/pencil.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
export default function Faqs() {
  const [addQusPopup, setAddQusPopup] = useState(true);
  const [quse, setQns] = useState('');
  const [ans, setAns] = useState('');
  const [storeQusAns, setQusAns] = useState([]);

  function handelStoreQesAns() {
    if (quse !== '' && ans !== '') {
      setQusAns((prevState) => [...prevState, { qus: quse, ans: ans }]);
      setAddQusPopup(false);
      setQns('');
      setAns('');
    }
  }
  console.log(ans);
  // function handelStoreQesAns() {
  //   if (quse !== "" && ans !== "") {
  //     setQusAns((prevState) => ({
  //       qus: [...prevState.qus, quse],
  //       ans: [...prevState.ans, ans],
  //     }));
  //   }
  // }
  console.log(storeQusAns);
  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100 mt-3 pt-1 px-1">
      {addQusPopup === true ? <div className="bg_black_overlay"></div> : null}
      {addQusPopup ? (
        <div className="addqus_popup">
          <div className="d-flex align-items-center justify-content-between pb-4">
            <p className="m-0 fs-sm fw-400 black">Add Question</p>
            <img
              onClick={() => setAddQusPopup(false)}
              className="cursor_pointer"
              src={closeIcon}
              alt="closeIcon"
            />
          </div>
          <div className="d-flex align-items-start justify-content-between">
            <p className="fs-sm fw-400 black">Question </p>
            <textarea
              onChange={(e) => setQns(e.target.value)}
              className="ques_input"
              placeholder="text"
              rows="2"
              cols=""></textarea>
          </div>
          <div className="d-flex align-items-start justify-content-between mt-3 pt-1">
            <p className="fs-sm fw-400 black">Answer</p>
            <textarea
              onChange={(e) => setAns(e.target.value)}
              className="ques_input"
              rows="4"
              placeholder="text"
              cols=""></textarea>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
            <button className="fs-sm fw-400 black qes_reset_btn">Reset</button>
            <button onClick={handelStoreQesAns} className="fs-sm fw-400 black qes_save_btn">
              Save
            </button>
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
        <div className="m-0 p-0 mt-3 pt-1">
          {storeQusAns.map((item, index) => (
            <div key={index}>
              <div className="fs-sm fw-400 black mb-3 pb-1">
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fs-sm fw-400 black m-0">
                    {index + 1}. {item.qus}
                  </p>
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
                <div className="m-0">
                  <p className="fs-sm fw-400 black m-0">
                    <span className="pe-1">- </span> {item.ans}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

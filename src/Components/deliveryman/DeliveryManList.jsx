import React, { useState, useEffect } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import search from "../../Images/svgs/search.svg";
import dropdown from "../../Images/svgs/dropdown_icon.svg";
import dropdownDots from "../../Images/svgs/dots2.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import pencil_icon from "../../Images/svgs/pencil.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import delete_icon from "../../Images/svgs/delte.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import closeicon from "../../Images/svgs/closeicon.svg";
import saveicon from "../../Images/svgs/saveicon.svg";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import Deletepopup from "../popups/Deletepopup";
import Updatepopup from "../popups/Updatepopup";

const DeliveryManList = () => {
  const { ServiceData, addServiceData, deleteServiceData, updateServiceData } =
    UseServiceContext();
  const [addsServicePopup, setAddsServicePopup] = useState(false);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [AreaName, SetAreaName] = useState("");
  const [postalCode, SetPostalCode] = useState();
  const [status, setStatus] = useState();
  const pubref = useRef();
  const hideref = useRef();

  const [selectedValue, setSelectedValue] = useState("1 Day");
  const [searchvalue, setSearchvalue] = useState("");

  const [order, setorder] = useState("ASC");
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...ServiceData];

    if (order === "ASC") {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateServiceData(sortedData);
  };
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = ServiceData.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [ServiceData]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = ServiceData.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateServiceData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...ServiceData];
    updatedData[index].checked = !ServiceData[index].checked;
    updateServiceData(updatedData);
  };
  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/
  if (loaderstatus) {
    return (
      <>
        <div className="loader">
          <h3 className="heading">Uploading Data... Please Wait</h3>
        </div>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">
                List of Delivery Mans
              </h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search for ServiceAreas..."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <Link
                to="addnewdeliveryman"
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              >
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Delivery Man
              </Link>
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 mt-3 bg-white product_shadow mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th
                        onClick={() => sorting("AreaName")}
                        className="py-3 ps-3 text-center cursor_pointer mx_160"
                      >
                        <div className="d-flex align-items-center gap-3 ">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleMainCheckboxChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                          <p className="fw-400 text-center   fs-sm black mb-0 ms-2">
                            Name
                            <span>
                              <img
                                className="ms-2 cursor_pointer"
                                width={20}
                                src={shortIcon}
                                alt="short-icon"
                              />
                            </span>
                          </p>
                        </div>
                      </th>
                      <th className="mx_160 text-center  px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Work type</h3>
                      </th>
                      <th className="mx_160 px-2 text-center ">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Total Order’s
                        </h3>
                      </th>
                      <th
                        onClick={() => sorting("ServiceStatus")}
                        className="mx_140 text-center  px-2 cursor_pointer"
                      >
                        <p className="fw-400 text-center  fs-sm black mb-0 ">
                          Status
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </p>
                      </th>
                      <th className="mx_160 text-center  px-2">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Service area
                        </h3>
                      </th>
                      <th className="mx_160 text-center  px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Contact</h3>
                      </th>
                      <th className="mx_160 px-2 me-1 text-center">
                        <h3 className="fs-sm fw-400  black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {ServiceData.filter((data) => {
                      return searchvalue.toLowerCase() === ""
                        ? data
                        : data.AreaName.toLowerCase().includes(searchvalue);
                    }).map((data, index) => {
                      return (
                        <tr className="product_borderbottom">
                          <td className="py-3 px-3 text-center  mx_160">
                            <div className="d-flex align-items-center gap-3 ">
                              <label class="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={data.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span class="checkmark"></span>
                              </label>
                              <div className="text-center ">
                                <p className="fw-400 fs-sm black mb-0  ">
                                  John Doe
                                </p>
                                <p className="fw-400 fs-xs black mb-0  ">
                                  ID 53663
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="mx_160 text-center  px-3">
                            <h3 className="fs-sm fw-400 black mb-0">
                              Full time
                            </h3>
                          </td>
                          <td className="mx_160 px-3 text-center ">
                            <h3 className="fs-sm fw-400 green mb-0">10</h3>
                          </td>
                          <td className="px-3 text-center  mx_140">
                            <h3 className="fs-sm fw-400 black mb-0 py-1 px-2 bg_green d-inline-block rounded-1">
                              Online
                            </h3>
                          </td>
                          <td className="px-3 text-center  mx_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              9 11 sector
                            </h3>
                          </td>
                          <td className="px-3 text-center  mx_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              +91 849858590
                            </h3>
                          </td>
                          <td className="text-center mw-90 px-3">
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_1994_4202)">
                                <path
                                  d="M8.66663 19.5C9.19706 19.5 9.70577 19.2893 10.0808 18.9142C10.4559 18.5391 10.6666 18.0304 10.6666 17.5C10.6666 16.9696 10.4559 16.4609 10.0808 16.0858C9.70577 15.7107 9.19706 15.5 8.66663 15.5C8.13619 15.5 7.62749 15.7107 7.25241 16.0858C6.87734 16.4609 6.66663 16.9696 6.66663 17.5C6.66663 18.0304 6.87734 18.5391 7.25241 18.9142C7.62749 19.2893 8.13619 19.5 8.66663 19.5ZM18.6666 19.5C19.1971 19.5 19.7058 19.2893 20.0808 18.9142C20.4559 18.5391 20.6666 18.0304 20.6666 17.5C20.6666 16.9696 20.4559 16.4609 20.0808 16.0858C19.7058 15.7107 19.1971 15.5 18.6666 15.5C18.1362 15.5 17.6275 15.7107 17.2524 16.0858C16.8773 16.4609 16.6666 16.9696 16.6666 17.5C16.6666 18.0304 16.8773 18.5391 17.2524 18.9142C17.6275 19.2893 18.1362 19.5 18.6666 19.5Z"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-miterlimit="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M10.7166 17.5H15.6666V7.1C15.6666 6.94087 15.6034 6.78826 15.4909 6.67574C15.3784 6.56321 15.2258 6.5 15.0666 6.5H1.66663M6.31663 17.5H4.26663C4.18783 17.5 4.10981 17.4845 4.03702 17.4543C3.96422 17.4242 3.89808 17.38 3.84236 17.3243C3.78665 17.2685 3.74245 17.2024 3.7123 17.1296C3.68215 17.0568 3.66663 16.9788 3.66663 16.9V12"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M2.66663 9.5H6.66663"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M15.6666 9.5H21.2766C21.3926 9.50003 21.5061 9.53367 21.6033 9.59685C21.7006 9.66003 21.7775 9.75005 21.8246 9.856L23.6146 13.884C23.6487 13.9605 23.6664 14.0433 23.6666 14.127V16.9C23.6666 16.9788 23.6511 17.0568 23.621 17.1296C23.5908 17.2024 23.5466 17.2685 23.4909 17.3243C23.4352 17.38 23.369 17.4242 23.2962 17.4543C23.2234 17.4845 23.1454 17.5 23.0666 17.5H21.1666M15.6666 17.5H16.6666"
                                  stroke="black"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_1994_4202">
                                  <rect
                                    width="24"
                                    height="24"
                                    fill="white"
                                    transform="translate(0.666626 0.5)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DeliveryManList;

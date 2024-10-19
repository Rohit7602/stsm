import React, { useState, useEffect } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import closeIcon from "../../Images/svgs/closeicon.svg";
import search from "../../Images/svgs/search.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import removeIcon from "../../Images/svgs/remove-icon.svg";
import rightDubbleArrow from "../../Images/svgs/dubble-arrow.svg";
import { doc, deleteDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import { ActionIcon, DeleteIcon } from "../../Common/Icon";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import axios from "axios";
import { useOrdercontext } from "../../context/OrderGetter";
import Deletepopup from "../popups/Deletepopup";

const DeliveryManList = () => {
  const { DeliveryManData, deleteDeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const { orders } = useOrdercontext();
  const [loaderstatus, setLoaderstatus] = useState(false);

  const [showLocation, setShowLocation] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [deliveryManId, setDeliveryManId] = useState(null);
  const [order, setorder] = useState("ASC");
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...DeliveryManData];

    if (order === "ASC") {
      sortedData.sort((a, b) => {
        const valueA = getProperty(a, col).toLowerCase();
        const valueB = getProperty(b, col).toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = getProperty(a, col).toLowerCase();
        const valueB = getProperty(b, col).toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateDeliveryManData(sortedData);
  };

  const getProperty = (obj, path) => {
    const keys = path.split(".");
    let result = obj;
    for (let key of keys) {
      result = result[key];
    }
    return result;
  };

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = DeliveryManData.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [DeliveryManData]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = DeliveryManData.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateDeliveryManData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...DeliveryManData];
    updatedData[index].checked = !DeliveryManData[index].checked;
    updateDeliveryManData(updatedData);
  };
  /*  *******************************
      Checbox  functionality end 
    ***********************************************/
  async function handleDelete() {
    try {
      await deleteDoc(doc(db, "Delivery", `${deliveryManId}`));
    } catch (error) {
      console.log(error);
    }
    setDeletePopup(false);
  }
  useEffect(() => {
    if (selectedId) {
      let Datas = DeliveryManData.filter((data) => data.id === selectedId);
      setFilterData(Datas);
    }
  }, [selectedId, DeliveryManData]);

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
        {deletePopup ? <div className="bg_black_overlay"></div> : null}
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">List of Delivery Mans</h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search in Delivery Mans..."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <Link
                to="/deliveryman/addnewdeliveryman"
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Delivery Man
              </Link>
            </div>
          </div>
          {/* categories details  */}
          {/* <button onClick={handelDelete} className="btn btn-danger mt-3">
            Delete
          </button> */}
          <div className="d-flex mt-3">
            <div className="p-3 bg-white product_shadow line_scroll">
              <div className="overflow_xl_scroll ">
                <div style={{ minWidth: "1240px" }}>
                  <table className="w-100">
                    <thead className="w-100 table_head">
                      <tr className="product_borderbottom">
                        <th
                          onClick={() => sorting("basic_info.name")}
                          className="py-3 ps-3  cursor_pointer ">
                          <div className="d-flex align-items-center gap-3 ">
                            <label class="check1 fw-400 fs-sm black mb-0">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleMainCheckboxChange}
                              />
                              <span class="checkmark"></span>
                            </label>
                            <p className="fw-400  fs-sm black mb-0 ms-2">
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
                        <th className="mx_160 px-2">
                          <h3 className="fs-sm fw-400 black mb-0">Work type</h3>
                        </th>
                        <th className="mx_140 ps-3">
                          <h3 className="fs-sm fw-400 black mb-0">Total Order’s</h3>
                        </th>
                        <th onClick={() => sorting("status")} className="mx_140 cursor_pointer">
                          <p className="fw-400 fs-sm black mb-0 ms-2">
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
                        <th className="mx_160 ps-3">
                          <h3 className="fs-sm fw-400 black mb-0">Verification</h3>
                        </th>
                        <th className="mx_160 ps-3">
                          <h3 className="fs-sm fw-400 black mb-0">Service area</h3>
                        </th>
                        <th className="mx_140 ps-3">
                          <h3 className="fs-sm fw-400 black mb-0">Contact</h3>
                        </th>
                        <th className="mx_140 p-3 me-1 text-center">
                          <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table_body">
                      {DeliveryManData.filter((data) => {
                        return searchvalue.toLowerCase() === ""
                          ? data
                          : data.basic_info.name.toLowerCase().includes(searchvalue);
                      }).map((data, index) => {
                        let orderCount = {};
                        for (let asignedOrder of orders) {
                          if (asignedOrder.status === "CONFIRMED") {
                            if (!orderCount[asignedOrder.assign_to]) {
                              orderCount[asignedOrder.assign_to] = 0;
                            }
                            orderCount[asignedOrder.assign_to]++;
                          }
                        }
                        console.log(orderCount);
                        return (
                          <tr key={index} className="product_borderbottom">
                            <td className="py-3 ps-3 ">
                              <div className="d-flex align-items-center gap-3 ">
                                <label class="check1 fw-400 fs-sm black mb-0">
                                  <input
                                    type="checkbox"
                                    checked={data.checked || false}
                                    onChange={() => handleCheckboxChange(index)}
                                  />
                                  <span class="checkmark"></span>
                                </label>
                                <Link
                                  to={`/deliveryman/deliverymanprofile/${data.d_id}`}
                                >
                                  <p className="fw-400 fs-sm black color_blue mb-0 ms-2">
                                    {data.basic_info.name}
                                  </p>
                                  <p className="fw-400 fs-xs black color_blue mb-0 ms-2">
                                    ID {data.d_id}
                                  </p>
                                </Link>
                              </div>
                            </td>
                            <td className="px-2 mx_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {data.job_info.shift}
                              </h3>
                            </td>
                            <td className="mx_140 ps-5">
                              <h3 className="fs-sm fw-400 black ">
                                {orderCount[data.id] ?? 0}
                              </h3>
                            </td>
                            <td className="px-2 mx_140">
                              <h3
                                className={`fs-sm fw-400 ${
                                  data.status === "online"
                                    ? "status_btn_green"
                                    : "status_btn_red"
                                } mb-0`}
                              >
                                {data.status}
                              </h3>
                              {/* <h3 className="fs-sm fw-400 status_btn_red mb-0">online</h3> */}
                            </td>
                            <td className="ps-3 mx_160">
                              <h3
                                className={`fs-sm fw-400 status_btn_green mb-0  ${
                                  data.profile_status === "NEW"
                                    ? " on_credit_bg"
                                    : data.profile_status === "APPROVED"
                                    ? "green stock_bg "
                                    : "status_btn_red"
                                } `}
                              >
                                {data.profile_status === "NEW"
                                  ? "PENDING"
                                  : data.profile_status}
                              </h3>
                              {/* <h3 className="fs-sm fw-400 status_btn_red mb-0">Rejected</h3> */}
                            </td>
                            <td className="ps-3 mx_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {data.is_verified === true &&
                                data.status === "online" &&
                                data.profile_status === "APPROVED" &&
                                data.serviceArea &&
                                data.serviceArea.length !== 0 ? (
                                  <button
                                    onClick={() => {
                                      setSelectedId(data.id);
                                      setShowLocation(true);
                                    }}
                                    className="service_area_show_btn fs-sm fw-400"
                                  >
                                    Show
                                  </button>
                                ) : (
                                  <button className="service_area_show_btn fs-sm fw-400">
                                    Not Available
                                  </button>
                                )}
                              </h3>
                            </td>
                            <td className=" mx_140 ps-3">
                              <h3 className="fs-sm fw-400 black mb-0 ">
                                +91 {data.basic_info.phone_no}
                              </h3>
                            </td>
                            <td className="text-center mx_140">
                              {data.is_verified === true &&
                              data.status === "online" &&
                              data.profile_status === "APPROVED" &&
                              data.hasOwnProperty("serviceArea") ? (
                                <div>
                                  <abbr title="Show Van">
                                    <Link to={`inventory/${data.uid}`}>
                                      <ActionIcon />
                                    </Link>
                                  </abbr>
                                  <button
                                    onClick={() => {
                                      setDeletePopup(true);
                                      setDeliveryManId(data.uid);
                                    }}
                                    className="ms-3 bg-white border-0"
                                  >
                                    <abbr title="Delete">
                                      <DeleteIcon />
                                    </abbr>
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <ActionIcon isNotActive={true} />
                                  <button
                                    onClick={() => {
                                      setDeletePopup(true);
                                      setDeliveryManId(data.uid);
                                    }}
                                    className="ms-3 bg-white border-0"
                                  >
                                    <abbr title="Delete">
                                      <DeleteIcon />
                                    </abbr>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <ToastContainer />
                  {/* <div className=""></div> */}
                </div>
              </div>
            </div>
            {showLocation ? (
              <div className="delivery_location_sidebar">
                {filterData.map((data) => {
                  return (
                    <>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <p className="fs-sm fw-600 black m-0">{data.basic_info.name}</p>
                          <p className="fs-xs fw-400 black m-0 mt-1">Service Area List</p>
                        </div>
                        <img
                          onClick={() => setShowLocation(false)}
                          style={{ transform: "rotate(-180deg)" }}
                          className="cursor_pointer"
                          src={rightDubbleArrow}
                          alt="rightDubbleArrow"
                        />
                      </div>

                      <div>
                        {data.serviceArea.map((area) => (
                          <>
                            <span
                              style={{
                                border: "1px solid #00000033",
                                width: "100%",
                                display: "inline-block",
                              }}></span>
                            <p className="fs-xs fw-600 black mt-2">
                              {area.area_name} ({area.pincode})
                            </p>
                            <div className="d-flex gap-2 flex-wrap">
                              {area.terretory.map((territory) => (
                                <div className="d-flex align-items-center service_locations gap-2">
                                  <p className="fs-xxs fw-400 black m-0">{territory}</p>
                                  <img
                                    className="ms-1 cursor_pointer"
                                    src={removeIcon}
                                    alt="removeIcon"
                                  />
                                </div>
                              ))}
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  );
                })}
                {/* <span
                  style={{
                    border: '1px solid #00000033',
                    width: '100%',
                    display: 'inline-block',
                  }}></span> */}
                {/* <div>
                  <p className="fs-xs fw-600 black mt-2">Barwala (125121)</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <div className="d-flex align-items-center service_locations gap-2">
                      <p className="fs-xxs fw-400 black m-0">Dabra Chowk</p>
                      <img className="ms-1 cursor_pointer" src={removeIcon} alt="removeIcon" />
                    </div>
                    <div className="d-flex align-items-center service_locations gap-2">
                      <p className="fs-xxs fw-400 black m-0">PLA</p>
                      <img className="ms-1 cursor_pointer" src={removeIcon} alt="removeIcon" />
                    </div>
                    <div className="d-flex align-items-center service_locations gap-2">
                      <p className="fs-xxs fw-400 black m-0">Red Square Market</p>
                      <img className="ms-1 cursor_pointer" src={removeIcon} alt="removeIcon" />
                    </div>
                  </div>
                </div> <>*/}
              </div>
            ) : null}
            {deletePopup && (
              <Deletepopup
                itemName={"Deleveryman"}
                handleDelete={handleDelete}
                showPopup={setDeletePopup}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default DeliveryManList;

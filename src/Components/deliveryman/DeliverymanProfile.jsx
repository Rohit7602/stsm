import React, { useState, useEffect, useRef } from "react";
import closeIcon from "../../Images/svgs/closeicon.svg";
import dropdownImg from "../../Images/svgs/dropdown_icon.svg";
import checkGreen from "../../Images/svgs/check-green-btn.svg";
import deleteiconWithBg from "../../Images/svgs/delete-icon-with-bg.svg";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import { updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../firebase";
import { UseServiceContext } from "../../context/ServiceAreasGetter";

import { collection, getDocs } from "firebase/firestore";
import { useOrdercontext } from "../../context/OrderGetter";
// import { collection, getDocs } from 'firebase/firestore';
const DeliverymanProfile = () => {
  const { DeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const { ServiceData } = UseServiceContext();
  const { id } = useParams();
  const [filterData, setfilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employTypeDropdown, setEmployTypeDropdown] = useState("");
  const [approvePopup, setApprovePopup] = useState(false);
  const [rejectPopup, setRejectPopup] = useState(false);
  const [jobType, setJobType] = useState("");
  const [joiningDate, setjoiningDate] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totaldailyOrders, setTotalDailyOrders] = useState(0);
  const [onSiteOrders, setOnSiteOrders] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [areaPinCode, setAreaPinCode] = useState(null);
  const { orders } = useOrdercontext();
  const [addMoreArea, setAddMoreArea] = useState([
    {
      pincode: "",
      area_name: "",
      terretory: [],
    },
  ]);
  const [addServiceAreaPopup, setAddServiceAreaPopup] = useState(false);
  const [selectarea, setSelectArea] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(
    Array(addMoreArea.length).fill(false)
  );
  const dropdownRef = useRef(null);

  function handlAddMoreAreas() {
    setAddMoreArea((prevareas) => [
      ...prevareas,
      {
        pincode: "",
        area_name: "",
        terretory: [],
      },
    ]);
  }

  function handleDeleteArea(index) {
    // setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
    setAddMoreArea((Prevarareas) => Prevarareas.filter((_, i) => i !== index));
  }

  function handlePincodeChange(index) {
    console.log(areaPinCode);
    const filterData = ServiceData.filter(
      (datas) => datas.PostalCode === addMoreArea[index].pincode
    );

    const areaName = filterData[0]?.AreaName || "";
    console.log(addMoreArea[index].pincode);
    console.log(filterData[0]?.AreaName);
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index
          ? {
              ...v,
              pincode: v.pincode,
              area_name: areaName,
              terretory: v.terretory,
            }
          : v
      )
    );
    // console.log("first");
  }

  function handleSelectedAreasChange(index, newSelectedAreas) {
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index ? { ...v, terretory: newSelectedAreas } : v
      )
    );
    console.log(addMoreArea);
  }

  const cities = ["Jaipur", "Sri Ganganagar", "Bikaner", "Jodhpur"];
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectArea((prevState) => [...prevState, value]);
    } else {
      setSelectArea((prevState) => prevState.filter((city) => city !== value));
    }
  };

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      } else {
        return !prevState;
      }
    });
  };

  const closeDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      } else {
        return false;
      }
    });
  };

  const handleProductInputClick = (index) => {
    if (dropdownOpen[index]) {
      closeDropdown(index);
    } else {
      // Close other dropdowns before opening the clicked one
      setDropdownOpen(Array(addMoreArea.length).fill(false));
      toggleDropdown(index);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function updateServiceAreas() {
    setLoading(true);
    if (addMoreArea.length !== 0) {
      const { pincode, area_name, terretory } = addMoreArea[0];
      if (!pincode || !area_name || terretory.length === 0) {
        // Show an alert if any field in addMoreArea is empty
        alert("Please fill in all fields for the service area");
        console.log("asdadfasf", pincode, area_name, terretory);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Delivery"));
        querySnapshot.forEach((doc) => {
          const deliveryData = doc.data();
          if (deliveryData.d_id === id) {
            updateDoc(doc.ref, { serviceArea: addMoreArea });
            updateDeliveryManData({
              id: doc.id,
              ...{ serviceArea: addMoreArea },
            });
            // Set loader status to false
            setLoading(false);
            // Show a success toast notification
            toast.success("Delivery Man ServiceArea  updated Successfully !", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        });
      } catch (error) {
        // Log any errors that occur during the update
        console.log("Error updating data:", error);
      }
    } else {
      const querySnapshot = await getDocs(collection(db, "Delivery"));
      querySnapshot.forEach((doc) => {
        const deliveryData = doc.data();
        if (deliveryData.d_id === id) {
          console.log(deliveryData);
          updateDoc(doc.ref, { serviceArea: [] });
          // Set loader status to false
          setLoading(false);
          // Show a success toast notification
          toast.success("Delivery Man ServiceArea  updated Successfully !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  }

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.d_id === id);
    const DeliveryManId = DeliveryManData.filter((item) => {
      if (item.d_id === id) {
        return item.id;
      }
    });
    setfilterData(DeliveryManDatas);
    if (DeliveryManDatas.length > 0) {
      const allAreas = [];
      DeliveryManDatas.forEach((data) => {
        if (data.serviceArea) {
          data.serviceArea.forEach((item) => {
            allAreas.push({
              area_name: item.area_name,
              pincode: item.pincode,
              terretory: item.terretory,
            });
          });
        }
      });
      setAddMoreArea(allAreas);
    }
    // let ordersCount = 0;
    // orders.forEach((order) => {
    //   if (order.assign_to === DeliveryManId[0].id) {
    //     ordersCount++;
    //   }
    // });
    // setTotalOrders(ordersCount);

    // let todayordersCount = 0;
    // orders.forEach((order) => {
    //   if (order.assign_to === DeliveryManId[0].id) {
    //     todayordersCount++;
    //   }
    //   const dateToCompare = new Date(order.transaction.date);
    //   const currentDate = new Date();
    //   if (dateToCompare.getTime() === currentDate.getTime()) {
    //    todayordersCount++;
    //   }
    // });
    // setTotalDailyOrders(todayordersCount);

    let ordersCount = 0;
    let todayordersCount = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    orders.forEach((order) => {
      if (order.assign_to === DeliveryManId[0].id) {
        ordersCount++;

        const dateToCompare = new Date(order.transaction.date);
        dateToCompare.setHours(0, 0, 0, 0);

        if (dateToCompare.getTime() === currentDate.getTime()) {
          todayordersCount++;
        }
      }
    });

    setTotalOrders(ordersCount);
    setTotalDailyOrders(todayordersCount);

    let onSiteOrdersCount = 0;
    orders.forEach((order) => {
      if (
        order.assign_to === DeliveryManId[0].id &&
        order.order_created_by === "Van"
      ) {
        onSiteOrdersCount++;
      }
    });
    setOnSiteOrders(onSiteOrdersCount);
    DeliveryManDatas.map((item) => {
      setWallet(item.wallet);
    });
    // setWallet(DeliveryManDatas[0].wallet);
  }, [DeliveryManData, id]);
  if (!id || filterData.length === 0) {
    return <Loader> </Loader>;
  }

  // useEffect(() => {
  //   if (filterData.length > 0) {
  //     const allAreas = [];
  //     filterData.forEach((data) => {
  //       if (data.serviceArea) {
  //         data.serviceArea.forEach((item) => {
  //           allAreas.push({
  //             area_name: item.area_name,
  //             pincode: item.pincode,
  //             terretory: item.terretory
  //           });
  //         });
  //       }
  //     });
  //     setAddMoreArea(allAreas);
  //   }
  // }, [filterData]);

  async function ApprovedDelivermanProfile(id) {
    try {
      setLoading(true);
      await updateDoc(doc(db, "Delivery", id), {
        is_verified: true,
        profile_status: "APPROVED",
        updated_at: new Date().toISOString(),
        job_info: {
          employement_type: employTypeDropdown,
          joining_date: new Date(joiningDate).toISOString(),
          shift: jobType,
        },
      });
      setLoading(false);
      updateDeliveryManData({
        id: id,
        is_verified: true,
        profile_status: "APPROVED",
        job_info: {
          employement_type: employTypeDropdown,
          joining_date: new Date(joiningDate).toISOString(),
          shift: jobType,
        },
      });
      toast.success("Verified Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoading(false);
      console.log("error is ", error);
    }
  }
  async function RejectDelivermanProfile(id) {
    try {
      setLoading(true);
      await updateDoc(doc(db, "Delivery", id), {
        is_verified: false,
        profile_status: "REJECTED",
        updated_at: new Date().toISOString(),
        Reason: rejectReason,
      });
      setLoading(false);
      updateDeliveryManData({
        id: id,
        is_verified: true,
        profile_status: "REJECTED",
      });
      toast.success("Rejected Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoading(false);
      console.log("error is ", error);
    }
  }

  async function handleCollectBalance() {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.d_id === id);
    setLoading(true);
    const washingtonRef = doc(db, "Delivery", DeliveryManDatas[0].id);
    await updateDoc(washingtonRef, {
      wallet: 0,
    });
    setLoading(false);
  }

  if (loading) {
    return <Loader />;
  }

  return filterData.map((datas, index) => {
    return (
      <div className="my-4">
        {approvePopup || rejectPopup || addServiceAreaPopup ? (
          <div className="bg_black_overlay"></div>
        ) : null}
        {approvePopup ? (
          <div className="approve_popup">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-2sm fw-400 black m-0">Approve Profile</p>
              <img
                onClick={() => setApprovePopup(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Joining Date
            </label>
            <br />
            <input
              id="date"
              onChange={(E) => setjoiningDate(E.target.value)}
              className="input w-100"
              type="date"
            />
            <br />
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Employment Type
            </label>
            <br />
            <div className="dropdown w-100">
              <button
                className="btn dropdown-toggle w-100 employ_dropdown"
                type="button"
                id="dropdownMenuButton3"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <p className="ff-outfit fw-400 fs_sm m-0 fade_grey">
                    {employTypeDropdown ? employTypeDropdown : "SALARIED"}
                  </p>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <ul
                className="dropdown-menu delivery_man_dropdown w-100"
                aria-labelledby="dropdownMenuButton3"
              >
                <li>
                  <div
                    onClick={() => setEmployTypeDropdown("SALARIED")}
                    className="dropdown-item py-2"
                    href="#"
                  >
                    <p className="fs-sm fw-400 balck m-0">SALARIED</p>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setEmployTypeDropdown("COMMISSION")}
                    className="dropdown-item py-2"
                    href="#"
                  >
                    <p className="fs-sm fw-400 balck m-0">COMMISSION</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 pt-2 pb-2">
              <div className="d-flex align-items-center w-100">
                <label class="check1 fw-400 fs-sm black mb-0  ms-3">
                  <input
                    onChange={() => setJobType("PARTTIME")}
                    checked={jobType === "PARTTIME"}
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                </label>
                <p className="fs-sm fw-400 black ms-3 ps-1 my-0">Part Time</p>
              </div>
              <div className="d-flex align-items-center w-100">
                <label class="check1 fw-400 fs-sm black mb-0 ">
                  <input
                    onChange={() => setJobType("FULLTIME")}
                    checked={jobType === "FULLTIME"}
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                </label>
                <p className="fs-sm fw-400 black ms-3 ps-1 my-0">Full Time</p>
              </div>
            </div>
            <div className="text-end">
              <button
                onClick={() => {
                  setApprovePopup(false);
                  ApprovedDelivermanProfile(datas.id);
                }}
                className="approve_btn mt-4"
              >
                <p className="m-0 text-white">Approve Profile</p>
              </button>
            </div>
          </div>
        ) : null}
        {rejectPopup ? (
          <div className="approve_popup">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-2sm fw-400 black m-0">Reject Profile</p>
              <img
                onClick={() => setRejectPopup(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Reason for rejection
            </label>
            <br />
            <textarea
              style={{ maxHeight: "90px" }}
              className="input w-100 outline_none resize_none"
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter a proper reason here..."
            ></textarea>
            <div className="text-end mt-3 pt-1">
              <button
                onClick={() => {
                  setRejectPopup(false);
                  RejectDelivermanProfile(datas.id);
                }}
                className="reject_delivery"
              >
                Reject profile
              </button>
            </div>
          </div>
        ) : null}
        {addServiceAreaPopup ? (
          <div className="delivery_service_area_popup">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-2sm fw-400 black m-0">Service Area</p>
                <p className="fs-xxs fw-400 black m-0 mt-1">
                  Choose the areas for Delivery Man Services
                </p>
              </div>
              <button
                className="fs-2sm fw-400 color_green border-0 bg-white"
                onClick={handlAddMoreAreas}
              >
                + Add More
              </button>
            </div>
            {addMoreArea.map((area, index) => {
              const pincode = area.pincode;
              const areasForPincode = ServiceData.filter(
                (service) => service.PostalCode === pincode
              ).map((service) => service.AreaList);
              return (
                <div className="mt-3 pt-1 d-flex justify-content-between align-items-end gap-3">
                  <div>
                    <p className="fs-xs fw-400 black m-0 pb-1">
                      Enter Pin Code
                    </p>
                    <div
                      style={{ minWidth: "180px", height: "43px" }}
                      className="product_input d-flex align-items-center mt-2 "
                    >
                      <input
                        required
                        type="number"
                        className="fade_grey fw-400 border-0 outline_none"
                        placeholder="Enter pin code"
                        id="pinCode"
                        value={area.pincode}
                        onChange={(e) => {
                          setAddMoreArea((prevsArareas) =>
                            prevsArareas.map((v, i) =>
                              i === index
                                ? {
                                    ...v,
                                    pincode: e.target.value,
                                  }
                                : v
                            )
                          );
                          setAreaPinCode(e.target.value);
                        }}
                      />
                      <button type="button" className="pincode_confirm_btn">
                        <img height={28} src={checkGreen} alt="checkGreen" />
                      </button>
                    </div>
                  </div>
                  <div className="w-100 position-relative">
                    <label className="fs-xs fw-400 mt-2 black" htmlFor="">
                      Select Area
                    </label>
                    <div
                      style={{ height: "43px", width: "365px" }}
                      className="product_input d-flex align-items-center justify-content-between mt-2 cursor_pointer"
                      onClick={() => {
                        handleProductInputClick(index);
                        handlePincodeChange(index);
                      }}
                    >
                      <p
                        className="fade_grey fs-xs fw-400 w-100 m-0 text-start  white_space_nowrap area_slider overflow-x-scroll"
                        required
                      >
                        {area.terretory.length !== 0
                          ? area.terretory.join(" , ")
                          : "Select area"}
                      </p>
                      <img src={dropdownImg} alt="" />
                    </div>
                    {dropdownOpen[index] && (
                      <div
                        ref={dropdownRef}
                        className="position-absolute z-3 area_dropdown delivery_man_dropdown"
                      >
                        {areasForPincode.map((cities, i) => (
                          <div key={i}>
                            {cities.map((city) => (
                              <div
                                className="d-flex align-items-center gap-3 py-1"
                                key={city}
                              >
                                <input
                                  id={city}
                                  type="checkbox"
                                  value={city}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const value = e.target.value;
                                    const newSelectedAreas = isChecked
                                      ? [...(area.terretory ?? []), value]
                                      : (area.terretory ?? []).filter(
                                          (selectedCity) =>
                                            selectedCity !== value
                                        );
                                    handleSelectedAreasChange(
                                      index,
                                      newSelectedAreas
                                    );
                                    // Log the selected areas
                                    // console.log('Selected Areas:', newSelectedAreas);
                                  }}
                                  checked={(area.terretory ?? []).includes(
                                    city
                                  )}
                                />
                                <label
                                  className="fs-xs fw-400 black w-100"
                                  htmlFor={city}
                                >
                                  {city}
                                </label>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <img
                    height={43}
                    className="cursor_pointer"
                    src={deleteiconWithBg}
                    alt="deleteiconWithBg"
                    onClick={() => handleDeleteArea(index)}
                  />
                </div>
              );
            })}
            <div className="d-flex align-items-center justify-content-end gap-3 mt-3 pt-1">
              <button
                onClick={() => {
                  // setAddMoreArea([{
                  //   pincode: '',
                  //   area_name: '',
                  //   terretory: []
                  // }])
                  setAddServiceAreaPopup(false);
                }}
                className="save_service_data fs-sm fw-400 white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  {
                    updateServiceAreas();
                    setAddServiceAreaPopup(false);
                  }
                }}
                className="save_service_data fs-sm fw-400 white"
              >
                Save Data
              </button>
            </div>
          </div>
        ) : null}
        <div className="d-flex justify-content-between align-items-center mt-4 mx-2">
          <h1 className="fw-500  mb-0 black fs-lg">
            {datas.basic_info.name === "" ? "N/A" : datas.basic_info.name}{" "}
            {datas.d_id}{" "}
          </h1>
          <div className="d-flex justify-content-center">
            <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
              {datas.profile_status === "NEW" ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button
                    onClick={() => setApprovePopup(true)}
                    className="approve_btn"
                  >
                    <p className="m-0 text-white">Approve Profile</p>
                  </button>
                  <button
                    onClick={() => setRejectPopup(true)}
                    className="reject_delivery"
                  >
                    Reject profile
                  </button>
                  {/* <button className="reset_border">
                  <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                    <svg
                      width="14"
                      height="18"
                      viewBox="0 0 14 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H11C11.5304 18 12.0391 17.7893 12.4142 17.4142C12.7893 17.0391 13 16.5304 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z"
                        fill="#D73A60"
                      />
                    </svg>
                    Delete Delivery Man
                  </button>
                </button> */}
                  {/* <svg
                  className="cursor_pointer"
                  width="44"
                  height="48"
                  viewBox="0 0 44 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="48" rx="10" fill="white" />
                  <path
                    d="M25 17.9997L28 20.9997M23 31.9997H31M15 27.9997L14 31.9997L18 30.9997L29.586 19.4137C29.9609 19.0386 30.1716 18.53 30.1716 17.9997C30.1716 17.4694 29.9609 16.9608 29.586 16.5857L29.414 16.4137C29.0389 16.0388 28.5303 15.8281 28 15.8281C27.4697 15.8281 26.9611 16.0388 26.586 16.4137L15 27.9997Z"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg> */}
                </div>
              ) : datas.profile_status === "APPROVED" ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12H15C15.2652 12 15.5196 11.8946 15.7071 11.7071C15.8946 11.5196 16 11.2652 16 11C16 10.7348 15.8946 10.4804 15.7071 10.2929C15.5196 10.1054 15.2652 10 15 10H7Z"
                          fill="#D73A60"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22 11C22 17.075 17.075 22 11 22C4.925 22 0 17.075 0 11C0 4.925 4.925 0 11 0C17.075 0 22 4.925 22 11ZM20 11C20 12.1819 19.7672 13.3522 19.3149 14.4442C18.8626 15.5361 18.1997 16.5282 17.364 17.364C16.5282 18.1997 15.5361 18.8626 14.4442 19.3149C13.3522 19.7672 12.1819 20 11 20C9.8181 20 8.64778 19.7672 7.55585 19.3149C6.46392 18.8626 5.47177 18.1997 4.63604 17.364C3.80031 16.5282 3.13738 15.5361 2.68508 14.4442C2.23279 13.3522 2 12.1819 2 11C2 8.61305 2.94821 6.32387 4.63604 4.63604C6.32387 2.94821 8.61305 2 11 2C13.3869 2 15.6761 2.94821 17.364 4.63604C19.0518 6.32387 20 8.61305 20 11Z"
                          fill="black"
                        />
                      </svg>
                      Block Profile
                    </button>
                  </button>
                  <button
                    onClick={() => setAddServiceAreaPopup(true)}
                    className="reset_border"
                  >
                    <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.8941 17.3939L13.5916 22.6979C13.3827 22.907 13.1346 23.0728 12.8615 23.186C12.5884 23.2992 12.2957 23.3574 12.0001 23.3574C11.7045 23.3574 11.4118 23.2992 11.1387 23.186C10.8657 23.0728 10.6176 22.907 10.4086 22.6979L5.10612 17.3939C4.20069 16.4886 3.48244 15.4138 2.99239 14.2308C2.50233 13.0479 2.25007 11.7801 2.25 10.4997C2.24993 9.21927 2.50206 7.95139 2.99198 6.76842C3.48191 5.58546 4.20004 4.51057 5.10537 3.60514C6.0107 2.69971 7.08551 1.98146 8.26842 1.49141C9.45133 1.00136 10.7192 0.749093 11.9996 0.749023C13.28 0.748954 14.5479 1.00108 15.7308 1.491C16.9138 1.98093 17.9887 2.69906 18.8941 3.60439C19.7996 4.50978 20.5179 5.58467 21.008 6.76768C21.4981 7.95069 21.7503 9.21865 21.7503 10.4991C21.7503 11.7796 21.4981 13.0476 21.008 14.2306C20.5179 15.4136 19.7996 16.4885 18.8941 17.3939ZM17.3041 5.19589C15.8974 3.78918 13.9895 2.9974 12.0001 2.9974C10.0107 2.9974 8.10283 3.78768 6.69612 5.19439C5.28941 6.6011 4.49913 8.50901 4.49913 10.4984C4.49913 12.4878 5.28941 14.3957 6.69612 15.8024L12.0001 21.1049L17.3041 15.8039C18.0008 15.1074 18.5534 14.2805 18.9304 13.3705C19.3075 12.4604 19.5015 11.485 19.5015 10.4999C19.5015 9.51481 19.3075 8.53938 18.9304 7.62931C18.5534 6.71924 18.0008 5.89236 17.3041 5.19589ZM12.0001 13.4999C11.6006 13.5089 11.2033 13.4381 10.8316 13.2914C10.4598 13.1448 10.1211 12.9254 9.83536 12.6461C9.54958 12.3668 9.32249 12.0332 9.16741 11.6649C9.01233 11.2966 8.9324 10.901 8.9323 10.5014C8.9322 10.1018 9.01193 9.70619 9.16683 9.33782C9.32172 8.96945 9.54865 8.63574 9.83429 8.35628C10.1199 8.07682 10.4585 7.85724 10.8302 7.71043C11.2019 7.56363 11.5991 7.49256 11.9986 7.50139C12.7825 7.51873 13.5284 7.84223 14.0767 8.40265C14.625 8.96307 14.9321 9.71588 14.9323 10.4999C14.9325 11.2839 14.6257 12.0369 14.0777 12.5976C13.5297 13.1583 12.784 13.4822 12.0001 13.4999Z"
                          fill="black"
                        />
                      </svg>
                      Update Service Area
                    </button>
                  </button>
                  <Link to={`/deliveryman/addnewdeliveryman/${datas.d_id}`}>
                    <svg
                      className="cursor_pointer"
                      width="44"
                      height="48"
                      viewBox="0 0 44 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="44" height="48" rx="10" fill="white" />
                      <path
                        d="M25 17.9997L28 20.9997M23 31.9997H31M15 27.9997L14 31.9997L18 30.9997L29.586 19.4137C29.9609 19.0386 30.1716 18.53 30.1716 17.9997C30.1716 17.4694 29.9609 16.9608 29.586 16.5857L29.414 16.4137C29.0389 16.0388 28.5303 15.8281 28 15.8281C27.4697 15.8281 26.9611 16.0388 26.586 16.4137L15 27.9997Z"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              ) : (
                <button className="reset_border">
                  <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.25 20.4L15.3 18.45L14.25 19.5L17.25 22.5L22.5 17.25L21.45 16.2L17.25 20.4ZM9 13.5H15V15H9V13.5ZM9 9.75H15V11.25H9V9.75ZM9 6H15V7.5H9V6Z"
                        fill="#D73A60"
                      />
                      <path
                        d="M12 21H4.5V18H6V16.5H4.5V12.75H6V11.25H4.5V7.5H6V6H4.5V3H18V15H19.5V3C19.5 2.175 18.825 1.5 18 1.5H4.5C3.675 1.5 3 2.175 3 3V6H1.5V7.5H3V11.25H1.5V12.75H3V16.5H1.5V18H3V21C3 21.825 3.675 22.5 4.5 22.5H12V21Z"
                        fill="black"
                      />
                    </svg>
                    Revise KYC
                  </button>
                </button>
              )}
            </div>
          </div>
        </div>
        {datas.profile_status === "APPROVED" ? (
          <div className="d-flex align-items-center text-center gap-4 mt-4 pb-2 flex-wrap">
            <div className="d-flex align-items-center text-center bg_light_orange">
              <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">Today Delivery</p>
                <p className="fs_24 fw_600 red m-0 mt-2">{totaldailyOrders}</p>
              </div>
              <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">On Site Orders</p>
                <p className="fs_24 fw_600 black m-0 mt-2">{onSiteOrders}</p>
              </div>
            </div>
            <div className="d-flex align-items-center text-center bg_light_orange">
              <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">Total Delivery</p>
                <p className="fs_24 fw_600 red m-0 mt-2">{totalOrders}</p>
              </div>
              {/* <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">On Site Orders</p>
                <p className="fs_24 fw_600 black m-0 mt-2">{onSiteOrders}</p>
              </div> */}
            </div>
            <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column bg_light_green">
              <p className="fs-sm fw-400 black m-0">Wallet Balance</p>
              <p className="fs_24 fw_600 green m-0 mt-2">₹ {wallet}</p>
              <button
                onClick={handleCollectBalance}
                className="fs_sm fw_600 color_blue m-0 mt-2 bg-transparent border-0"
              >
                Collect
              </button>
            </div>
            <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column bg_light_purple">
              <p className="fs-sm fw-400 black m-0">Van Capacity</p>
              <p className="progress_bar mb-0  mt-3">
                <span></span>
              </p>
              <div className=" mt-3">
                <Link to={`/deliveryman/inventory/${filterData[0].id}`}>
                  Show Van
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        <Row className="mt-3">
          <Col xl={6}>
            <div className="p-2 bg-white product_shadow">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Name
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.name === "" ? "N/A" : datas.basic_info.name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Date of Birth
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.dob === ""
                    ? "N/A"
                    : new Date(datas.basic_info.dob).toLocaleDateString()}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Phone
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.phone_no === ""
                    ? "N/A"
                    : datas.basic_info.phone_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Email
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.email === ""
                    ? "N/A"
                    : datas.basic_info.email}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Address
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.address === ""
                    ? "N/A"
                    : datas.basic_info.address}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  City
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.city === "" ? "N/A" : datas.basic_info.city}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  State{" "}
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.state === ""
                    ? "N/A"
                    : datas.basic_info.state}
                </p>
              </div>
            </div>
            <div className="p-2 bg-white product_shadow mt-4">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Emergency Number
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.phone_no === ""
                    ? "N/A"
                    : datas.basic_info.emergency_contact.phone_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Relative Name
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.name === ""
                    ? "N/A"
                    : datas.basic_info.emergency_contact.name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Relation
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.relationship === ""
                    ? "N/A"
                    : datas.basic_info.emergency_contact.relationship}
                </p>
              </div>
            </div>
          </Col>
          <Col xl={6}>
            <div className="p-2 bg-white product_shadow">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Job Title
                </p>
                <p className="fs-16 fw-400 black m-0">Delivery Man</p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Date of Joining
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.joining_date === ""
                    ? "N/A"
                    : new Date(
                        datas.job_info.joining_date
                      ).toLocaleDateString()}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Employment Type
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.employement_type === ""
                    ? "N/A"
                    : datas.job_info.employement_type}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Time Schedule
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.shift === "" ? "N/A" : datas.job_info.shift}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Document Number
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.kyc.document_number === ""
                    ? "N/A"
                    : datas.kyc.document_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Driving License{" "}
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.dl_number === ""
                    ? "N/A"
                    : datas.vehicle.dl_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Vehicle Reg. No.{" "}
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.vehicle_number === ""
                    ? "N/A"
                    : datas.vehicle.vehicle_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Vehicle Type
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.vehicle_type === ""
                    ? "N/A"
                    : datas.vehicle.vehicle_type}
                </p>
              </div>
            </div>
            <div className="p-2 bg-white product_shadow mt-4">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Bank Name
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.bank_name === "" ? "N/A" : datas.bank.bank_name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  IFSC
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.ifsc_code === "" ? "N/A" : datas.bank.ifsc_code}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Account Number
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.account_no === "" ? "N/A" : datas.bank.account_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">
                  Name in Account
                </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.account_holder_name === ""
                    ? "N/A"
                    : datas.bank.account_holder_name}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <ToastContainer></ToastContainer>
      </div>
    );
  });
};

export default DeliverymanProfile;

import React, { useState, useEffect, useRef } from "react";
import closeIcon from "../../Images/svgs/closeicon.svg";
import dropdownImg from "../../Images/svgs/dropdown_icon.svg";
import checkGreen from "../../Images/svgs/check-green-btn.svg";
import deleteiconWithBg from "../../Images/svgs/delete-icon-with-bg.svg";
import { Col, Row } from "react-bootstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import billLogo from "../../Images/svgs/bill-logo.svg";
import "react-toastify/dist/ReactToastify.css";
import dropdownDots from "../../Images/svgs/dots2.svg";
import { db } from "../../firebase";
import eye_icon from "../../Images/svgs/eye.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import crossIcon from "../../Images/svgs/cross_Icons.svg";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import filtericon from "../../Images/svgs/filtericon.svg";
import { collection, getDocs } from "firebase/firestore";
import { useOrdercontext } from "../../context/OrderGetter";
import { CrossIcons } from "../../Common/Icon";
import { useNotification } from "../../context/NotificationContext";
import ReactToPrint from "react-to-print";
// import { collection, getDocs } from 'firebase/firestore';
const DeliverymanProfile = () => {
  const { DeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const { ServiceData } = UseServiceContext();
  const componentRef = useRef();
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
  const [todaydailyOrders, setTodayDailyOrders] = useState(0);
  const [orderstatus, setOrderStatus] = useState("");
  const [onSiteOrders, setOnSiteOrders] = useState(0);
  const [showordertabel, setShowOrderTabel] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [amountupi, setAmountUpi] = useState(0);
  const [areaPinCode, setAreaPinCode] = useState(null);
  const [showdeliverypop, setShowDeliveryPop] = useState(false);
  const { orders } = useOrdercontext();
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [selectedBill, setSelectedBill] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectAll, setSelectAll] = useState([]);
  const [addMoreArea, setAddMoreArea] = useState([
    {
      pincode: "",
      area_name: "",
      terretory: [],
    },
  ]);
  const { showpop, setShowpop } = useNotification();
  const [addServiceAreaPopup, setAddServiceAreaPopup] = useState(false);
  const [deliveryhistory, setDeliveryHistory] = useState(0);
  const [deliveryhistorytime, setDeliveryHistoryTime] = useState("");
  const [deliveryvanhistory, setDeliveryVanHistory] = useState([]);
  const [totalspent, setTotalSpent] = useState(0);
  const [showlogspop, setShowLogsPop] = useState(false);
  const [selectarea, setSelectArea] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(
    Array(addMoreArea.length).fill(false)
  );
  const dropdownRef = useRef(null);
console.log(deliveryvanhistory,"deliveryvanhistory")
  const navigate = useNavigate();
  ////////////////////////   fetch van history      /////////////////////////////

  const FetchDeliveryManVanHistory = async (deliverymanid) => {
    let list = [];
    if (deliverymanid) {
      try {
        const querySnapshot = await getDocs(
          collection(db, `Delivery/${deliverymanid.id}/history`)
        );
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setDeliveryVanHistory(list);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (DeliveryManData.length !== 0) {
      const DeliveryManDatas = DeliveryManData.filter(
        (item) => item.d_id === id
      );
      const DeliveryManId = DeliveryManData.filter((item) => {
        if (item.d_id === id) {
          return item.id;
        }
      });
      FetchDeliveryManVanHistory(DeliveryManDatas[0]);

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
      let ordersCount = [];
      let todayordersCount = 0;
      let todayOrders = [];
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      orders.forEach((order) => {
        if (
          order.assign_to === DeliveryManId[0].id &&
          order.status.toUpperCase() === "DELIVERED"
        ) {
          ordersCount.push(order);
          const dateToCompare = new Date(order.transaction.date);
          dateToCompare.setHours(0, 0, 0, 0);
          if (dateToCompare.getTime() === currentDate.getTime()) {
            todayordersCount++;
          }
        }

        if (order.assign_to === DeliveryManId[0].id) {
          const orderdate = new Date(order.created_at);
          const todaydate = new Date();
          const isSameDate =
            orderdate.getFullYear() === todaydate.getFullYear() &&
            orderdate.getMonth() === todaydate.getMonth() &&
            orderdate.getDate() === todaydate.getDate();
          if (isSameDate) {
            todayOrders.push(order);
          }
        }
      });

      setTodayDailyOrders(todayOrders);

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
        setAmountUpi(item.UPI);
      });
    }

    // setWallet(DeliveryManDatas[0].wallet);
  }, [DeliveryManData, id]);

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

  function formatDate2(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate.replace("at", "|");
  }

  function handleDeleteArea(index) {
    // setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
    setAddMoreArea((Prevarareas) => Prevarareas.filter((_, i) => i !== index));
  }

  function handlePincodeChange(index) {
    // console.log(areaPinCode);
    const filterData = ServiceData.filter(
      (datas) => datas.PostalCode === addMoreArea[index].pincode
    );

    const areaName = filterData[0]?.AreaName || "";
    // console.log(addMoreArea[index].pincode);
    // console.log(filterData[0]?.AreaName);
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
    // console.log(addMoreArea);
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
        // console.log("asdadfasf", pincode, area_name, terretory);
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
          // console.log(deliveryData);
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

  if (!id || filterData.length === 0) {
    return <Loader> </Loader>;
  }

  const handleBillNumberClick = (invoiceNumber) => {
    const bill = orders.filter(
      (order) => order.invoiceNumber === invoiceNumber
    );
    setSelectedBill([...bill]);
  };

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
  setLoading(true);
  try {
    const newDate = new Date();
    const todayDate = newDate.toISOString().split("T")[0];

    const DeliveryManDatas = DeliveryManData.filter(
      (item) => item.d_id === id
    );

    if (wallet !== 0 || amountupi !== 0) {
      if (DeliveryManDatas.length === 0) {
        console.error("No delivery man data found for the given ID.");
        setLoading(false);
        return;
      }

      const deliveryManId = DeliveryManDatas[0].id;
      const historyRef = collection(db, `Delivery/${deliveryManId}/history`);
      const historyDocRef = doc(historyRef, todayDate);

      const docSnapshot = await getDoc(historyDocRef);

      let currentAmount = 0;
      let currentAmountUpi = 0;

      console.log(deliveryvanhistory)
      // 👇 Get today's history object from array if available
      const todayHistory = deliveryvanhistory.find(
        (item) => item.formattedDate === todayDate
      );

      const loaditems = todayHistory?.loaditems || [];
      const pendingitems = todayHistory?.pendingitems  || [];
      const unloaditems = todayHistory?.unloaditems  || [];
console.log("laoditems",loaditems,pendingitems,unloaditems)
      if (!docSnapshot.exists()) {
        // Create new doc with merge (safe) 
        await setDoc(
          historyDocRef,
          {
            formattedDate: todayDate,
            totalamount: 0,
            totalamountupi: 0,
            loaditems,
            pendingitems,
            unloaditems,
          },
          { merge: true }
        );
      } else {
        currentAmount = docSnapshot.data()?.totalamount || 0;
        currentAmountUpi = docSnapshot.data()?.totalamountupi || 0;
      }

      const newAmount = currentAmount + wallet;
      const newAmountupi = currentAmountUpi + amountupi;

      await updateDoc(historyDocRef, {
        totalamount: newAmount,
        totalamountupi: newAmountupi,
        loaditems,
        pendingitems,
        unloaditems,
      });

      const deliveryManRef = doc(db, "Delivery", deliveryManId);
      await updateDoc(deliveryManRef, {
        wallet: 0,
        UPI: 0,
      });

      setShowpop(!showpop);
      window.location.reload(); // optional
    } else {
      setShowpop(!showpop);
    }
  } catch (error) {
    console.error("Error in handleCollectBalance:", error);
  }

  setTimeout(() => {
    setLoading(false);
  }, 2000);
}



  // async function handleCollectBalance() {
  //   setLoading(true);
  //   try {
  //     let newdate = new Date();
  //     const DeliveryManDatas = DeliveryManData.filter(
  //       (item) => item.d_id === id
  //     );

  //     if (wallet !== 0 || amountupi !== 0) {
  //       if (DeliveryManDatas.length === 0) {
  //         console.error("No delivery man data found for the given ID.");
  //         return;
  //       }

  //       const deliveryManId = DeliveryManDatas[0].id;
  //       const historyRef = collection(db, `Delivery/${deliveryManId}/history`);
  //       let filtertodaylogs = deliveryvanhistory.filter(
  //         (value) => value.formattedDate === newdate.toISOString().split("T")[0]
  //       );

  //       let querySnapshot;
  //       let currentAmount = 0;
  //       let currentAmountUpi = 0;

  //       if (filtertodaylogs.length > 0) {
  //         querySnapshot = doc(historyRef, filtertodaylogs[0].id);
  //         const docSnapshot = await getDoc(querySnapshot);

  //         if (docSnapshot.exists()) {
  //           currentAmount = docSnapshot.data().totalamount || 0;
  //           currentAmountUpi = docSnapshot.data().totalamountupi || 0;
  //         }
  //       } else {
  //         querySnapshot = doc(historyRef);
  //         await setDoc(querySnapshot, {
  //           formattedDate: newdate.toISOString().split("T")[0],
  //           totalamount: 0,
  //           totalamountupi: 0,
  //         });
  //       }

  //       const newAmount = currentAmount + wallet;
  //       const newAmountupi = currentAmountUpi + amountupi;
  //       await updateDoc(querySnapshot, {
  //         totalamount: newAmount,
  //         totalamountupi: newAmountupi,
  //       });

  //       const deliveryManRef = doc(db, "Delivery", deliveryManId);
  //       await updateDoc(deliveryManRef, {
  //         wallet: 0,
  //         UPI: 0,
  //       });

  //       window.location.reload();
  //       setShowpop(!showpop);
  //     } else {
  //       setShowpop(!showpop);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // }

  ///////////////////////     delivery history      ///////////////////

  const handleDateRangeSelection = (range) => {
    setStartDate("");
    setEndDate("");
    setShowCustomDate(false);
    setDeliveryHistoryTime(range);
    const today = new Date();
    let start, end;

    switch (range) {
      case "yesterday":
        start = new Date(today);
        start.setDate(today.getDate());
        end = new Date(start);
        break;
      case "week":
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = today;
        break;
      case "month":
        start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        end = today;
        break;
      case "six_months":
        start = new Date(today);
        start.setMonth(today.getMonth() - 6);
        end = today;
        break;
      case "custom":
        setShowCustomDate(true);
        return;
      default:
        return;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
    filterOrdersByDateRange(start, end);
  };

  const filterOrdersByDateRange = (start, end) => {
    const DeliveryManid = DeliveryManData.find((item) => item.d_id === id);
    if (DeliveryManid) {
      const filterDelivery = orders
        .filter((value) => {
          const orderDate = new Date(value.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return (
            value.assign_to === DeliveryManid.id &&
            orderDate >= start &&
            orderDate <= end
          );
        })
        .map((value) => value);

      setDeliveryHistory(filterDelivery);
      setTotalSpent(
        filterDelivery
          .map((value) => value.order_price)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )
      );
    }
  };

  const handleCustomDateSelection = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      filterOrdersByDateRange(start, end);
    } else {
      console.error(
        "Please select both start and end dates for the custom range."
      );
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  /////////////////////////////////

  function handleSelectAll() {
    if (orders.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = orders.map((item) => {
        return item.id;
      });
      setSelectAll(allCheck);
    }
  }

  function handleSelect(e) {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectAll([...selectAll, value]);
    } else {
      setSelectAll((prev) =>
        prev.filter((id) => {
          return id != value;
        })
      );
    }
  }

  let totalorder = orders.filter(
    (value) => value.assign_to === filterData[0].id
  );

  ////////////////////////////////

  const filterhistory = deliveryvanhistory.filter(
    (value) =>
      value.formattedDate >= startDate &&
      endDate !== new Date() &&
      value.formattedDate <= endDate
  );



  if (loading) {
    return <Loader />;
  }

  return filterData.map((datas, index) => {
    return (
      <div className="my-4">
        {showlogspop && (
          <div className="bg-white p-4 rounded-4 w_500 position-fixed center_pop overflow-auto xl_h_500">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-black fw-700 fs-2sm mb-0">Van History</h2>
              <button
                className="border-0 bg-white"
                onClick={() => (
                  setShowLogsPop(false),
                  setStartDate(""),
                  setEndDate(""),
                  setShowCustomDate(false)
                )}
              >
                <CrossIcons />
              </button>
            </div>
            <div className="black_line my-3"></div>

            {/* Date Selection Options */}
            <div className="mb-3">
              <label className="text-black fw-400 fs-sm mb-2">
                Select Range
              </label>
              <select
                className="form-select"
                onChange={(e) => handleDateRangeSelection(e.target.value)}
              >
                <option value="">Select Date</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">One Week</option>
                <option value="month">One Month</option>
                <option value="six_months">Six Months</option>
                <option value="custom">Custom</option>
              </select>

              {showCustomDate && (
                <div className="p-3 border rounded bg-light mt-2">
                  <div className="mb-2">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control"
                      placeholder="End Date"
                    />
                  </div>
                  <button
                    onClick={handleCustomDateSelection}
                    className="apply_btn mt-2"
                  >
                    Apply Custom Date Range
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <h4 className="text-black fw-400 fs-sm mb-0">Total Results</h4>
              <h2 className="text-black fw-700 fs-sm mb-0">
                {filterhistory.length}
              </h2>
            </div>
            {filterhistory.length !== 0 && (
              <div className=" mt-3 text-center">
                <button
                  className=" px-4 py-1 rounded-2 border-black text-black  bg-transparent"
                  onClick={() =>
                    navigate("/deliveryman/viewhistory", {
                      state: {
                        deliverydata: filterData,
                        filterhistory: filterhistory,
                      },
                    })
                  }
                >
                  Show Van History
                </button>
              </div>
            )}
          </div>
        )}
        {/* /////////////////////////////////////////// */}
        {showdeliverypop && (
          <div className="bg-white p-4 rounded-4 w_500 position-fixed center_pop overflow-auto xl_h_500">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-black fw-700 fs-2sm mb-0">
                Delivery History
              </h2>
              <button
                className="border-0 bg-white"
                onClick={() => (
                  setShowDeliveryPop(false),
                  setStartDate(""),
                  setEndDate(""),
                  setShowCustomDate(false)
                )}
              >
                <CrossIcons />
              </button>
            </div>
            <div className="black_line my-3"></div>

            {/* Date Selection Options */}
            <div className="mb-3">
              <label className="text-black fw-400 fs-sm mb-2">
                Select Order Date Range
              </label>
              <select
                className="form-select"
                onChange={(e) => handleDateRangeSelection(e.target.value)}
              >
                <option value="" disabled selected>
                  Choose a date range
                </option>
                <option value="">Select Order Date</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">One Week</option>
                <option value="month">One Month</option>
                <option value="six_months">Six Months</option>
                <option value="custom">Custom</option>
              </select>

              {showCustomDate && (
                <div className="p-3 border rounded bg-light mt-2">
                  <div className="mb-2">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control"
                      placeholder="End Date"
                    />
                  </div>
                  <button
                    onClick={handleCustomDateSelection}
                    className="apply_btn mt-2"
                  >
                    Apply Custom Date Range
                  </button>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <h4 className="text-black fw-400 fs-sm mb-0">Total Delivery</h4>
              <h2 className="text-black fw-700 fs-sm mb-0">
                {deliveryhistory.length}
              </h2>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <h4 className=" text-black fw-400 fs-sm mb-0">Total Spent</h4>
              <h2 className="color_green fw-700 fs-sm mb-0">₹ {totalspent}</h2>
            </div>
            {deliveryhistory.length > 0 && (
              <div className=" mt-3 text-center">
                <button
                  className=" px-4 py-1 rounded-2 border-black text-black bg-transparent"
                  onClick={() =>
                    navigate("/deliveryman/deliverylist", {
                      state: { deliverydata: deliveryhistory },
                    })
                  }
                >
                  Show Dilvery List
                </button>
              </div>
            )}
          </div>
        )}
        {showpop && (
          <div className="center_pop position-fixed w-100 h-100 layer"></div>
        )}
        {showpop && (
          <div className=" bg-white p-4 rounded-4 w-25 position-fixed center_pop">
            <div className=" d-flex align-items-center justify-content-between">
              <h2 className=" text-black fw-700 fs-2sm mb-0">
                Collect Amount!
              </h2>
              <button
                className=" border-0 bg-white"
                onClick={() => setShowpop(!showpop)}
              >
                {" "}
                <CrossIcons />
              </button>
            </div>
            <div className="black_line my-3"></div>
            <div className=" d-flex align-items-center justify-content-between">
              <h4 className=" text-black fw-400 fs-sm mb-0">
                Today’s Collection Cash
              </h4>
              <h2 className=" text-black fw-700 fs-sm mb-0">₹ {wallet}</h2>
            </div>
            <div className=" d-flex align-items-center justify-content-between mt-3">
              <h4 className=" text-black fw-400 fs-sm mb-0">
                Today’s Collection UPI
              </h4>
              <h2 className=" text-black fw-700 fs-sm mb-0">₹ {amountupi}</h2>
            </div>
            <div className=" mt-4 pt-2 d-flex justify-content-end">
              <button
                onClick={handleCollectBalance}
                className=" outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              >
                Collect Now
              </button>
            </div>
          </div>
        )}
        {approvePopup ||
        rejectPopup ||
        addServiceAreaPopup ||
        showdeliverypop ||
        showlogspop ? (
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
                        onWheel={(e) => {
                          e.target.blur();
                        }}
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
                </div>
              ) : datas.profile_status === "APPROVED" ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button
                    onClick={() => setShowLogsPop(true)}
                    className="filter_btn black d-flex align-items-center gap-2 fs-sm px-sm-3 px-2 py-2 fw-400 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>

                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    View History
                  </button>
                  <button
                    onClick={() => setShowDeliveryPop(true)}
                    className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                  >
                    <img
                      className="me-1"
                      width={24}
                      src={filtericon}
                      alt="filtericon"
                    />
                    Filter
                  </button>
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
              <div className="profile_top_data_width d-flex align-items-center py-3  flex-column">
                <div>
                  <p className="fs-sm fw-400 black m-0">Today`s Order</p>
                  <p
                    className={`fs_24 fw_600 red m-0  ${
                      todaydailyOrders.length !== 0 ? "mt-2" : "mt-3"
                    }`}
                  >
                    {todaydailyOrders.length}
                  </p>
                </div>
                {todaydailyOrders.length !== 0 && (
                  <div className=" mt-1">
                    <button
                      onClick={() => (
                        setShowOrderTabel(todaydailyOrders),
                        setOrderStatus("Today`s Order")
                      )}
                      className=" text-black border-0 bg-transparent"
                    >
                      View all
                    </button>
                  </div>
                )}
              </div>
              <div className="profile_top_data_width d-flex align-items-center py-3  flex-column">
                <p className="fs-sm fw-400 black m-0">Today`s Delivery</p>
                <p className="fs_24 fw_600 red m-0 mt-3">{totaldailyOrders}</p>
              </div>
              <div className="profile_top_data_width d-flex align-items-center py-3  flex-column">
                <p className="fs-sm fw-400 black m-0">On Site Orders</p>
                <p className="fs_24 fw_600 black m-0 mt-3">{onSiteOrders}</p>
              </div>
            </div>
            <div className="d-flex align-items-center text-center bg_light_orange">
              <div className="profile_top_data_width d-flex align-items-center py-3  flex-column">
                <p className="fs-sm fw-400 black m-0">All Orders</p>
                <p className="fs_24 fw_600 red m-0 mt-3">{totalorder.length}</p>
              </div>
              <div className="profile_top_data_width d-flex align-items-center py-3 flex-column">
                <div>
                  <p className="fs-sm fw-400 black m-0">Total Delivery</p>
                  <p
                    className={`fs_24 fw_600 red m-0  ${
                      totalOrders.length !== 0 ? "mt-2" : "mt-3"
                    }`}
                  >
                    {totalOrders.length}
                  </p>
                </div>
                {totalOrders.length !== 0 && (
                  <div className=" mt-1">
                    <button
                      onClick={() => (
                        setShowOrderTabel(totalOrders),
                        setOrderStatus("Total Delivery")
                      )}
                      className=" text-black border-0 bg-transparent"
                    >
                      View all
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile_top_data_width_amount  pt-3 bg_light_green">
              <div className="d-flex justify-content-around">
                <div>
                  <p className="fs-sm fw-400 black m-0">Cash Amount</p>
                  <p className="fs_24 fw_600 green m-0 mt-2">₹ {wallet}</p>
                </div>
                <div>
                  <p className="fs-sm fw-400 black m-0">UPI Amount</p>
                  <p className="fs_24 fw_600 green m-0 mt-2">₹ {amountupi}</p>
                </div>
              </div>
              <button
                onClick={() => setShowpop(!showpop)}
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

        {showordertabel && (
          <div className=" mt-4">
            <div className=" d-flex align-items-center justify-content-between mb-4">
              <h1 className="fw-500   black fs-lg">{orderstatus}</h1>
              <button
                onClick={() => setShowOrderTabel(false)}
                className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              >
                <img
                  className="me-1"
                  width={24}
                  src={crossIcon}
                  alt="crossIcon"
                />
                Close
              </button>
            </div>
            <div className="overflow-x-scroll line_scroll border bg-white">
              <div style={{ minWidth: "1650px", height: "300px" }}>
                <table className="w-100 d-flex flex-column">
                  <thead
                    className="table_head w-100 position-sticky  bg-white"
                    style={{ zIndex: "1", top: "-1px" }}
                  >
                    <tr className="product_borderbottom">
                      <th className="mw-200 p-3 cursor_pointer">
                        <div className="d-flex align-items-center">
                          <label className="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              checked={
                                selectAll.length === todaydailyOrders.length
                              }
                              onChange={handleSelectAll}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <p className="fw-400 fs-sm black mb-0 ms-2">
                            Order Number
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
                      <th className="mw-200 p-2">
                        <h3 className="fs-sm fw-400 black mb-0">Invoice</h3>
                      </th>
                      <th className="mw-200 p-3">
                        <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                      </th>
                      <th className="mw-200 p-3">
                        <h3 className="fs-sm fw-400 black mb-0">Customer </h3>
                      </th>
                      <th className="mw_160 p-3 cursor_pointer">
                        <span className="d-flex align-items-center">
                          <h3 className="fs-sm fw-400 black mb-0 white_space_nowrap text-capitalize">
                            Payment Status
                            <span>
                              <img
                                className="ms-2 cursor_pointer"
                                width={20}
                                src={shortIcon}
                                alt="short-icon"
                              />
                            </span>
                          </h3>
                        </span>
                      </th>
                      <th className="mw_160 p-3 cursor_pointer">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Order Status
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </h3>
                      </th>
                      <th className="mw_140 p-3">
                        <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                      </th>
                      <th className="mw_160 p-3 cursor_pointer">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Order Price
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </h3>
                      </th>
                      <th className="mx_100 p-3 pe-4 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body3 flex-grow-1 bg-white">
                    {showordertabel
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((orderTableData, index) => {
                        return (
                          <tr>
                            <td className="p-3 mw-200">
                              <span className="d-flex align-items-center">
                                <label className="check1 fw-400 fs-sm black mb-0">
                                  <input
                                    type="checkbox"
                                    value={orderTableData.id}
                                    checked={selectAll.includes(
                                      orderTableData.id
                                    )}
                                    onChange={handleSelect}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <Link
                                  className="fw-400 fs-sm color_blue ms-2"
                                  to={`/orders/orderdetails/${orderTableData.order_id}`}
                                >
                                  # {orderTableData.order_id}
                                </Link>
                              </span>
                            </td>
                            <td className="p-2 mw-200">
                              {orderTableData.invoiceNumber !== undefined && (
                                <button
                                  onClick={() =>
                                    handleBillNumberClick(
                                      orderTableData.invoiceNumber
                                    )
                                  }
                                  className="border-0 bg-white"
                                >
                                  <ReactToPrint
                                    trigger={() => {
                                      return (
                                        <h3 className="fs-xs fw-400 color_blue mb-0">
                                          #{orderTableData.invoiceNumber}
                                        </h3>
                                      );
                                    }}
                                    content={() => componentRef.current}
                                    documentTitle="Invoice"
                                    pageStyle="print"
                                  />
                                </button>
                              )}
                              {orderTableData.invoiceNumber === undefined && (
                                <h3 className="fs-xs fw-400 color_blue mb-0">
                                  #N/A
                                </h3>
                              )}
                            </td>
                            <td className="p-3 mw-200">
                              <h3 className="fs-xs fw-400 black mb-0">
                                {formatDate2(orderTableData.created_at)}
                              </h3>
                            </td>
                            <td className="p-3 mw-200">
                              <Link
                                to={
                                  orderTableData.order_created_by === "Van"
                                    ? ""
                                    : `/customer/viewcustomerdetails/${orderTableData.uid}`
                                }
                              >
                                <h3 className="fs-sm fw-400 color_blue mb-0">
                                  {orderTableData.customer.name}
                                </h3>
                              </Link>
                            </td>
                            <td className="p-3 mw_160">
                              <h3
                                className={`fs-sm fw-400 mb-0 d-inline-block ${
                                  orderTableData.status
                                    .toString()
                                    .toUpperCase() !== "CANCELLED" &&
                                  orderTableData.status
                                    .toString()
                                    .toUpperCase() !== "REJECTED" &&
                                  orderTableData.status
                                    .toString()
                                    .toUpperCase() !== "RETURNED"
                                    ? orderTableData.transaction.status
                                        .toString()
                                        .toLowerCase() === "paid"
                                      ? "black stock_bg"
                                      : orderTableData.transaction.status
                                          .toString()
                                          .toLowerCase() === "cod"
                                      ? "black cancel_gray"
                                      : orderTableData.transaction.status
                                          .toString()
                                          .toLowerCase() === "refund"
                                      ? "new_order red"
                                      : "color_brown on_credit_bg"
                                    : ""
                                }`}
                              >
                                {orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "CANCELLED" &&
                                orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "REJECTED" &&
                                orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "RETURNED"
                                  ? orderTableData.transaction.status
                                  : null}
                              </h3>
                            </td>
                            <td className="p-3 mw_190">
                              <p
                                className={`d-inline-block ${
                                  orderTableData.status
                                    .toString()
                                    .toLowerCase() === "new"
                                    ? "fs-sm fw-400 red mb-0 new_order"
                                    : orderTableData.status
                                        .toString()
                                        .toLowerCase() === "processing"
                                    ? "fs-sm fw-400 mb-0 processing_skyblue"
                                    : orderTableData.status
                                        .toString()
                                        .toLowerCase() === "delivered"
                                    ? "fs-sm fw-400 mb-0 green stock_bg"
                                    : "fs-sm fw-400 mb-0 black cancel_gray"
                                }`}
                              >
                                {orderTableData.status}
                              </p>
                            </td>
                            <td className="p-3 mw_140">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {orderTableData.items.length} items
                              </h3>
                            </td>
                            <td className="p-3 mw_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                ₹ {orderTableData.order_price}
                              </h3>
                            </td>
                            <td className="text-center mx_100">
                              <div className="dropdown">
                                <button
                                  className="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton3"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <abbr title="View">
                                    <img
                                      src={dropdownDots}
                                      alt="dropdownDots"
                                    />
                                  </abbr>
                                </button>
                                <ul
                                  className="dropdown-menu categories_dropdown"
                                  aria-labelledby="dropdownMenuButton3"
                                >
                                  <li>
                                    <div className="dropdown-item" href="#">
                                      <div className="d-flex align-items-center categorie_dropdown_options">
                                        <img src={eye_icon} alt="" />
                                        <Link
                                          to={`/orders/orderdetails/${orderTableData.order_id}`}
                                        >
                                          <p className="fs-sm fw-400 black mb-0 ms-2">
                                            View Details
                                          </p>
                                        </Link>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
        <div>
          <div>
            {selectedBill.length > 0
              ? selectedBill.map((items) => {
                  const subtotal = items.items.reduce(
                    (acc, data) => acc + data.quantity * data.final_price,
                    0
                  );
                  const savedDiscount = items.items.reduce(
                    (acc, data) => acc + data.quantity * data.varient_discount,
                    0
                  );
                  return (
                    <div className="bill m-auto" ref={componentRef}>
                      <div className="d-flex align-items-start justify-content-between">
                        <img src={billLogo} alt="billLogo" />
                        <div className="text-end">
                          <h1 className="fs_24 fw-700 black mb-0">INVOICE</h1>
                          <p className="fs-xxs fw_700 black mb-0">
                            #{items.invoiceNumber}
                          </p>
                          <p className="fs-xs fw_400 green mb-0">
                            {items.transaction.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex align-items-start justify-content-between gap-3">
                          <div className="w-50">
                            <p className="fs-xs fw-700 black mb-0">
                              Save Time Save Money
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              Near TVS Agency, Hansi Road, Barwala,
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              Hisar, Haryana - 125121
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              GSTIN : 06GWMPS2545Q1ZJ
                            </p>
                          </div>
                          <div className="text-end w-50">
                            <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                            <p className="fs-xxs fw-700 black mb-0">
                              {items.customer.name}
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              {items.shipping.address}
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              {items.shipping.city} {items.shipping.state}{" "}
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                              Invoice Date : {formatDate2(items.created_at)}
                            </p>
                          </div>
                        </div>
                        <table className="w-100 mt-3">
                          <thead>
                            <tr className="bg_dark_black">
                              <th className="fs-xxs fw-400 white p_10">#</th>
                              <th className="fs-xxs fw-400 white p_10">
                                Item Description
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-center">
                                Qty
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-end">
                                Unit Cost
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-center">
                                Tax
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-end">
                                Line Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.items.map((data) => {
                              return (
                                <tr>
                                  <td className="fs-xxs fw-400 black p_5_10">
                                    1
                                  </td>
                                  <td className="p_5_10">
                                    <span>
                                      <p className="fs-xxs fw-400 black mb-0">
                                        {data.title}
                                      </p>
                                      <span className="d-flex align-items-center gap-2">
                                        <p className=" fs-xxxs fw-700 black mb-0">
                                          ₹ {data.varient_discount} OFF
                                        </p>
                                        <p
                                          className={`fs-xxxs fw-400 black mb-0  ${
                                            data.varient_discount !== "0"
                                              ? "strikethrough"
                                              : null
                                          }`}
                                        >
                                          MRP : {data.varient_price}
                                        </p>
                                      </span>
                                      <span className="d-flex align-items-center gap-3">
                                        <p className=" fs-xxxs fw-400 black mb-0">
                                          {data.varient_name} {data.unitType}
                                        </p>
                                        <p className="fs-xxxs fw-400 black mb-0">
                                          {data.color}
                                        </p>
                                      </span>
                                    </span>
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-center">
                                    {data.quantity}
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                                    {data.final_price}
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-center">
                                    {typeof data.Tax === "undefined"
                                      ? "0"
                                      : data.Tax}
                                    %
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                                    ₹
                                    {data.quantity * data.final_price +
                                      (typeof data.text === "undefined"
                                        ? 0
                                        : data.quantity *
                                          data.final_price *
                                          (data.Tax / 100))}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-between mt-3">
                          <div className="w-75 text-end">
                            <p className="fs_xxs fw-700 black mb-0">
                              Sub Total
                            </p>
                            <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                              Promo Discount
                            </p>
                            <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                              Total Amount
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="fs_xxs fw-400 black mb-0">
                              ₹{subtotal}
                            </p>
                            <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                              (-) ₹ {items.additional_discount.discount}
                            </p>
                            <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                              {/* {((data.quantity * data.final_price) * (data.Tax / 100))} */}
                              {items.order_price}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="mt-3 bill_border d-inline-block"></span>
                      <p className=" fs-xxxs fw-400 black mb-0 mt-1">
                        Note : You Saved{" "}
                        <span className="fw-700"> ₹{savedDiscount} </span> on
                        product discount.
                      </p>
                      {items.transaction.status === "Paid" ? (
                        <div>
                          <p className="fs_xxs fw-400 black mb-0 mt-3">
                            Transactions:
                          </p>
                          <table className="mt-3 w-100">
                            <thead>
                              <tr>
                                <th className="fs-xxs fw-400 black py_2">
                                  Transaction ID
                                </th>
                                <th className="fs-xxs fw-400 black py_2">
                                  Payment Mode
                                </th>
                                <th className="fs-xxs fw-400 black py_2">
                                  Date
                                </th>
                                <th className="fs-xxs fw-400 black py_2">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bill_border">
                                <td className="fs-xxs fw-400 black py-1">
                                  {items.transaction.tx_id === ""
                                    ? "N/A"
                                    : items.transaction.tx_id}
                                </td>
                                <td className="fs-xxs fw-400 black py-1">
                                  {items.transaction.mode}
                                </td>
                                <td className="fs-xxs fw-400 black py-1">
                                  {formatDate2(items.transaction.date)}
                                </td>
                                <td className="fs-xxs fw-400 black py-1">
                                  ₹{items.order_price}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
        <ToastContainer></ToastContainer>
      </div>
    );
  });
};

export default DeliverymanProfile;

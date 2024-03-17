import React, { useState, useEffect } from "react";
import closeicon from "../../Images/svgs/closeicon.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ActionIcon, DeleteIcon, EditIcon, TickIcon } from "../../Common/Icon";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
const Coupons = () => {
  const { DeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [code, setCode] = useState("");
  const [maxdiscount, setMaxDiscount] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [minorder, setMinOrder] = useState("");
  const [discounttype, setDiscounttype] = useState("Fixed");
  const [discount, setDiscount] = useState("");
  const [addsServicePopup, setAddsServicePopup] = useState(false);
  console.log("delivery man data ", DeliveryManData);
  const [order, setorder] = useState("ASC");
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...DeliveryManData];

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
    updateDeliveryManData(sortedData);
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

  function addcoupons(e) {
    e.preventDefault();
    setCode("");
    setDiscount("");
    setMinOrder("");
    setMaxDiscount("");
    setStartDate("");
    setEndDate("");
  }
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...DeliveryManData];
    updatedData[index].checked = !DeliveryManData[index].checked;
    updateDeliveryManData(updatedData);
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
        {addsServicePopup ? <div className="bg_black_overlay"></div> : ""}
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <h1 className="fw-500 black fs-lg mb-0">Coupons</h1>
            <Link
              onClick={() => setAddsServicePopup(!addsServicePopup)}
              className="update_entry black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 gap-2 "
            >
              <TickIcon />
              Add Counpon
            </Link>
            {addsServicePopup ? (
              <form onSubmit={addcoupons} className="add_coupon_popup  ">
                <div className="d-flex  justify-content-between position-relative mt-1">
                  <div className="w-100">
                    <label className="fs-sm fw-400 black mb-0">
                      Promo Code
                    </label>
                    <input
                      required
                      className="popup_coupon_input w-100 fs-xs fw-400 black mt-2"
                      type="text"
                      placeholder="Enter your code"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                  <img
                    className="cursor_pointer position-absolute top-0 end-0 "
                    onClick={() => setAddsServicePopup(!addsServicePopup)}
                    src={closeicon}
                    alt="closeicon"
                  />
                </div>
                <div className="mt-3">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="row align-items-center  ">
                    <div className="col-6">
                      <div className="mt-3  py-1 d-flex align-items-center ">
                        <label class="check fw-400 fs-sm black mb-0">
                          Percentage
                          <input
                            onChange={() => setDiscounttype("Percentage")}
                            type="radio"
                            checked={discounttype === "Percentage"}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center  gap-3">
                        <label class="check fw-400 fs-sm black mb-0">
                          Fixed
                          <input
                            onChange={() => setDiscounttype(" Fixed")}
                            type="radio"
                            checked={discounttype === " Fixed"}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <input
                  className="popup_coupon_input w-100 fs-xs fw-400 black mt-3"
                  type="text"
                  required
                  id="discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter Discount Value"
                />

                <div className="row align-items-center ">
                  <div className="col-6">
                    <div className="d-flex align-items-start flex-column pt-3 mt-1">
                      <label htmlFor="">Min. Order</label>
                      <input
                        className="popup_coupon_input w-100 fs-xs fw-400 black mt-2"
                        type="text"
                        placeholder="₹ 0.00"
                        required
                        id="minorder"
                        value={minorder}
                        onChange={(e) => setMinOrder(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-start flex-column pt-3 mt-1">
                      <label htmlFor="">Max Discount</label>
                      <input
                        className="popup_coupon_input w-100 fs-xs fw-400 black mt-2"
                        type="text"
                        placeholder="₹ 0.00"
                        required
                        id="maxdiscount"
                        value={maxdiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row align-items-center ">
                  <div className="col-6">
                    <div className="d-flex align-items-start flex-column pt-3 mt-1">
                      <label htmlFor="">Start Date</label>
                      <input
                        className="popup_coupon_input w-100 fs-xs fw-400 black mt-2"
                        type="date"
                        placeholder="01-01-2000"
                        required
                        id="startdate"
                        value={startdate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-start flex-column pt-3 mt-1">
                      <label htmlFor="">End Date</label>
                      <input
                        className="popup_coupon_input w-100 fs-xs fw-400 black mt-2"
                        type="date"
                        placeholder="01-01-2000"
                        required
                        id="enddate"
                        value={enddate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="fs-sm d-flex gap-2 mt-3 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black"
                >
                  <TickIcon />
                  Add Promo
                </button>
              </form>
            ) : null}
          </div>
          <div className=" mt-3 bg-white mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head tablehead_bg">
                    <tr>
                      <th className="py-3 ps-3 mx_70 cursor_pointer ">#</th>
                      <th className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Promo Code</h3>
                      </th>
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Discount Value
                        </h3>
                      </th>
                      <th className="mx_140 cursor_pointer">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Max. Discount
                        </h3>
                      </th>
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Min. Order</h3>
                      </th>
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Start Date</h3>
                      </th>
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">End Date</h3>
                      </th>
                      <th className="mx_100 p-3 ps-0 me-1 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Actions</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    <tr>
                      <td className="py-3 ps-3 mx_70 cursor_pointer ">1</td>
                      <td className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">SALE_50</h3>
                      </td>
                      <td className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">50%</h3>
                      </td>
                      <td className="mx_140 cursor_pointer">
                        <h3 className="fs-sm fw-400 black mb-0"> ₹ 250.00</h3>
                      </td>
                      <td className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">₹ 600.00</h3>
                      </td>
                      <td className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">01-01-2024</h3>
                      </td>
                      <td className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">01-40-2024</h3>
                      </td>
                      <td className="mx_100 p-3 me-1">
                        <div className="d-flex gap-3">
                          <EditIcon />
                          <DeleteIcon />
                        </div>
                      </td>
                    </tr>
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

export default Coupons;

import React, { useState, useEffect } from "react";
import closeicon from "../../Images/svgs/closeicon.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeleteIcon, EditIcon, TickIcon } from "../../Common/Icon";
import { addDoc, collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useCouponcontext } from "../../context/CouponsGetter";
import { db } from "../../firebase";
import Loader from "../Loader";
import Deletepopup from "../popups/Deletepopup";



const Coupons = () => {

  const { allcoupons, deleteCouponData, updateCouponData, addCouponData } = useCouponcontext()

  const [loaderstatus, setLoaderstatus] = useState(false);
  const [code, setCode] = useState("");
  const [maxdiscount, setMaxDiscount] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [minorder, setMinOrder] = useState("");
  const [discounttype, setDiscounttype] = useState("FIXED");
  const [discount, setDiscount] = useState("");
  const [addsServicePopup, setAddsServicePopup] = useState(false);
  const [description, setdescription] = useState('')
  const [couponsId, setCouponId] = useState('')
  const [deletepopup, setDeletePopup] = useState(false)



  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  function handleReset() {
    setAddsServicePopup(false)
    setCode("");
    setDiscount("");
    setMinOrder("");
    setMaxDiscount("");
    setStartDate("");
    setEndDate("");
    setDiscounttype("FIXED")
    setdescription('')
  }


  async function addcoupons(e) {
    e.preventDefault();
    handleReset()
    let coupon_data = {
      promo_code: code,
      discount_type: discounttype,
      discount_value: discount,
      min_order: minorder,
      max_discount: maxdiscount,
      start_date: new Date(startdate).toISOString(),
      end_date: new Date(enddate).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description,
    }
    try {
      setLoaderstatus(true)
      let docref = await addDoc(collection(db, 'Coupons'), coupon_data);
      addCouponData(docref)
      setLoaderstatus(false)
      toast.success("Coupon added Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("Error in Add coupon ", error)
    }
  }

  async function handleDeleteCoupon(id) {
    try {
      setLoaderstatus(true)
      await deleteDoc(doc(db, 'Coupons', id)).then(() => {
        deleteCouponData(id);
      });
      setLoaderstatus(false)
      toast.success("Coupon Deleted Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCouponId('')
    } catch (error) {
      console.log(error);
    }
  }






  async function handleUpdateCoupons(id) {
    setLoaderstatus(true)


    try {
      await updateDoc(doc(db, 'Coupons', id), {
        promo_code: code,
        discount_type: discounttype,
        discount_value: discount,
        min_order: minorder,
        max_discount: maxdiscount,
        start_date: new Date(startdate).toISOString(),
        end_date: new Date(enddate).toISOString(),
        updated_at: new Date().toISOString(),
        description,
      });

      updateCouponData({
        id,
        promo_code: code,
        discount_type: discounttype,
        discount_value: discount,
        min_order: minorder,
        max_discount: maxdiscount,
        start_date: new Date(startdate).toISOString(),
        end_date: new Date(enddate).toISOString(),
        updated_at: new Date().toISOString(),
        description,
      });

      setAddsServicePopup(false)
      setLoaderstatus(false)
      handleReset()
      toast.success('Coupons  Updated  Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("error in update Coupon", error)
    }

  }

  function handleClose() {
    setAddsServicePopup(false)
    handleReset();
    setCouponId('')
  }


  if (loaderstatus) {
    return (
      <Loader></Loader>
    );
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        {(addsServicePopup || deletepopup) ? <div className="bg_black_overlay"></div> : ""}

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
                    onClick={() => handleClose()}
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
                            onChange={() => setDiscounttype("PERCENTAGE")}
                            type="radio"
                            checked={discounttype === "PERCENTAGE"}
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
                            onChange={() => setDiscounttype("FIXED")}
                            type="radio"
                            checked={discounttype === "FIXED"}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (discounttype === "PERCENTAGE" && value > 100) {
                      setDiscount(100)
                    } else {
                      setDiscount(value);
                    }
                  }}
                  placeholder="Enter Discount Value"
                />

                <input
                  className="popup_coupon_input w-100 fs-xs fw-400 black mt-3"
                  type="text"
                  required
                  id="descrption"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                  placeholder="Enter Description here"
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
                        min={new Date().toISOString().split('T')[0]}
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
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {couponsId ? (
                  <button
                    onClick={() => {
                      handleUpdateCoupons(couponsId)
                    }}
                    className="fs-sm d-flex gap-2 mt-3 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black"
                  >
                    <TickIcon />
                    update Promo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="fs-sm d-flex gap-2 mt-3 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black"
                  >
                    <TickIcon />
                    Add Promo
                  </button>
                )}
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
                    {allcoupons.map((coupns, index) => {
                      return (
                        <tr key={coupns.id}>
                          <td className="py-3 ps-3 mx_70 cursor_pointer ">{index + 1}</td>
                          <td className="mx_160 px-2">
                            <h3 className="fs-sm fw-400 black mb-0">{coupns.promo_code}</h3>
                          </td>
                          <td className="mx_160 ps-3">
                            <h3 className="fs-sm fw-400 black mb-0">{coupns.discount_type === "FIXED" ? `₹${coupns.discount_value}` : `% ${coupns.discount_value}`}</h3>
                          </td>
                          <td className="mx_140 cursor_pointer">
                            <h3 className="fs-sm fw-400 black mb-0"> ₹{coupns.max_discount}</h3>
                          </td>
                          <td className="mx_160 ps-3">
                            <h3 className="fs-sm fw-400 black mb-0">₹ {coupns.min_order}</h3>
                          </td>
                          <td className="mx_160 ps-3">
                            <h3 className="fs-sm fw-400 black mb-0">{formatDate(coupns.start_date)}</h3>
                          </td>
                          <td className="mx_160 ps-3">
                            <h3 className="fs-sm fw-400 black mb-0">{formatDate(coupns.end_date)}</h3>
                          </td>
                          <td className="mx_100 p-3 me-1">
                            <div className="d-flex gap-3">
                              <div onClick={() => {
                                setAddsServicePopup(true)
                                setCouponId(coupns.id);
                                setCode(coupns.promo_code)
                                setMaxDiscount(coupns.max_discount)
                                setStartDate(coupns.start_date)
                                setEndDate(coupns.end_date)
                                setMinOrder(coupns.min_order)
                                setDiscount(coupns.discount_value)
                                setDiscounttype(coupns.discount_type)
                                setdescription(coupns.description)
                              }}>
                                <EditIcon />
                              </div>
                              <div onClick={() => {
                                setDeletePopup(true);
                                setCouponId(coupns.id)
                              }}>
                                <DeleteIcon> </DeleteIcon>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {
                  deletepopup ? (
                    <Deletepopup
                      showPopup={setDeletePopup}
                      handleDelete={() => handleDeleteCoupon(couponsId)}
                      items="Coupon"
                    />
                  ) : null
                }
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

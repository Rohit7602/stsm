import React, { useEffect, useState } from "react";
import ComplainCusPic from "../../Images/Png/complain-pic.png";
import DropdownBlack from "../../Images/svgs/dropdown-black.svg";
import ReplyBtn from "../../Images/svgs/reply-icon.svg";
import SendIcon from "../../Images/svgs/send-icon.svg";
import closeIcon from "../../Images/svgs/closeicon.svg";
import { useParams } from "react-router-dom";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UseComplaintsContext } from "../../context/ComplainsGetter";
import manimage from "../../Images/Png/manimage.jpg";
import Loader from "../Loader";
import { useOrdercontext } from "../../context/OrderGetter";
import { format } from "date-fns";

export default function ComplainDetails() {
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyContent, setReplyContent] = useState(false);
  const [addResolutionPopup, setAddResolutionPopup] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [replytext, setReplyText] = useState("");
  const [resolutionValue, setResolutionValue] = useState("");
  const { complainId } = useParams();
  const [complain, setComplain] = useState([]);
  const [customerComplain, setCustomerComplain] = useState([]);
  const { complaints } = UseComplaintsContext();
  const { orders } = useOrdercontext();
  useEffect(() => {
    async function getComplaindata() {
      const Data = complaints.filter((item) => item.id === complainId);
      setComplain(Data);
      if (Data) {
        const querySnapshot = await getDocs(collection(db, `Complaints/${complainId}/Reply`));
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCustomerComplain(list);
      }
    }
    getComplaindata();
  }, [complainId]);

  async function handelSubmitReply() {
    setLoaderstatus(true);
    try {
      const adminReply = {
        created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"),
        message: replytext,
        sender_id: "admin",
      };
      const docRef = await addDoc(collection(db, `Complaints/${complainId}/Reply`), adminReply);
      // console.log("Document written with ID: ", docRef.id);
      if (customerComplain.length === 1) {
        const resolveLog = {
          description: resolutionValue,
          name: "admin",
          status: "ASSIGNED",
          updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"),
          updated_by: "admin",
        };
        await addDoc(collection(db, `Complaints/${complainId}/logs`), resolveLog);
      }
      setCustomerComplain([...customerComplain, adminReply]);
    } catch (error) {
      console.log("error : ", error);
    }
    setReply(false);
    setLoaderstatus(false);
  }

  const addResolutionData = [
    { value: "Replacement item shipped." },
    { value: "Apology letter sent with compensation." },
    { value: "Account credited with refund amount." },
    { value: "Product exchange arranged." },
    { value: "Issue escalated to senior support for further assistance." },
    { value: "Partial refund issued for the inconvenience caused." },
    { value: "Follow-up call scheduled for feedback." },
  ];

  async function handleComplaneResolve() {
    setLoaderstatus(true);
    try {
      const resolveLog = {
        description: resolutionValue,
        name: "admin",
        status: "RESOLVED",
        updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS"),
        updated_by: "admin",
      };
      await addDoc(collection(db, `Complaints/${complainId}/logs`), resolveLog);

      const changeStatus = {
        status: "RESOLVED",
      };
      const washingtonRef = doc(db, "Complaints", complainId);
      await updateDoc(washingtonRef, changeStatus);
      const changeCustomStatus = complain.filter((item) => {
        if (item.id === complainId) {
          return (item.status = "RESOLVED");
        }
      });
      setComplain(changeCustomStatus);
    } catch (error) {
      console.log("error : ", error);
    }
    setLoaderstatus(false);
  }

  const sortedComplaints = customerComplain.sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div>
        {complain.map((items, i) => {
          let orderData = orders.filter((item) => item.order_id === items.orderId);
          return (
            <div key={i} className="complain_details mt-4 pe-3">
              {items.orderId !== "" && (
                <div className="complain_head_bg d-flex align-items-center justify-content-between">
                  <p className="m-0 fs-sm fw-400 text-black px-3 white_space_nowrap">
                    ID : #{items.orderId}
                  </p>
                  <div className="d-flex flex-column align-items-center px-3  w_179">
                    <p className="m-0 fs-sm fw-400 text-black opacity-75 white_space_nowrap">
                      Date of Purchase
                    </p>
                    <p className="m-0 fw-400 text-black fs-xs">
                      {new Date(orderData[0]?.created_at)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(",", " |")
                        .replace(/^(\d{2}\/\d{2}\/\d{4})\s(\d{2}:\d{2}\s[APM]{2})$/, "$2 | $1")
                        .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")}
                    </p>
                  </div>
                  <div className="d-flex flex-column align-items-center px-3">
                    <p className="m-0 fs-sm fw-400 text-black opacity-75 white_space_nowrap">
                      Customer Name
                    </p>
                    <p className="m-0 fs-sm fw-400 text-black white_space_nowrap">
                      {items.customer.name}
                    </p>
                  </div>
                  <div className="d-flex flex-column px-3 w-100">
                    <p className="m-0 fs-sm fw-400 text-black opacity-75">Shipping Address</p>
                    <p className="m-0 fs-sm fw-400 text-black">
                      {/* #123, Area Name, City, State - Pincode */}
                      {orderData[0]?.shipping?.house_no +
                        ", " +
                        orderData[0]?.shipping?.area +
                        " ," +
                        orderData[0]?.shipping?.city +
                        ", " +
                        orderData[0]?.shipping?.state +
                        "- " +
                        orderData[0]?.shipping?.pincode}
                    </p>
                  </div>
                  <div className="px-3 d-flex">
                    <button className="on_credit_btn fs-xs fw-400 white_space_nowrap">
                      On Credit
                    </button>
                    <button className="deliverd_btn fs-xs fw-400">Delivered</button>
                  </div>
                </div>
              )}
              {addResolutionPopup ? <div className="bg_black_overlay"></div> : null}
              <div className="mt-3 p_20">
                <div>
                  {sortedComplaints.map((itm, i) => {
                    return (
                      <div key={i}>
                        {itm.sender_id !== "admin" ? (
                          <div>
                            <div className="d-flex align-items-center">
                              <img
                                className="brs_50"
                                height={60}
                                width={60}
                                src={items.customer.image !== "" ? items.customer.image : manimage}
                                alt="ComplainCusPic"
                              />
                              <div className="w-100 ms-2">
                                <div className="px_10 w-100 ps-2">
                                  <div className="d-flex align-items-center justify-content-between w-100">
                                    <p className="fs-2sm fw-500 black m-0">{items.customer.name}</p>
                                  </div>
                                  <div className="d-flex align-items-center cursor_pointer">
                                    <p className="fs-xs fw-400 black opacity-75 m-0">to me</p>
                                    <img
                                      className="px_10 "
                                      src={DropdownBlack}
                                      alt="DropdownBlack"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 ps-5 ms-4">
                              <p className="fs_16 fw-400 black mb-0">
                                Hi,
                                <span className="color_blue">{items.customer.email}</span>
                              </p>
                              <div>
                                <p className="fs-xs fw-400 black opacity-75 m-0 mt-2">
                                  {new Date(itm.created_at).toLocaleString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </p>
                                <p className="mt-2 fs-xs fw-400 black">{itm.message}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-5">
                            <div className="d-flex align-items-center">
                              <img
                                className="brs_50"
                                height={60}
                                width={60}
                                src={manimage}
                                alt="ComplainCusPic"
                              />
                              <div className="w-100 ms-2">
                                <div className="px_10 w-100">
                                  <div className="d-flex align-items-center justify-content-between w-100">
                                    <p className="fs-2sm fw-500 black m-0">STSM Team</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="fs-xs fw-400 black opacity-75 m-0 mt-2  ms-5 ps-4">
                              {new Date(itm.created_at).toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </p>
                            <p className="mt-2 fs-xs fw-400 black  ms-5 ps-4">{itm.message}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!reply && items.status === "NEW" ? (
                  <div className="d-flex align-items-center mt-4 ms-5 ps-4">
                    <button
                      onClick={() => setReply(true)}
                      className="d-flex align-items-center reply_btn gap-1">
                      <img src={ReplyBtn} alt="ReplyBtn" />
                      <p className="fs_20 fw-400 black m-0">Reply</p>
                    </button>
                    {!resolve ? (
                      <button
                        onClick={() => setAddResolutionPopup(true)}
                        className="fs_20 fw-400 text-white resolve_btn ms-2">
                        Add Resolution Log
                      </button>
                    ) : (
                      <button
                        onClick={() => handleComplaneResolve(items.id)}
                        className="fs_20 fw-400 text-white resolve_btn ms-2">
                        Resolve
                      </button>
                    )}
                  </div>
                ) : null}
                {reply ? (
                  <div className="mx-5 px-4 mt-3 pt-1">
                    <div className="d-flex align-items-end gap-2 position-relative">
                      <img
                        onClick={() => setReply(false)}
                        className="position-absolute reply_close_btn cursor_pointer"
                        src={closeIcon}
                        alt="closeIcon"
                      />
                      <textarea
                        onChange={(e) => setReplyText(e.target.value)}
                        className="complian_Reply_input"
                        placeholder="type your reply ....."></textarea>
                      <img
                        onClick={handelSubmitReply}
                        className="cursor_pointer"
                        src={SendIcon}
                        alt="SendIcon"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              {addResolutionPopup ? (
                <div className="add_resolution_popup">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fs-sm fw-400 black m-0">Add Resolution Log</p>
                    <img
                      onClick={() => setAddResolutionPopup(false)}
                      src={closeIcon}
                      alt="closeIcon"
                    />
                  </div>
                  <div className="dropdown w-100 mt-2 pt-1">
                    <button
                      style={{ height: "44px", borderRadius: "8px", backgroundColor: "#F4F4F4" }}
                      className="btn dropdown-toggle w-100"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <p
                          style={{ textAlign: "start", width: "360px", overflow: "hidden" }}
                          className="ff-outfit fw-400 fs_sm mb-0 black">
                          {resolutionValue ? resolutionValue : "Select Your Resolution.."}
                        </p>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
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
                      aria-labelledby="dropdownMenuButton3">
                      {addResolutionData.map((itmes) => {
                        return (
                          <li>
                            <div
                              onClick={() => setResolutionValue(itmes.value)}
                              className="dropdown-item py-2 cursor_pointer"
                              href="#">
                              <p className="fs-xs fw-400 balck m-0">{itmes.value}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="d-flex justify-content-end mark_resolve_btn">
                    <button
                      onClick={() => {
                        setResolve(true);
                        setAddResolutionPopup(false);
                      }}
                      className="fs-sm fw-400 white">
                      Mark Resolve
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
}

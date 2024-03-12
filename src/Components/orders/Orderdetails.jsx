import React from "react";
import saveicon from "../../Images/svgs/saveicon.svg";
import mobileicon from "../../Images/Png/mobile_icon_40.png";
import billicon from "../../Images/svgs/bill_icon.svg";
import orderAccepted from "../../Images/svgs/order-accepted.svg";
import orderDelevered from "../../Images/svgs/order-delivered.svg";
import orderDeliveryAssign from "../../Images/svgs/order-delivery-assign.svg";
import orderPlaceed from "../../Images/svgs/order-placed.svg";
import orderReject from "../../Images/svgs/order-reject.svg";
import whitesaveicon from "../../Images/svgs/white_saveicon.svg";
import profile from "../../Images/Png/customer_profile.png";
import manimage from "../../Images/Png/manimage.jpg";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useOrdercontext } from "../../context/OrderGetter";
import { doc, deleteDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

import { useUserAuth } from "../../context/Authcontext";

export default function NewOrder() {

  const { userData } = useUserAuth()
  let AdminId = userData.uuid
  console.log("Asmin ", AdminId)

  const { id } = useParams();
  const { orders, updateData } = useOrdercontext();
  let filterData = orders.filter((item) => item.id === id);
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }

  const calculateSubtotal = () => {
    return filterData[0].items.reduce(
      (acc, item) =>
        acc +
        item.varient_price * item.quantity -
        item.varient_discount * item.quantity,
      0
    );
  };

  // Calculate Total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = filterData[0].shipping_charge;
    const promoDiscount = filterData[0].promo_discount;
    return subtotal + shippingCost - promoDiscount;
  };

  const handleAcceptOrder = async (id) => {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = "CONFIRMED";

      await updateDoc(doc(db, "order", id), {
        status: newStatus,
      });

      // Add a new log entry to the logs collection
      const logData = {
        name: "Admin",
        status: newStatus,
        updated_at: new Date().toISOString(),
        updated_by: AdminId
      };

      await addDoc(collection(db, `order/${id}/logs`), logData);


      const AssignDeliver = {
        name: "Admin",
        status: "PROCESSING",
        updated_at: new Date().toISOString(),
        updated_by: AdminId
      }
      await addDoc(collection(db, `order/${id}/logs`), AssignDeliver);
      updateData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectOrder = async (id) => {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = "REJECTED";
      await updateDoc(doc(db, "order", id), {
        status: newStatus,
      });
      // Add a new log entry to the logs collection
      const logData = {
        name: "Admin",
        status: newStatus,
        updated_at: new Date().toISOString(),
        updated_by: AdminId
      };
      await addDoc(collection(db, "logs"), logData);

      updateData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      {filterData.map((item, index) => (
        <div
          key={index}
          className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100"
        >
          <div className="d-flex align-items-center justify-content-between py-3 my-1">
            <div className="d-flex align-items-center">
              <h1 className="fs-lg fw-500 black mb-0 me-1">{item.id}</h1>
              <p
                className={`d-inline-block ms-3 ${item.status.toString().toLowerCase() === "new"
                  ? "fs-sm fw-400 red mb-0 new_order"
                  : item.status.toString().toLowerCase() === "confirmed"
                    ? "fs-sm fw-400 mb-0 processing_skyblue"
                    : item.status.toString().toLowerCase() === "delivered"
                      ? "fs-sm fw-400 mb-0 green stock_bg"
                      : "fs-sm fw-400 mb-0 black cancel_gray"
                  }`}
              >
                {item.status}
              </p>
            </div>
            {item.status === "NEW" ? (
              <div className="d-flex align-items-center">
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button onClick={() => handleRejectOrder(item.id)} className="fs-sm reset_btn  border-0 fw-400">
                      Reject Order
                    </button>
                  </button>
                  <button
                    onClick={() => handleAcceptOrder(item.id)}
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                    type="submit"
                  >
                    <img src={saveicon} alt="saveicon" />
                    ACCEPT ORDER
                  </button>
                </div>
              </div>
            ) : item.status === "CANCELLED" ? (
              <div className="d-flex align-items-center">
                <button
                  className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black"
                  type="submit"
                >
                  <img src={saveicon} alt="saveicon" />
                  Mark as Refunded
                </button>
              </div>
            ) : item.status === "RETURNED" ? (
              <div></div>
            ) : item.status === "DISPATCHED" ? (
              <div></div>
            ) : item.status === "CONFIRMED" ? (
              <div className="d-flex align-items-center">
                <div className="d-flex align-itmes-center gap-3">

                  <button
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 green_btn fw-400 white"
                    type="submit"
                  >
                    <img src={whitesaveicon} alt="whitesaveicon" />
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="d-flex align-items-center gap-4 py-3 px-2 mt-2 mb-3">
            <p className="fs-xs fw-400 black mb-0">
              {formatDate(item.created_at)}
            </p>
            <span>|</span>
            <p className="fs-xs fw-400 black mb-0">{item.items.length}</p>
            <span>|</span>
            <p className="fs-xs fw-400 black mb-0">
              ₹ {calculateTotal().toFixed(2)}
            </p>
            <span>|</span>
            <p className="fs-xs fw-400 black mb-0 paid stock_bg">
              {item.transaction.status.toUpperCase()}
            </p>
          </div>
          <Row className="">
            <Col xxl={8}>
              <div className="p-3 bg-white product_shadow">
                <p className="fs-2sm fw-400 black mb-0">Items</p>
                {item.items.map((products, index) => {
                  return (
                    <>
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="d-flex align-items-center mw-300 p-2">
                          <div style={{}}>
                            <img
                              src={products.image}
                              alt="mobileicon"
                              className="items_images"
                            />
                          </div>
                          <div className="ps-3">
                            <p className="fs-sm fw-400 black mb-0">
                              {products.title}{" "}
                              {products.varient_name
                                .toString()
                                .toLowerCase() !== "not found" && (
                                  <span className="fs-sm fw-400 black mb-0 ms-3">
                                    {products.varient_name}
                                  </span>
                                )}
                            </p>
                            <p className="fs-xxs fw-400 fade_grey mb-0">
                              ID :{products.product_id}
                            </p>
                            {products.color.toString().toLowerCase() != "" && (
                              <p className="fs-xxs fw-400 fade_grey mb-0">
                                color :{products.color}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center p-3">
                          <p className="fs-sm fw-400 black mb-0">
                            ₹ {products.varient_price}{" "}
                            <span className="ms-4">X</span>
                          </p>
                          <p className="fs-sm fw-400 black mb-0 ps-4 ms-2 me-5">
                            {products.quantity}
                          </p>
                          <p className="fs-sm fw-400 black mb-0 ps-4 ms-5 ps-5 ">
                            (-) ₹{" "}
                            {products.varient_discount * products.quantity}
                          </p>
                        </div>
                        <p className="fs-sm fw-400 black mb-0 p-3">
                          ₹{" "}
                          {products.varient_price * products.quantity -
                            products.varient_discount * products.quantity}
                        </p>
                      </div>
                    </>
                  );
                })}
                {/* <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="d-flex align-items-center mw-300 p-2">
                    <img src={mobileicon} alt="mobileicon" />
                    <div className="ps-3">
                      <p className="fs-sm fw-400 black mb-0">Vivo V3 Pro</p>
                      <p className="fs-xxs fw-400 fade_grey mb-0">ID : 1022</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center p-3">
                    <p className="fs-sm fw-400 black mb-0">₹ 300.00</p>
                    <p className="fs-sm fw-400 black mb-0 ps-4 ms-2">1</p>
                  </div>
                  <p className="fs-sm fw-400 black mb-0 p-3">₹ 300.00</p>
                </div> */}
                <div className="product_borderbottom mt-3"></div>
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <p className="fs-sm fw-400 black mb-0">Subtotal</p>
                  <p className="fs-sm fw-400 black mb-0">
                    ₹{calculateSubtotal().toFixed(2)}
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <p className="fs-sm fw-400 black mb-0">Shipping Cost</p>
                  <p className="fs-sm fw-400 black mb-0">
                    ₹ {item.shipping_charge}
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
                  <p className="fs-sm fw-400 black mb-0">Promo Discount</p>
                  <p className="fs-sm fw-400 black mb-0">
                    (-) ₹ {item.promo_discount}
                  </p>
                </div>
                <div className="product_borderbottom mt-3"></div>
                <div>
                  <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
                    <p className="fs-sm fw-400 black mb-0">Total</p>
                    <p className="fs-sm fw-700 black mb-0">
                      ₹ {calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="product_shadow bg-white mt-4 p-3 position-relative z-1">
                <p className="fs-2sm fw-400 black mb-0">Order Logs</p>
                <div className="order_logs_line">
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img src={orderPlaceed} alt="orderPlaceed" />
                      <p className="fs-sm fw-400 black mb-0 ps-3 ms-1">
                        Order Placed
                      </p>
                    </div>
                    <div>
                      <p className="fs-xs fw-400 black mb-0">
                        01-01-2024 <br />
                        10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img src={orderAccepted} className="bg-white" alt="orderAccepted" />
                      <div className=" ps-3 ms-1">
                        <p className="fs-sm fw-400 black mb-0">
                          Order Accepted
                        </p>
                        <p className="fs-xxs fw-400 black mb-0">By : Admin</p>
                      </div>
                    </div>
                    <div>
                      <p className="fs-xs fw-400 black mb-0">
                        01-01-2024 <br />
                        10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img src={orderReject} className="bg-white" alt="orderReject" />
                      <div className=" ps-3 ms-1">
                        <p className="fs-sm fw-400 black mb-0">
                          Order Rejected
                        </p>
                        <p className="fs-xxs fw-400 black mb-0">By : Admin</p>
                      </div>
                    </div>
                    <div>
                      <p className="fs-xs fw-400 black mb-0">
                        01-01-2024 <br />
                        10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img className="bg-white"
                        src={orderDeliveryAssign}
                        alt="orderDeliveryAssign"
                      />
                      <p className="fs-sm fw-400 black mb-0 ps-3 ms-1">
                        Assigned for Delivery
                      </p>
                    </div>
                    <div>
                      <p className="fs-xs fw-400 black mb-0">
                        01-01-2024 <br />
                        10:00 AM
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img className="bg-white" src={orderDelevered} alt="orderDelevered" />
                      <div className=" ps-3 ms-1">
                        <p className="fs-sm fw-400 black mb-0">
                          Order Delivered
                        </p>
                        <p className="fs-xxs fw-400 black mb-0">By : Ramesh Kumar (Delivery Man)</p>
                      </div>
                    </div>
                    <div>
                      <p className="fs-xs fw-400 black mb-0">
                        01-01-2024 <br />
                        10:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xxl={4}>
              <div className="p-3 bg-white product_shadow">
                <p className="fs-2sm fw-400 black mb-0">Customer</p>
                <div className="d-flex align-items-center p-2 mt-3">
                  <img src={manimage} alt="profile" className="manicon " />
                  <div className="ps-3">
                    <p className="fs-sm fw-400 black mb-0">
                      {item.customer.name}
                    </p>
                    <p className="fs-xxs fw-400 fade_grey mb-0">
                      {item.customer.email === "" ? "N/A" : item.customer.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="fs-2sm fw-400 black mb-0">Contact</p>
                  <p className="fs-xs fw-400 black mb-0 pt-1 mt-3">
                    {item.customer.name}
                  </p>
                  <p className="fs-xs fw-400 black mb-0 pt-1">
                    {item.customer.phone}
                  </p>
                  <p className="fs-xs fw-400 black mb-0 pt-1">
                    {item.customer.email}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-white product_shadow mt-4">
                <p className="fs-2sm fw-400 black mb-0">Shipping Info</p>
                <p className="fs-xs fw-400 black mb-0 pt-1 mt-3">
                  {item.shipping.contact_person}
                </p>
                <p className="fs-xs fw-400 black mb-0 pt-1">
                  {item.shipping.address}
                </p>
                <p className="fs-xs fw-400 black mb-0 pt-1">
                  {item.shipping.contact_no}
                </p>
              </div>
              <div className="p-3 bg-white product_shadow mt-4">
                <p className="fs-2sm fw-400 black mb-0">Transactions</p>
                <div className="d-flex flex-column mt-3">
                  <div className="p-2">
                    <p className="fs-sm fw-400 black mb-0">Mode of Payment</p>
                    <p className="fs-xxs fw-400 fade_grey mb-0">
                      {item.transaction.mode} | tx :{" "}
                      {item.transaction.tx_id === ""
                        ? "N/A"
                        : item.transaction.tx_id}{" "}
                      | {formatDate(item.transaction.date)}
                    </p>
                  </div>
                  <p className="fs-sm fw-400 black mb-0 p-3 ps-0">
                    ₹ {calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              {item.status != "NEW" ? (
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="d-flex align-items-center bill_generate"
                  >
                    <img src={billicon} alt="billicon" />
                    <p className="fs-sm fw-400 black mb-0 ms-2">
                      Generate Bill
                    </p>
                  </button>
                </div>
              ) : null}
            </Col>
          </Row>
        </div>
      ))}
    </>
  );
}

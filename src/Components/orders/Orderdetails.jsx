import React, { useRef } from "react";
import saveicon from "../../Images/svgs/saveicon.svg";
import mobileicon from "../../Images/Png/mobile_icon_40.png";
import billicon from "../../Images/svgs/bill_icon.svg";
import orderAccepted from "../../Images/svgs/order-accepted.svg";
import billLogo from "../../Images/svgs/bill-logo.svg";
import orderDelevered from "../../Images/svgs/order-delivered.svg";
import orderDeliveryAssign from "../../Images/svgs/order-delivery-assign.svg";
import orderPlaceed from "../../Images/svgs/order-placed.svg";
import orderReject from "../../Images/svgs/order-reject.svg";
import whitesaveicon from "../../Images/svgs/white_saveicon.svg";
import orderCanceled from "../../Images/svgs/order_Canceled.svg";
import CloseIcon from "../../Images/svgs/closeicon.svg";
import profile from "../../Images/Png/customer_profile.png";
import manimage from "../../Images/Png/manimage.jpg";
import { Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useOrdercontext } from "../../context/OrderGetter";
import { ReactToPrint } from "react-to-print";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import {
  doc,
  updateDoc,
  getDocs,
  addDoc,
  collection,
  query,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/Authcontext";
import Loader from "../Loader";
import { useCustomerContext } from "../../context/Customergetters";
import { useProductsContext } from "../../context/productgetter";

export default function NewOrder() {
  const componentRef = useRef();
  const { userData } = useUserAuth();
  // console.log("user data ", userData)
  let AdminId = userData.uuid;
  // console.log("Asmin ", AdminId)

  const { id } = useParams();
  const { DeliveryManData } = UseDeliveryManContext();
  const { orders, updateData } = useOrdercontext();
  const [filterData, setfilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeliveryManId, setSelectedDeliveryManId] = useState(null);
  const [customSelectDeliveryManId, setCustomSelectDeliveryManId] =
    useState(null);
  const [isDeliverymanPopup, setIssDeliverymanPopup] = useState(false);
  const { customer } = useCustomerContext();
  const [customertoken, setCustomertoken] = useState(null);
  const { productData } = useProductsContext();

  useEffect(() => {
    if (filterData.length === 1) {
      let filtercustomerid = customer.filter(
        (value) => value.uid === filterData[0].uid
      );

      setCustomertoken(filtercustomerid[0].devices_token);
    }
  }, [filterData]);

  useEffect(() => {
    const orderData = orders.filter((item) => item.order_id === id);
    setfilterData(orderData);
  }, [orders, id]);

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const order = orders.find((item) => item.order_id === id);
    if (order) {
      const fetchLogs = async () => {
        const q = query(collection(db, `order/${order.id}/logs`));
        const querySnapshot = await getDocs(q);
        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setLogs(logsData);
      };
      fetchLogs();
    }
  }, [id, orders]);

  // let DocumentId  = filterData[0].id
  if (!id || filterData.length === 0) {
    return <Loader> </Loader>;
  }

  function formatDate(dateString) {
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
    const promoDiscount = filterData[0].additional_discount.discount;
    return subtotal + shippingCost - promoDiscount;
  };

  //  generate invoiceNumber
  const getInvoiceNo = async () => {
    const year = new Date().getFullYear() % 100; // Get the last two digits of the current year
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomDigits = "";
    for (let i = 0; i < 6; i++) {
      randomDigits += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return `ST${year}${randomDigits}`;
  };

  const handleAcceptOrder = async (id, order_id) => {
    setLoading(true);
    const orderDocRef = doc(db, "order", id);
    const orderDoc = await getDoc(orderDocRef);
    const orderData = orderDoc.data();
    try {
      const invoiceNumber = await getInvoiceNo();
      const newStatus = "CONFIRMED";
      if (!orderData.hasOwnProperty("invoiceNumber")) {
        await updateDoc(orderDocRef, {
          status: newStatus,
          invoiceNumber: invoiceNumber,
        });
      } else {
        await updateDoc(orderDocRef, {
          status: newStatus,
        });
        setLoading(false);
      }

      // Add a new log entry to the logs collection
      // const logData = {
      //   name: "Admin",
      //   status: newStatus,
      //   updated_at: new Date().toISOString(),
      //   updated_by: AdminId,
      //   tokens: customertoken,
      //   description: `order #${order_id} has been confirmed! we will notify you once it's on its way."`,
      // };

      // await addDoc(collection(db, `order/${id}/logs`), logData);

      // const AssignDeliver = {
      //   name: "Admin",
      //   status: "PROCESSING",
      //   updated_at: new Date().toISOString(),
      //   updated_by: AdminId,
      //   description:
      //     "Order assigned to the delivery partner for shipment. Preparing for dispatch.",
      // };
      // await addDoc(collection(db, `order/${id}/logs`), AssignDeliver);
      // updateData({
      //   id,
      //   status: newStatus,
      //   invoiceNumber: invoiceNumber,
      //   assign_to:
      //     deliverymenWithArea.length !== 0
      //       ? autoSelectedDeliveryManId
      //       : selectedDeliveryManId,
      // });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRejectOrder = async (id) => {
    setLoading(true);
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = "REJECTED";
      await updateDoc(doc(db, "order", id), {
        status: newStatus,
      });
      // Add a new log entry to the logs collection
      // const logData = {
      //   name: "Admin",
      //   status: newStatus,
      //   updated_at: new Date().toISOString(),
      //   updated_by: AdminId,
      //   description:
      //     "Seller rejected the order due to unavailability of item or other reasons. Refund process initiated.",
      // };
      // await addDoc(collection(db, `order/${id}/logs`), logData);
      updateData({ id, status: newStatus });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  async function handleMarkAsDelivered(id, order_id) {
    setLoading(true);
    try {
      const usetoken = doc(db, "User", "ti5NJbZ865UFK6iNb431iiHqCox1");
      const Getusertoken = await getDoc(usetoken);
      const usertoken = Getusertoken.data();
      // console.log("Getusertoken", usertoken.token);
      const tokens = [...customertoken, ...usertoken.token];
      let transcationmode = filterData[0].transaction.mode;
      // Toggle the status between 'publish' and 'hidden'
      let transaction = {
        date: new Date().toISOString(),
        mode: "Cash on Delivery",
        status: "Paid",
        tx_id: "",
      };
      const newStatus = "DELIVERED";
      if (transcationmode === "Cash on Delivery") {
        await updateDoc(doc(db, "order", id), {
          status: newStatus,
          transaction,
        });
      } else {
        await updateDoc(doc(db, "order", id), {
          status: newStatus,
          assign_to: "",
        });
      }
      // Add a new log entry to the logs collection
      // const logData = {
      //   name: "Store",
      //   status: newStatus,
      //   updated_at: new Date().toISOString(),
      //   updated_by: AdminId,
      //   tokens: tokens,
      //   description: `Order #${order_id}  has been successfully delivered! We hope you’re happy with your purchase. If you need any assistance, feel free to contact us. We’d love to hear your feedback – please take a moment to rate our service and help us improve! ${"https://play.google.com/store/apps/details?id=com.hexabird.stsm&hl=en"}`,
      // };
      // await addDoc(collection(db, `order/${id}/logs`), logData);
      updateData({ id, status: newStatus, assign_to: "" });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function handlePreparedPacking(id, order_id) {
    setLoading(true);
    try {
      const newStatus = "PROCESSING";
      // const logData = {
      //   name: "Store",
      //   status: newStatus,
      //   updated_at: new Date().toISOString(),
      //   updated_by: AdminId,
      //   tokens: customertoken,
      //   description: `Order #${order_id} is sent for packaging. We’re working to ensure it’s carefully prepared for delivery.`,
      // };
      // await addDoc(collection(db, `order/${id}/logs`), logData);
      updateData({ id, status: newStatus });
      await updateDoc(doc(db, "order", id), {
        status: newStatus,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function handlePreparedDelivery(id, order_id) {
    setLoading(true);
    const orderDocRef = doc(db, "order", id);
    const orderDoc = await getDoc(orderDocRef);
    const orderData = orderDoc.data();
    let area = orderData.shipping.area.toLowerCase();
    // console.log("Area is ", area);

    // Filter the deliverymen whose service areas include the desired area
    const deliverymenWithArea = DeliveryManData.filter(
      (deliveryman) =>
        deliveryman.profile_status === "APPROVED" &&
        deliveryman.is_verified === true &&
        deliveryman.serviceArea &&
        deliveryman.serviceArea.some(
          (areas) =>
            areas.terretory &&
            areas.terretory.some((t) => t.toLowerCase() === area)
        )
    );

    // console.log(deliverymenWithArea);
    if (deliverymenWithArea.length !== 0 || selectedDeliveryManId !== null) {
      try {
        const orderDocRef = doc(db, "order", id);
        const orderDoc = await getDoc(orderDocRef);
        const orderData = orderDoc.data();
        const invoiceNumber = await getInvoiceNo();
        let area = orderData.shipping.area.toLowerCase();
        // Filter the deliverymen whose service areas include the desired area
        const deliverymenWithArea = DeliveryManData.filter(
          (deliveryman) =>
            deliveryman.profile_status === "APPROVED" &&
            deliveryman.is_verified === true &&
            deliveryman.serviceArea &&
            deliveryman.serviceArea.some(
              (areas) =>
                areas.terretory &&
                areas.terretory.some((t) => t.toLowerCase() === area)
            )
        );
        let autoSelectedDeliveryManId = null;
        if (deliverymenWithArea.length > 1) {
          let orderProductsIds = [];
          let deliverymanIds = [];
          // Collect product IDs from filterData
          filterData.forEach((item) =>
            item.items.forEach((product) =>
              orderProductsIds.push(product.product_id)
            )
          );

          // console.log("ordered p id", orderProductsIds[0]);

          // const productlist = productData.filter((value) => {
          //   return value.id === orderProductsIds[0];
          // });

          // const orderQuantity = orders.filter((value) => {
          //   return value.order_id === order_id
          // });

          // console.log(orderQuantity, "orderQuantity========");
          // console.log(productlist[0].totalStock, "productlist");

          // Iterate over each deliveryman to fetch their van data
          for (let deliveryman of deliverymenWithArea) {
            const q = query(collection(db, `Delivery/${deliveryman.id}/Van`));
            const querySnapshot = await getDocs(q);
            const vans = querySnapshot.docs.map((doc) => doc.data());
            // Check if this van contains all orderProductsIds and has sufficient quantity
            if (
              orderProductsIds.every((id) =>
                vans.some(
                  (van) =>
                    van.productid === id &&
                    van.quantity >=
                      orderData.items.find((item) => item.product_id === id)
                        .quantity
                )
              )
            ) {
              deliverymanIds.push(deliveryman.id);
            }
          }

          // Find deliveryman with fewest orders
          if (deliverymanIds.length > 1) {
            let minOrderCount = Infinity;
            let deliverymanWithFewestOrders = null;
            // Count orders per deliveryman
            const ordersCount = {};
            let lowOrder;
            orders.forEach((order) => {
              if (
                order.status === "PROCESSING" &&
                deliverymanIds.includes(order.assign_to)
              ) {
                if (!ordersCount[order.assign_to]) {
                  ordersCount[order.assign_to] = 0;
                }
                ordersCount[order.assign_to]++;
              }
            });
            for (let noOrder in ordersCount) {
              lowOrder = deliverymanIds.filter((id) => id !== noOrder);
            }
            // Find deliveryman with the fewest orders
            let randomdeliveryMan;
            if (Array.isArray(lowOrder) && lowOrder.length > 0) {
              randomdeliveryMan = Math.floor(Math.random() * lowOrder.length);
            }
            // Find deliveryman with the fewest orders
            if (Array.isArray(lowOrder) && lowOrder.length === 0) {
              deliverymanIds.forEach((deliverymanId) => {
                const orderCount = ordersCount[deliverymanId] || 0;
                if (orderCount < minOrderCount) {
                  minOrderCount = orderCount;
                  deliverymanWithFewestOrders = deliverymanId;
                }
              });
              console.log(
                "Deliveryman with the fewest orders1:",
                deliverymanWithFewestOrders
              );
              autoSelectedDeliveryManId = deliverymanWithFewestOrders;
            } else if (Array.isArray(lowOrder) && lowOrder.length !== 0) {
              console.log("random1", lowOrder[randomdeliveryMan]);
              autoSelectedDeliveryManId = lowOrder[randomdeliveryMan];
            } else {
              let randomdeliveryManid = Math.floor(
                Math.random() * deliverymanIds.length
              );
              console.log(deliverymanIds[randomdeliveryManid]);
              autoSelectedDeliveryManId = deliverymanIds[randomdeliveryManid];
            }
          } else if (deliverymanIds.length === 0) {
            let minOrderCount = Infinity;
            let deliverymanWithFewestOrders = null;
            // Count orders per deliveryman
            const ordersCount = {};
            let lowOrder = [];
            orders.forEach((order) => {
              if (order.status === "CONFIRMED") {
                if (!ordersCount[order.assign_to]) {
                  ordersCount[order.assign_to] = 0;
                }
                ordersCount[order.assign_to]++;
              }
            });
            // Find deliveryman with the fewest orders
            deliverymenWithArea.forEach((deliverymanId) => {
              const orderCount =
                ordersCount[deliverymanId.id] ??
                lowOrder.push(deliverymanId.id);
              if (orderCount < minOrderCount && lowOrder.length == 0) {
                minOrderCount = orderCount;
                deliverymanWithFewestOrders = deliverymanId.id;
              }
            });
            if (Array.isArray(lowOrder) && lowOrder.length !== 0) {
              let idIndex = Math.floor(Math.random() * lowOrder.length);
              deliverymanWithFewestOrders = lowOrder[idIndex];
            }
            console.log(
              "Deliveryman with the fewest orders2:",
              deliverymanWithFewestOrders
            );
            autoSelectedDeliveryManId = deliverymanWithFewestOrders;
            // console.log(lowOrder);
          }
        } else if (deliverymenWithArea.length === 1) {
          autoSelectedDeliveryManId = deliverymenWithArea[0].id;
          console.log("only one deliveryman", deliverymenWithArea[0].id); // Assuming deliveryman object has an 'id' property
        }

        if (orderData && orderData.items) {
          for (const item of orderData.items) {
            const productDocRef = doc(db, "products", item.product_id);
            const productDoc = await getDoc(productDocRef);
            const productData = productDoc.data();

            if (productData) {
              const newQuantity = productData.totalStock - item.quantity;
              await updateDoc(productDocRef, { totalStock: newQuantity });
            }
          }
        }

        const newStatus = "OUT_FOR_DELIVERY";
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (!orderData.hasOwnProperty("invoiceNumber")) {
          await updateDoc(orderDocRef, {
            status: newStatus,
            OTP: otp,
            invoiceNumber: invoiceNumber,
            tokens: customertoken,
            assign_to:
              deliverymenWithArea.length !== 0
                ? autoSelectedDeliveryManId
                : selectedDeliveryManId,
          });
        } else {
          await updateDoc(orderDocRef, {
            status: newStatus,
            OTP: otp,
            assign_to:
              deliverymenWithArea.length !== 0
                ? autoSelectedDeliveryManId
                : selectedDeliveryManId,
          });
          setLoading(false);
        }
        let selecteddeliveryData = DeliveryManData.filter(
          (item) =>
            item.id === autoSelectedDeliveryManId ||
            item.id === selectedDeliveryManId
        );
        const token = [...customertoken, ...selecteddeliveryData[0].tokens];

        updateData({
          id,
          status: newStatus,
          OTP: otp,
          invoiceNumber: invoiceNumber,
          assign_to:
            deliverymenWithArea.length !== 0
              ? autoSelectedDeliveryManId
              : selectedDeliveryManId,
        });

        // const logData = {
        //   name: "Store",
        //   status: newStatus,
        //   updated_at: new Date().toISOString(),
        //   updated_by: AdminId,
        //   description: `Great news! order #${order_id} now being packed and out for delivery and should arrive soon.
        //  Your delivery person, ${selecteddeliveryData[0].basic_info.name}, is on their way and can be reached at ${selecteddeliveryData[0].basic_info.phone_no} if you have any questions or need to provide additional instructions. Stay tuned for further updates!`,
        // };
        // await addDoc(collection(db, `order/${id}/logs`), logData);
        console.log("object");
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setIssDeliverymanPopup(true);
    }
  }

  const renderLogIcon = (status) => {
    switch (status) {
      case "NEW":
        return <img src={orderPlaceed} alt="orderPlaced" />;
      case "CONFIRMED":
        return (
          <img src={orderAccepted} className="bg-white" alt="orderAccepted" />
        );
      case "REJECTED":
        return (
          <img src={orderReject} className="bg-white" alt="orderRejected" />
        );
      case "PROCESSING":
        return (
          <img
            className="bg-white"
            src={orderDeliveryAssign}
            alt="orderDeliveryAssign"
          />
        );

      case "OUT_FOR_DELIVERY":
        return (
          <img
            className="bg-white"
            src={orderDeliveryAssign}
            alt="orderDeliveryAssign"
          />
        );
      case "DELIVERED":
        return (
          <img className="bg-white" src={orderDelevered} alt="orderDelivered" />
        );
      case "CANCELLED":
        return (
          <img className="bg-white" src={orderCanceled} alt="orderCanceled" />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader> </Loader>;
  }

  return (
    <div className="overflow-hidden">
      {isDeliverymanPopup && <div className="bg_black_overlay"></div>}

      {filterData.map((item, index) => {
        return (
          <div
            key={index}
            className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100"
          >
            <div className="d-flex align-items-center justify-content-between py-3 my-1">
              <div className="d-flex align-items-center">
                <h1 className="fs-lg fw-500 black mb-0 me-1">
                  #{item.order_id}
                </h1>
                <p
                  className={`d-inline-block ms-3 ${
                    item.status.toString().toLowerCase() === "new"
                      ? "fs-sm fw-400 red mb-0 new_order"
                      : item.status.toString().toLowerCase() === "confirmed"
                      ? "fs-sm fw-400 mb-0 processing_skyblue"
                      : item.status.toString().toLowerCase() === "delivered"
                      ? "fs-sm fw-400 mb-0 green stock_bg"
                      : "fs-sm fw-400 mb-0 black processing_skyblue"
                  }`}
                >
                  {item.status}
                </p>
              </div>
              {item.status === "NEW" ? (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-itmes-center gap-3">
                    <button className="reset_border">
                      <button
                        onClick={() => handleRejectOrder(item.id)}
                        className="fs-sm reset_btn  border-0 fw-400"
                      >
                        Reject Order
                      </button>
                    </button>

                    <button
                      onClick={() => handleAcceptOrder(item.id, item.order_id)}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                      type="submit"
                    >
                      <img src={saveicon} alt="saveicon" />
                      ACCEPT ORDER
                    </button>

                    {isDeliverymanPopup && (
                      <div className="deliveryman_popup_list">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <p className=" fs-5 mb-0">Chosse a delivery man</p>
                          <img
                            onClick={() => setIssDeliverymanPopup(false)}
                            className="cursor_pointer"
                            src={CloseIcon}
                            alt="closeicon"
                          />
                        </div>
                        <div className="deliveryman_list">
                          <table className="w-100">
                            <tr>
                              <th className="w-50 pb-2">Name</th>
                              <th className="w-50 pb-2">Pincode</th>
                            </tr>
                            {DeliveryManData.map((items, index) => {
                              return (
                                <tr key={index}>
                                  {items.serviceArea &&
                                  items.serviceArea.length > 0 ? (
                                    <>
                                      <td className="d-flex align-items-center py-1 w-100">
                                        <input
                                          onChange={() =>
                                            setSelectedDeliveryManId(items.uid)
                                          }
                                          type="checkbox"
                                          checked={
                                            selectedDeliveryManId === items.uid
                                          }
                                        />
                                        <p className="ms-2 mb-0 w-100">
                                          {items.basic_info.name}
                                        </p>
                                      </td>
                                      {items.serviceArea.map((itm, ind) => {
                                        console.log(itm, " asfdasfasfsafafa");
                                        return (
                                          <td key={ind} className="w-100">
                                            {itm.area_name} ({itm.pincode})
                                          </td>
                                        );
                                      })}
                                    </>
                                  ) : null}
                                </tr>
                              );
                            })}
                          </table>
                        </div>
                        <div className="d-flex justify-content-end gap-3 mt-3">
                          <button
                            onClick={() => setIssDeliverymanPopup(false)}
                            className="cancel_btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleAcceptOrder(item.id);
                              setIssDeliverymanPopup(false);
                            }}
                            className="save_btn"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
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
                <div>
                  <button
                    onClick={() =>
                      handlePreparedPacking(item.id, item.order_id, item)
                    }
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-3 save_btn fw-400 black"
                    type="submit"
                  >
                    <img src={saveicon} alt="saveicon" />
                    Prepared For Packing
                  </button>
                </div>
              ) : item.status === "PROCESSING" ? (
                <div>
                  <button
                    onClick={() =>
                      handlePreparedDelivery(item.id, item.order_id)
                    }
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-3 save_btn fw-400 black"
                    type="submit"
                  >
                    <img src={saveicon} alt="saveicon" />
                    Out for Delivery
                  </button>
                </div>
              ) : item.status === "OUT_FOR_DELIVERY" ? (
                <div className="d-flex align-items-center">
                  <div className="d-flex align-itmes-center gap-3">
                    <button
                      onClick={() =>
                        handleMarkAsDelivered(item.id, item.order_id)
                      }
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
              {item.status != "NEW" ? (
                <ReactToPrint
                  trigger={() => {
                    return (
                      <button
                        type="button"
                        className="d-flex align-items-center bill_generate mt-0"
                      >
                        <img src={billicon} alt="billicon" />
                        <p className="fs-sm fw-400 black mb-0 ms-2">
                          Generate Bill
                        </p>
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                  documentTitle="Invoice"
                  pageStyle="print"
                />
              ) : null}
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
                              {products.color.toString().toLowerCase() !=
                                "" && (
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
                      (-) ₹ {item.additional_discount.discount}
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
                    {logs
                      .sort(
                        (a, b) =>
                          new Date(a.data.updated_at) -
                          new Date(b.data.updated_at)
                      )
                      .map((log, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between mt-3"
                        >
                          {/* <div className="d-flex align-items-center">
                        {renderLogIcon(log.data.status)}
                        <div className="ps-3 ms-1">
                          <p className="fs-sm fw-400 black mb-0">{log.data.status}</p>
                          <p className="fs-xxs fw-400 black mb-0">By: {log.data.by}</p>
                        </div>
                      </div> */}
                          <div className="d-flex align-items-start">
                            {renderLogIcon(log.data.status)}
                            <div className="ps-2 ms-1">
                              <p className="fs-sm fw-400 black mb-0 ps-3 ms-1">
                                {" "}
                                {log.data.status === "PROCESSING"
                                  ? "PROCESSING"
                                  : log.data.status === "NEW"
                                  ? "ORDER PLACED"
                                  : log.data.status}{" "}
                              </p>
                              <p className="fs-xxs fw-400 black ps-3 ms-1 mb-0">
                                {log.data.name}
                              </p>
                              <p className="fs-xs fw-400 black ps-3 ms-1 mb-0 opacity-50">
                                {log.data.description}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="fs-xs fw-400 black mb-0 text-nowrap ps-3">
                              {formatDate(log.data.updated_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="d-flex align-items-center">
                      <img src={orderPlaceed} alt="orderPlaceed" />
                      <p className="fs-sm fw-400 black mb-0 ps-3 ms-1">
                        Order Placed
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
                  </div> */}
                </div>
                {/* </div> */}
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
                        {item.customer.email === ""
                          ? "N/A"
                          : item.customer.email}
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
                {(item.transaction.mode === "Cash on Delivery" ||
                  item.transaction.mode === "UPI / Bank Transfer" ||
                  item.transaction.mode === "Pay Later / Credit") &&
                (item.transaction.status === "Paid" ||
                  item.status === "DELIVERED") ? (
                  <div className="p-3 bg-white product_shadow mt-4">
                    <p className="fs-2sm fw-400 black mb-0">Transactions</p>
                    <div className="d-flex flex-column mt-3">
                      <div className="p-2">
                        <p className="fs-sm fw-400 black mb-0">
                          Mode of Payment
                        </p>
                        <p className="fs-xxs fw-400 fade_grey mb-0">
                          {item.transaction.mode}
                          {item.transaction.tx_id && (
                            <> tx : {item.transaction.tx_id} </>
                          )}
                          {item.transaction.date && (
                            <>
                              {"  "} | {formatDate(item.transaction.date)}
                            </>
                          )}
                        </p>
                      </div>
                      <p className="fs-sm fw-400 black mb-0 p-3 ps-0">
                        ₹ {calculateTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
          </div>
        );
      })}
      <div className="order_details_bill">
        <div>
          {filterData.length > 0
            ? filterData.map((items) => {
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
                            Invoice Date : {formatDate(items.created_at)}
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
                          <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
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
                              <th className="fs-xxs fw-400 black py_2">Date</th>
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
                                {formatDate(items.transaction.date)}
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
    </div>
  );
}

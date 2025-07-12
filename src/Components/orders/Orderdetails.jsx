import React, { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import proccesing from "../../Images/svgs/proccesing.svg";
import profile from "../../Images/Png/customer_profile.png";
import manimage from "../../Images/Png/manimage.jpg";
import deliveryman_not_found from "../../Images/Png/deliveryman_not_found.webp";
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
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/Authcontext";
import Loader from "../Loader";
import { useCustomerContext } from "../../context/Customergetters";
import { useProductsContext } from "../../context/productgetter";
import { CrossIcons } from "../../Common/Icon";

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
  const [orderid, setOrderid] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDeliveryManId, setSelectedDeliveryManId] = useState(null);
  const [selectedDeliveryManName, setSelectedDeliveryManName] = useState(null);
  const [isDeliverymanPopup, setIssDeliverymanPopup] = useState(false);
  const [isfilterDeliverymanPopup, setIsFilterDeliverymanPopup] = useState(
    false
  );
  const [allDeliverymans, setAllDeliverymans] = useState(null);
  const { customer } = useCustomerContext();
  const [customertoken, setCustomertoken] = useState(null);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (filterData.length === 1) {
      let filtercustomerid = customer.filter(
        (value) => value.uid === filterData[0].uid
      );
      setCustomertoken(filtercustomerid[0]?.devices_token);
    }
  }, [filterData]);

  useEffect(() => {
    if (orders.length !== 0) {
      const orderData = orders.filter((item) => item.order_id === id);
      setOrderid(orderData[0].id);
      setfilterData(orderData);
    }
  }, [orders, id]);

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

  const handleAcceptOrder = async (id) => {
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

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCancelOrRejectOrder = async (order) => {
    console.log(order);
    setLoading(true);
    try {
      let newStatus = order.status === "NEW" ? "REJECTED" : "CANCELLED";

      await updateDoc(doc(db, "order", order), {
        status: newStatus,
      });

      updateData({ id: order, status: newStatus });
    } catch (error) {
      console.log("Error cancelling/rejecting order:", error);
    } finally {
      setLoading(false);
    }
  };
  async function handlePreparedPacking(id) {
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

  async function handlePreparedDelivery(id) {
    try {
      setLoading(true);

      // Get order data
      const orderDocRef = doc(db, "order", id);
      const orderDoc = await getDoc(orderDocRef);
      const orderData = orderDoc.data();

      // Determine delivery area
      const area = (orderData.shipping.area || "").trim().toLowerCase();
      const address = (orderData.shipping.address || "").trim().toLowerCase();
      const areaOrAddress = area !== "" ? area : address;

      // Find available deliverymen for the area
      const deliverymenWithArea = DeliveryManData.filter(
        (deliveryman) =>
          deliveryman.profile_status === "APPROVED" &&
          deliveryman.is_verified === true &&
          deliveryman.serviceArea &&
          deliveryman.status === "online" &&
          deliveryman.serviceArea.some((areas) =>
            areas.terretory?.some((t) =>
              t.toLowerCase().includes(areaOrAddress.split(",")[0].trim())
            )
          )
      );

      // No deliverymen case
      if (deliverymenWithArea.length === 0 && selectedDeliveryManId === null) {
        toast.warning("No Delivery Man Found In this Area", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
        return;
      }

      // Determine which deliveryman to use
      const deliveryman = selectedDeliveryManId
        ? DeliveryManData.find((value) => value.id === selectedDeliveryManId)
        : deliverymenWithArea.length === 1
        ? deliverymenWithArea[0]
        : null;

      // Multiple deliverymen case - show selection popup
      if (!deliveryman) {
        setAllDeliverymans(deliverymenWithArea);
        setIssDeliverymanPopup(true);
        setLoading(false);
        return;
      }

      // Check van inventory
      const vanProductsQuery = query(
        collection(db, `Delivery/${deliveryman.id}/Van`)
      );
      const querySnapshot = await getDocs(vanProductsQuery);
      const vanProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Verify stock availability before proceeding
      let allProductsAvailable = true;
      const stockIssues = [];

      for (const orderItem of orderData.items) {
        const vanProduct = vanProducts.find(
          (p) => p.productid === orderItem.product_id
        );

        if (!vanProduct) {
          stockIssues.push(`${orderItem.name} not available in delivery van`);
          allProductsAvailable = false;
          continue;
        }

        const availableQty = vanProduct.quantity - (vanProduct.sold || 0);
        const requiredQty = orderItem.quantity * orderItem.size;

        if (availableQty < requiredQty) {
          stockIssues.push(
            `Insufficient stock for ${orderItem.name}. Available: ${availableQty}, Required: ${requiredQty}`
          );
          allProductsAvailable = false;
        }
      }

      if (!allProductsAvailable) {
        stockIssues.forEach((issue) => {
          toast.error(issue, { position: toast.POSITION.TOP_RIGHT });
        });
        setLoading(false);
        return;
      }

      // All checks passed - proceed with order
      await runTransaction(db, async (transaction) => {
        // Only mark as OUT_FOR_DELIVERY without updating van inventory
        const updateData = {
          status: "OUT_FOR_DELIVERY",
          deliveryname: deliveryman.basic_info.name,
          assign_to: deliveryman.id,
          ...(customertoken && { tokens: customertoken }),
          ...(!orderData.invoiceNumber && {
            invoiceNumber: orderData.invoiceNumber,
          }),
        };
        transaction.update(orderDocRef, updateData);

       
      });

      toast.success(
        "Order is out for delivery!",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error(`Order failed: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
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
            src={proccesing}
            className="bg-white"
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
      {isfilterDeliverymanPopup && <div className="bg_black_overlay"></div>}

      {filterData.map((item, index) => {
        return (
          <div
            key={index}
            className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100"
          >
            {isfilterDeliverymanPopup && (
              <div className="deliveryman_popup_list d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between">
                  <img
                    onClick={() => setIsFilterDeliverymanPopup(false)}
                    className="cursor_pointer"
                    src={CloseIcon}
                    alt="closeicon"
                  />
                </div>
                <div className="deliveryman_list d-flex align-items-center justify-content-center">
                  <div className=" text-center">
                    <img
                      width={"300px"}
                      src={deliveryman_not_found}
                      alt="deliveryman_not_found"
                    />
                    <h3 className=" text-center ">
                      No delivery man has the required capacity for this
                      delivery.
                    </h3>
                  </div>
                </div>
              </div>
            )}

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
                    {allDeliverymans.map((items, index) => {
                      return (
                        <tr key={index}>
                          {items.serviceArea && items.serviceArea.length > 0 ? (
                            <>
                              <td className="d-flex align-items-center py-1 w-100">
                                <input
                                  onChange={() => (
                                    setSelectedDeliveryManId(items.uid),
                                    setSelectedDeliveryManName(
                                      items.basic_info.name
                                    )
                                  )}
                                  type="checkbox"
                                  checked={selectedDeliveryManId === items.uid}
                                />
                                <p className="ms-2 mb-0 w-100">
                                  {items.basic_info.name}
                                </p>
                              </td>
                              {items.serviceArea.map((itm, ind) => {
                                // console.log(itm, " asfdasfasfsafafa");
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
                      handlePreparedDelivery(item.id);
                      setIssDeliverymanPopup(false);
                    }}
                    className="save_btn"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
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
                        onClick={() => handleCancelOrRejectOrder(item.id)}
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
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={() => handleCancelOrRejectOrder(item.id)}
                      className="fs-sm reset_btn  border-0 fw-400"
                    >
                      {item.status === "NEW" ? "Reject Order" : "Cancel Order"}
                    </button>
                  </button>
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
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={() => handleCancelOrRejectOrder(item.id)}
                      className="fs-sm reset_btn  border-0 fw-400"
                    >
                      {item.status === "NEW" ? "Reject Order" : "Cancel Order"}
                    </button>
                  </button>
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
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={() => handleCancelOrRejectOrder(item.id)}
                      className="fs-sm reset_btn  border-0 fw-400"
                    >
                      {item.status === "NEW" ? "Reject Order" : "Cancel Order"}
                    </button>
                  </button>
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
                  {item.items
                    .filter((products) => products.quantity > 0)
                    .map((products, index) => {
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
                                ₹ {Math.round(products.varient_price)}{" "}
                                <span className="ms-4">X</span>
                              </p>
                              <p className="fs-sm fw-400 black mb-0 ps-4 ms-2 me-5">
                                {products.quantity}
                              </p>
                              <p className="fs-sm fw-400 black mb-0 ps-4 ms-5 ps-5 ">
                                (-) ₹{" "}
                                {Math.round(
                                  products.varient_discount * products.quantity
                                )}
                              </p>
                            </div>
                            <p className="fs-sm fw-400 black mb-0 p-3">
                              ₹{" "}
                              {Math.round(
                                products.varient_price * products.quantity
                              ) -
                                Math.round(
                                  products.varient_discount * products.quantity
                                )}
                            </p>
                          </div>
                        </>
                      );
                    })}

                  <div className="product_borderbottom mt-3"></div>
                  <div className="d-flex align-items-center justify-content-between mt-4">
                    <p className="fs-sm fw-400 black mb-0">Subtotal</p>
                    <p className="fs-sm fw-400 black mb-0">
                      ₹{calculateSubtotal().toFixed(0)}
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
                        ₹ {calculateTotal().toFixed(0)}
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
                          new Date(a.data.updated_at.toDate()) -
                          new Date(b.data.updated_at.toDate())
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
                              {formatDate(log.data.updated_at.toDate())}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
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
                  {item.alternateCustomer && (
                    <div className="mt-3">
                      <p className="fs-2sm fw-400 black mb-0">
                        Alternate Contact
                      </p>
                      <p className="fs-xs fw-400 black mb-0 pt-1 mt-3">
                        {item.alternateCustomer.name}
                      </p>
                      <p className="fs-xs fw-400 black mb-0 pt-1">
                        {item.alternateCustomer.phone}
                      </p>
                      <p className="fs-xs fw-400 black mb-0 pt-1">
                        {item.alternateCustomer.address}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white product_shadow mt-4">
                  <p className="fs-2sm fw-400 black mb-0">Shipping Info</p>
                  <p className="fs-md fw-400 black mb-0 pt-1 mt-3">
                    {item.shipping.address_title}
                    {/* {console.log(item)} */}
                  </p>
                  <p className="fs-xs fw-400 black mb-0 pt-1 mt-2">
                    {item.shipping.contact_person}
                  </p>
                  {item.fathername && (
                    <p className="fs-xs fw-400 black mb-0 mt-2">
                      Father Name : {item.fathername}
                    </p>
                  )}
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
      <ToastContainer />
    </div>
  );
}

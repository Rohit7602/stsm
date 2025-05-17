import React, { useEffect, useState } from "react";
import ApexBarChart from "../charts/bar";
import Donut from "../charts/donatchart";
import eyeIcon from "../../Images/svgs/eye-icon.svg";
import { useOrdercontext } from "../../context/OrderGetter";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { CrossIcons } from "../../Common/Icon";
import alertgif from "../../Images/gif/altert Gif.gif"; 
import { useProductsContext } from "../../context/productgetter";
import AllCustomerPopup from "../AllCustomerPopup";
import ShowAllOrders from "../ShowAllOrders";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
function DashbordCards() {
  const { ordersAll } = useOrdercontext();
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalspent, setTotalSpent] = useState(0);
  const [showdeliverypop, setShowDeliveryPop] = useState(false);
  const { productData } = useProductsContext();
  const [showAllOrder,setShowAllOrder] = useState(false);
  const [showAllCustomers,setShowAllCustomers] = useState(false);
  const navigate = useNavigate();
  /**  ******************************************* Calculation of Average ORder value According to current Month
   * ****************************************    */
  const [loading, setLoading] = useState(true);

  
  // Get the current month and last month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January as special case
  const last20DaysDate = new Date(
    currentDate.getTime() - 20 * 24 * 60 * 60 * 1000
  ); // Calculate date 20 days ago

  const ordersLast20Days = ordersAll.filter(
    (order) => new Date(order.created_at) >= last20DaysDate
  );

  // Calculate the total number of orders per city
  const ordersPerCity = ordersLast20Days.reduce((acc, order) => {
    const { name, email, phone } = order.customer;
    const { city } = order.shipping;

    // Create a unique identifier for the customer
    const customerIdentifier = `${name}_${email}_${phone}`;

    // If the customer is not already counted for the city, increment the count
    if (!acc[city] || !acc[city].includes(customerIdentifier)) {
      acc[city] = acc[city] || [];
      acc[city].push(customerIdentifier);
    }

    return acc;
  }, {});

  // Calculate the total length per city
  const totalLengthPerCity = Object.keys(ordersPerCity).reduce((acc, city) => {
    acc[city] = ordersPerCity[city].length;
    return acc;
  }, {});

  const filterlowproductsdata = productData.filter(
    (value) =>
      parseInt(value.totalStock) <= parseInt(value.stockAlert) ||
      Number(value.totalStock) === 0
  );  

  // console.log(totalLengthPerCity);
  const totalActiveUsers = Object.values(totalLengthPerCity).reduce(
    (acc, count) => acc + count,
    0
  );

  // Filter orders for the current month and last month
  const ordersThisMonth = ordersAll.filter(
    (order) => new Date(order.created_at).getMonth() === currentMonth
  );
  const ordersLastMonth = ordersAll.filter(
    (order) => new Date(order.created_at).getMonth() === lastMonth
  );

  const percentageChangeOfOrderMonth =
    ((ordersThisMonth.length - ordersLastMonth.length) /
      ordersLastMonth.length) *
    100;

  const averageOrderValueThisMonth =
    ordersThisMonth.reduce((total, order) => total + order.order_price, 0) /
    ordersThisMonth.length;
  const averageOrderValueLastMonth =
    ordersLastMonth.reduce((total, order) => total + order.order_price, 0) /
    ordersLastMonth.length;
 
  // Calculate the percentage change
  const percentageChangeOfOrder =
    ((averageOrderValueThisMonth - averageOrderValueLastMonth) /
      averageOrderValueLastMonth) *
    100;

  /**  ******************************************* Calculation of Average ORder value According to current Month End
   * ****************************************    */

  /**  ******************************************* Filter the Recent orders of last week
   * ****************************************    */

  // Calculate the start and end dates for one week ago

  const oneWeekAgoStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 7
  );

  // Filter  the New orders

  const NewOrders = ordersAll.filter((order) => order.status === "NEW");

  /**  ******************************************* Filter the Recent orders of last week End here
   * ****************************************    */

  /**  ******************************************* Calculate Total Sales of ORder
   * ****************************************    */

  let DeliverdOrder = ordersAll.filter(
    (item) => item.status.toString().toLowerCase() === "delivered"
  );
  // console.log(DeliverdOrder)
  const deliveredOrdersThisMonthValue = DeliverdOrder.filter(
    (order) => new Date(order.created_at).getMonth() === currentMonth
  ).reduce((total, order) => total + order.order_price, 0);
  const deliveredOrdersLastMonthValue = DeliverdOrder.filter(
    (order) => new Date(order.created_at).getMonth() === lastMonth
  ).reduce((total, order) => total + order.order_price, 0);

  let totalDeliverdOrderValue = DeliverdOrder.reduce(
    (total, order) => total + order.order_price,
    0
  );
  let comparedLastSaleValue =
    deliveredOrdersThisMonthValue - deliveredOrdersLastMonthValue;

  // format date function

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
  const { sendNotification } = useNotification();

  const formatDatepop = (date) => {
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const handleDateRangeSelection = (range) => {
    setStartDate("");
    setEndDate("");
    setShowCustomDate(false);
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
        return; // Display custom date inputs and exit
      default:
        return;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    setStartDate(formatDatepop(start));
    setEndDate(formatDatepop(end));
    filterOrdersByDateRange(start, end);
  };

  const filterOrdersByDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const filteredOrders = DeliverdOrder.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate && orderDate <= endDate;
    });
    const totalDeliverdOrderValue = filteredOrders.reduce(
      (total, order) => total + order.order_price,
      0
    );
    setTotalSpent(totalDeliverdOrderValue);
    // return {
    //   filteredOrders,
    //   totalDeliverdOrderValue,
    // };
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

  return (
    <>
      <Outlet/>
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        {/* {showAllCustomers && <AllCustomerPopup setShowAllCustomers={setShowAllCustomers} />} */}
        {/* {showAllOrder && (
          <ShowAllOrders setShowAllOrder={setShowAllOrder} formatDate={formatDate} />
          
        )} */}
        {/* Dashboard-panel  */}
        {showdeliverypop ? <div className="bg_black_overlay"></div> : null}
        {showdeliverypop && (
          <div className="bg-white p-4 rounded-4 w_500 position-fixed center_pop overflow-auto xl_h_500">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-black fw-700 fs-2sm mb-0">
                Total Sale History
              </h2>
              <button
                className="border-0 bg-white"
                onClick={() => setShowDeliveryPop(false)}
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
              <div className="d-flex flex-column">
                <button
                  className="btn btn-outline-secondary mb-1"
                  onClick={() => handleDateRangeSelection("yesterday")}
                >
                  Yesterday
                </button>
                <button
                  className="btn btn-outline-secondary mb-1"
                  onClick={() => handleDateRangeSelection("week")}
                >
                  One Week
                </button>
                <button
                  className="btn btn-outline-secondary mb-1"
                  onClick={() => handleDateRangeSelection("month")}
                >
                  One Month
                </button>
                <button
                  className="btn btn-outline-secondary mb-1"
                  onClick={() => handleDateRangeSelection("six_months")}
                >
                  Six Months
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleDateRangeSelection("custom")}
                >
                  Custom
                </button>
              </div>
            </div>
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
            <div className="d-flex align-items-center justify-content-between mt-3">
              <h4 className=" text-black fw-400 fs-sm mb-0">Total Sale</h4>
              <h2 className="color_green fw-700 fs-sm mb-0">
                {totalspent !== 0 ? "₹" + totalspent : "No Spend"}
              </h2>
            </div>
          </div>
        )}
        <div className="w-100 px-3 py-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex">
              <h1 className="fs-400   black fs-lg">Dashboard</h1>
            </div>
            <div className="d-flex gap-3">
              <Link to={"/all-orders"}  className="filter_btn black d-flex align-items-center fs-xs xl:fs-sm px-sm-3 px-2 py-2 fw-400 ">All Orders</Link>
              <Link to={"/all-customer"} className="filter_btn black d-flex align-items-center fs-xs xl:fs-sm px-sm-3 px-2 py-2 fw-400 ">All Customers</Link>
              {filterlowproductsdata.length !== 0 && (
                <abbr className=" bg-transparent" title="Low Stock Notifications">
                  <button
                    className=" border-0 position-relative bg-transparent"
                    onClick={() =>
                      navigate("/catalog/productlist", {
                        state: filterlowproductsdata,
                      })
                    }
                  >
                    {filterlowproductsdata.length !== 0 ? (
                      <span
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "10px" }}
                      >
                        {filterlowproductsdata.length >= 99
                          ? `${filterlowproductsdata.length}+`
                          : filterlowproductsdata.length}
                      </span>
                    ) : null}
                    <span className=" fs-2sm fw-600" >
                      Stock Alert
                    </span>
                    <img className=" ps-2" height={"50px"} src={alertgif} alt="alertgif" />
                  </button>
                </abbr>
              )}
           </div>
          </div>
          <div className="row justify-content-star  mt-3">
            <div className="col-xl col-lg-4 col-md-6 mr-3  ">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between align-items-center justify-content-center   bg-white">
                  <div>
                    <h3 className="fw-400 fade_grey fs-xs">Total Sales</h3>
                    <p className="fw-400 fade_grey para2">
                      Delivered Products Only
                    </p>
                  </div>
                  <button
                    className="fw-400 color_blue fs-xs border-0 bg-white"
                    onClick={() => setShowDeliveryPop(!showdeliverypop)}
                  >
                    View all
                  </button>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">
                    ₹
                    {isNaN(totalDeliverdOrderValue)
                      ? 0
                      : totalDeliverdOrderValue.toFixed(2)}{" "}
                  </h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">
                      ₹
                      {isNaN(comparedLastSaleValue)
                        ? 0
                        : comparedLastSaleValue.toFixed(2)}
                    </h3>
                    <p className="text-end  para mb-0">
                      Compared to Last Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="    col-xl col-lg-4 col-md-6 mr-3 mt-4 mt-md-0">
              <div className=" bg-white   cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">
                    Average Order Value
                  </h3>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">
                    ₹{" "}
                    {isNaN(averageOrderValueThisMonth)
                      ? 0
                      : averageOrderValueThisMonth.toFixed(2)}
                  </h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">
                      {isNaN(percentageChangeOfOrder)
                        ? 0
                        : percentageChangeOfOrder.toFixed(2)}{" "}
                      %
                    </h3>
                    <p className="text-end  para mb-0">
                      Compared to Last Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl col-lg-4 col-md-6 mt-4 mt-lg-0">
              <div className="bg-white  cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Total Orders</h3>
                  <Link to={"/orders"}>
                    <button className="fw-400 color_blue fs-xs border-0 bg-white">
                      View all
                    </button>
                  </Link>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">{ordersAll.length}</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">
                      {isNaN(percentageChangeOfOrderMonth)
                        ? 0
                        : percentageChangeOfOrderMonth.toFixed(2)}
                      %
                    </h3>
                    <p className="text-end  para mb-0">
                      Compared to Last Month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={() => sendNotification('orderAccepted')}>send</button> */}
        {/* Chart-section-bar  */}
        <div className="chat_wrapper px-3">
          <div className="row  justify-content-between ">
            <div className="col-xl-3 col-lg-5 col-12 ">
              <div className="chart_content_wrapper active_user pb-2 bg-white d-flex flex-column">
                <div className="position-sticky top-0 bg-white p-2 ">
                  <div className="d-flex align-items-center justify-content-between">
                    <h3 className="fw-400 fade_grey mb-0 fs-xs">
                      {" "}
                      Active Users
                    </h3>
                  </div>
                  <div className="grey_box my-2 text-center w-100 p-2">
                    <h3 className="fw-500 black mb-0 fs-lg">
                      {totalActiveUsers}
                    </h3>
                  </div>
                  <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                    <h4 className="fw-400 fade_grey mb-0 fs-xs"> City</h4>
                    <h4 className="fw-400 fade_grey mb-0 fs-xs"> Users</h4>
                  </div>
                </div>
                <div className="p-2 pb-0">
                  {Object.entries(totalLengthPerCity).map(([city, count]) => (
                    <div
                      key={city}
                      className="d-flex align-items-center py-1 bottom_border justify-content-between"
                    >
                      <h4 className="fw-400 black mb-0 fs-xs">{city}</h4>
                      <h4 className="fw-400 black mb-0 fs-xs">{count}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-7 col-12 h-100 mt-4 mt-lg-0">
              <div className="  h-100 chart_box px-2 py-3  chart_content_wrapper bg-white">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 black fs-xs">Order Statistics</h3>
                </div>
                <ApexBarChart className="w-100" orderData={ordersAll} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart-section-donat  */}
        <div className="chat_wrapper px-3 mt-4">
          <div className="row  justify-content-between ">
            <div className="col-xl-9 table_box col-lg-7 mb-xl-0 col-12 ">
              <div className=" px-3 tables mb-2 chart_content_wrapper p-2 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="fw-600 black  mb-0 fs-xs py-2">New Orders</h3>
                </div>
                <div className="recent_order_table">
                  <table className="w-100 ">
                    <tr className="product_borderbottom">
                      <th className="py-2 px-3 mw_50">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> No</h4>
                      </th>
                      <th className="py-2 px-3 mx_100">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> Status</h4>
                      </th>
                      <th className="py-2 px-3 mx_100">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> City</h4>
                      </th>
                      <th className="py-2 px-3 mw-250">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs">
                          Customer
                        </h4>
                      </th>
                      <th className="py-2 px-3 mx_160">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> Date</h4>
                      </th>
                      <th className="py-2 px-3 mx_100">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> Total</h4>
                      </th>
                      <th className="mx_70"></th>
                    </tr>
                    {NewOrders.length === 0 ? (
                      <tr>
                        <td className="text-center py-2 fs-lg " colSpan="6">
                          No new Orders
                        </td>
                      </tr>
                    ) : (
                      NewOrders.sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      ).map((data, index) => {
                        return (
                          <tr
                            key={data.created_at}
                            className="product_borderbottom"
                          >
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs">
                                {index + 1}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs">
                                {" "}
                                {data.status}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs">
                                {data.shipping.city}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs">
                                {data.customer.name}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs white_space_nowrap">
                                {formatDate(data.created_at)}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs white_space_nowrap">
                                {" "}
                                ₹ {data.order_price}
                              </h4>
                            </td>
                            <td className="py-1 px-3">
                              <Link
                                to={`/orders/orderdetails/${data.order_id}`}
                              >
                                <img
                                  className="cursor_pointer"
                                  src={eyeIcon}
                                  alt=""
                                />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </table>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-5 col-12 mt-4 mt-lg-0">
              <div className="  h-100 chart_box px-3 py-3  chart_content_wrapper bg-white h-100">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 black fs-xs">Sales by source</h3>
                </div>
                <div className="text-center">
                  <div className="col-8 col-lg-12 m-auto">
                    <Donut />
                  </div>
                </div>

                <div className="d-flex     align-items-center   p-2 bottom_border  justify-content-between">
                  <h4 className="fw-400 col fade_grey mb-0 fs-xs"> Source</h4>
                  <h4 className="fw-400 col text-center fade_grey mb-0 fs-xs">
                    Orders
                  </h4>
                  <h4 className="fw-400 col text-end fade_grey mb-0 fs-xs">
                    Amount
                  </h4>
                </div>
                <div className="d-flex      align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col black mb-0 fs-xs"> Direct</h4>
                  <h4 className="fw-400 col text-center black mb-0    fs-xs">
                    110
                  </h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">
                    ₹45,368.00
                  </h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs"> Salesman</h4>
                  <h4 className="fw-400 col text-center  black mb-0   fs-xs">
                    36
                  </h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">
                    ₹13,810.00
                  </h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs">Wholesalers</h4>
                  <h4 className="fw-400 col text-center black mb-0     fs-xs">
                    43
                  </h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">
                    ₹56,108.00
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashbordCards;

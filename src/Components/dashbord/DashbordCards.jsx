import React from 'react';
import Dots from '../../Images/svgs/dots.svg';
import ApexBarChart from '../charts/bar';
import Donut from '../charts/donatchart';
import eyeIcon from '../../Images/svgs/eye-icon.svg';
import printIcon from '../../Images/svgs/print-icon.svg';
import { useOrdercontext } from '../../context/OrderGetter';
import { Link } from 'react-router-dom';
function DashbordCards() {
  const { orders } = useOrdercontext();
  /**  ******************************************* Calculation of Average ORder value According to current Month
   * ****************************************    */

  // Get the current month and last month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January as special case

  // Filter orders for the current month and last month
  const ordersThisMonth = orders.filter(order => new Date(order.created_at).getMonth() === currentMonth);
  const ordersLastMonth = orders.filter(order => new Date(order.created_at).getMonth() === lastMonth);
  console.log("ordrethismonth", ordersThisMonth.length)
  console.log("orderlastmonth", ordersLastMonth.length)
  // Calculate the average order value for each month

  const percentageChangeOfOrderMonth = ((ordersThisMonth.length - ordersLastMonth.length) / ordersLastMonth.length) * 100


  const averageOrderValueThisMonth = ordersThisMonth.reduce((total, order) => total + order.order_price, 0) / ordersThisMonth.length;
  // console.log("averageordrebalue this ", averageOrderValueThisMonth)
  const averageOrderValueLastMonth = ordersLastMonth.reduce((total, order) => total + order.order_price, 0) / ordersLastMonth.length;
  // console.log("averageOrderValueLastMonth", averageOrderValueLastMonth)
  // Calculate the percentage change
  const percentageChangeOfOrder = ((averageOrderValueThisMonth - averageOrderValueLastMonth) / averageOrderValueLastMonth) * 100


  /**  ******************************************* Calculation of Average ORder value According to current Month End
   * ****************************************    */

  /**  ******************************************* Filter the Recent orders of last week
   * ****************************************    */

  // Calculate the start and end dates for one week ago


  const oneWeekAgoStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
  // console.log("asdfasfasdfasdf", oneWeekAgoStartDate)
  // console.log("ASDFAsdf current date ", currentDate)

  // Filter orders for one week ago

  const ordersOneWeekAgo = orders.filter(
    (order) =>
      new Date(order.created_at) >= oneWeekAgoStartDate && new Date(order.created_at) <= currentDate
  );




  /**  ******************************************* Filter the Recent orders of last week End here
   * ****************************************    */

  /**  ******************************************* Calculate Total Sales of ORder
 * ****************************************    */

  let DeliverdOrder = orders.filter((item) => item.status.toString().toLowerCase() === 'delivered')
  console.log(DeliverdOrder)
  const deliveredOrdersThisMonthValue = DeliverdOrder.filter(order => new Date(order.created_at).getMonth() === currentMonth).reduce((total, order) => total + order.order_price, 0);
  const deliveredOrdersLastMonthValue = DeliverdOrder.filter(order => new Date(order.created_at).getMonth() === lastMonth).reduce((total, order) => total + order.order_price, 0);
  console.log("thismonthdeliverd", deliveredOrdersThisMonthValue)
  console.log("lastmonthdeliverd", deliveredOrdersLastMonthValue)

  let totalDeliverdOrderValue = DeliverdOrder.reduce((total, order) => total + order.order_price, 0)
  let comparedLastSaleValue = (deliveredOrdersThisMonthValue - deliveredOrdersLastMonthValue)


  // format date function

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  return (
    <>
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        {/* Dashboard-panel  */}
        <div className="w-100 px-3 py-4">
          <div className="d-flex   justify-content-between">
            <div className="d-flex">
              <h1 className="fs-400   black fs-lg">Dashboard</h1>
            </div>
            <button className="export_btn  white fs-xxs px-3 py-2 fw-400 border-0">Export</button>
          </div>
          <div className="row justify-content-star  mt-3">
            <div className="col-xl col-lg-4 col-md-6 mr-3  ">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Total Sales</h3>
                  <button className="fw-400 color_blue fs-xs border-0 bg-white">View all</button>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">₹{isNaN(totalDeliverdOrderValue) ? 0 : totalDeliverdOrderValue.toFixed(2)} </h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">₹{isNaN(comparedLastSaleValue) ? 0 : comparedLastSaleValue.toFixed(2)}</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="    col-xl col-lg-4 col-md-6 mr-3">
              <div className=" bg-white   cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Average Order Value</h3>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">₹ {isNaN(averageOrderValueThisMonth) ? 0 : averageOrderValueThisMonth.toFixed(2)}</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">{isNaN(percentageChangeOfOrder) ? 0 : percentageChangeOfOrder.toFixed(2)} %</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl col-lg-4 col-md-6 mt-4 mt-lg-0">
              <div className="bg-white  cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Total Orders</h3>
                  <Link to={'/orders'}>
                    <button className="fw-400 color_blue fs-xs border-0 bg-white">View all</button>
                  </Link>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">{orders.length}</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">{isNaN(percentageChangeOfOrderMonth) ? 0 : percentageChangeOfOrderMonth.toFixed(2)}%</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart-section-bar  */}
        <div className="chat_wrapper px-3">
          <div className="row  justify-content-between ">
            <div className="col-xl-3 col-lg-5 col-12 ">
              <div className="chart_content_wrapper p-2 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="fw-400 fade_grey mb-0 fs-xs"> Active Users</h3>
                </div>
                <div className="grey_box my-2 text-center w-100 p-2">
                  <h3 className="fw-500 black mb-0 fs-lg">56</h3>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 fade_grey mb-0 fs-xs"> City</h4>
                  <h4 className="fw-400 fade_grey mb-0 fs-xs"> Users</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Hisar</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 12</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Hansi</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 8</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Fatehabad</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 4</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Siwani</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 9</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Agroha</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 10</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Barwala</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 18</h4>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-7 col-12 h-100 mt-4 mt-lg-0">
              <div className="  h-100 chart_box px-2 py-3  chart_content_wrapper bg-white">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 black fs-xs">Income Statistics</h3>
                </div>
                <ApexBarChart className="w-100" orderData={orders} />
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
                  <h3 className="fw-600 black  mb-0 fs-xs py-2">Recent Orders</h3>
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
                        <h4 className="fw-400 fade_grey mb-0 fs-xs">Customer</h4>
                      </th>
                      <th className="py-2 px-3 mx_160">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> Date</h4>
                      </th>
                      <th className="py-2 px-3 mx_100">
                        <h4 className="fw-400 fade_grey mb-0 fs-xs"> Total</h4>
                      </th>
                      <th className="mx_70"></th>
                    </tr>
                    {ordersOneWeekAgo.length === 0 ? (
                      <tr>
                        <td className="text-center py-2 " colSpan="6">
                          No recent orders in the last week
                        </td>
                      </tr>
                    ) : (
                      ordersOneWeekAgo.map((data, index) => {
                        return (
                          <tr key={data.created_at} className="product_borderbottom">
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs">{index + 1}</h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs"> {data.status}</h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0  fs-xs">city</h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs">{data.customer.name}</h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs white_space_nowrap">
                                {formatDate(data.created_at)}
                              </h4>
                            </td>
                            <td className="py-2 px-3">
                              <h4 className="fw-400 black mb-0 fs-xs white_space_nowrap">
                                {' '}
                                ₹ {data.order_price}
                              </h4>
                            </td>
                            <td className="d-flex align-items-center gap-3 py-1">
                              <img className="cursor_pointer" src={eyeIcon} alt="" />
                              <img className="cursor_pointer" src={printIcon} alt="" />
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
                  <h4 className="fw-400 col text-center fade_grey mb-0 fs-xs">Orders</h4>
                  <h4 className="fw-400 col text-end fade_grey mb-0 fs-xs">Amount</h4>
                </div>
                <div className="d-flex      align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col black mb-0 fs-xs"> Direct</h4>
                  <h4 className="fw-400 col text-center black mb-0    fs-xs">110</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹45,368.00</h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs"> Salesman</h4>
                  <h4 className="fw-400 col text-center  black mb-0   fs-xs">36</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹13,810.00</h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs">Wholesalers</h4>
                  <h4 className="fw-400 col text-center black mb-0     fs-xs">43</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹56,108.00</h4>
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

import React from 'react';
import saveicon from '../../Images/svgs/saveicon.svg';
import threedot from '../../Images/svgs/threedot.svg';
import manimage from '../../Images/Png/manimage.jpg';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCustomerContext } from '../../context/Customergetters';
import { add, formatDistanceToNow } from 'date-fns';
import { useOrdercontext } from '../../context/OrderGetter';
import { Link } from 'react-router-dom';

const ViewCustomerDetails = () => {
  const { orders } = useOrdercontext();
  const { customer } = useCustomerContext();
  const { id } = useParams();
  let filterData = customer.filter((item) => item.id == id);
  console.log(':ASDFASDF', filterData);
  const targetOrder = orders.filter((order) => order.uid === id);
  if (targetOrder) {
    // The order with the specified ID was found
    console.log('Found Order:', targetOrder);
  } else {
    // Order with the specified ID was not found
    console.log('Order not found');
  }

  const mostRecentOrder = targetOrder.reduce((maxOrder, currentOrder) => {
    // Compare the created_at timestamps
    const maxTimestamp = maxOrder ? new Date(maxOrder.created_at).getTime() : 0;
    const currentTimestamp = new Date(currentOrder.created_at).getTime();

    return currentTimestamp > maxTimestamp ? currentOrder : maxOrder;
  }, null);

  const totalSpent = targetOrder.reduce((sum, order) => sum + order.order_price, 0);
  // console.log(totalSpent);

  const AvergaeOrderValue = totalSpent / targetOrder.length;
  // console.log(AvergaeOrderValue);

  // format date function start
  function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate.replace('at', '|');
  }
  // format date function end

  // calculate time start
  const calculateTimeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };


  //  order of this month calulation 
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // Note: getMonth() returns 0-based index

  const ordersThisMonth = targetOrder.filter(order => {
    const orderDate = new Date(order.created_at);
    const orderMonth = orderDate.getMonth() + 1; // Note: getMonth() returns 0-based index

    return orderMonth === currentMonth;
  });















  // calculate  time end

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let list = [];
  //     try {
  //       const docRef = doc(db, 'customers', id);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setData(docSnap.data());
  //       } else {
  //         // docSnap.data() will be undefined in this case
  //         console.log('No such document!');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      {filterData.map((Customerdata, index) => {
        return (
          <div key={index} className="main_panel_wrapper pb-4  bg_light_grey w-100">
            <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
              <div className="d-flex  align-items-center flex-column gap-2 gap-sm-0 flex-sm-row  justify-content-between">
                <div className="d-flex">
                  {/* <button onClick={() => setOpen(!open)}>Click</button> */}
                  <h1 className="fw-500  mb-0 black fs-lg">View Customer Details</h1>
                </div>
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button className="fs-sm reset_btn  border-0 fw-400 ">Block Customer</button>
                  </button>
                  <button className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  ">
                    <img src={saveicon} alt="saveicon" />
                    Reset Password
                  </button>
                </div>
              </div>
              {/* View Customer Details  */}

              <Row className="mt-3">
                <Col xxl={4}>
                  {/* Basic Information */}
                  <div className="product_shadow bg_white d-flex flex-column justify-content-center align-items-center p-3">
                    <img
                      className="manimage"
                      src={!Customerdata.image ? manimage : Customerdata.image}
                      alt="manimage"
                    />
                    <h2 className="fw-700 fs-2sm black mb-0 mt-3">{Customerdata.name}</h2>
                    <h2 className="fw-400 fs-2sm black mb-0 mt-2">{Customerdata.email}</h2>
                    <h2 className="fw-400 fs-2sm black mb-0 ">{Customerdata.phone}</h2>
                  </div>
                  {/*   last order */}
                  <div className="product_shadow bg_white p-3 mt-3">
                    <h2 className="fw-400 fs-2sm black mb-0  ">Last Order</h2>
                    {mostRecentOrder ? (
                      <>
                        <div className="d-flex gap-1 justify-content-between align-items-center mt-1">
                          <h2 className="fw-400 fs-2sm black mb-0 mt-1">
                            {formatDistanceToNow(new Date(mostRecentOrder.created_at), {
                              addSuffix: true,
                            })}
                          </h2>
                          <Link
                            to={`/orders/orderdetails/${mostRecentOrder.order_id}`}
                            className="fw-400 fs-xs fade_grey mb-0 mt-1 color_blue ">
                            {' '}
                            {mostRecentOrder.order_id}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1 ">No orders yet</h2>
                    )}
                    <h2 className="fw-400 fs-2sm black mb-0 mt-3  ">Average Order Value</h2>
                    <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">
                      {isNaN(AvergaeOrderValue) ? 0 : `₹ ${AvergaeOrderValue.toFixed(2)}`}
                    </h2>
                    <h2 className="fw-400 fs-2sm black mb-0 mt-3 ">Registration</h2>
                    <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1 ">
                      {calculateTimeAgo(Customerdata.created_at)}
                    </h2>
                    <p className="fw-400 fs-sm black mt-3 mb-0">Total Order : {targetOrder.length}</p>
                    <p className="fw-400 fs-sm black mt-2 mb-0">Current Month : {ordersThisMonth.length}</p>
                  </div>
                </Col>
                <Col xxl={8}>
                  <div className="product_shadow p-3 bg_white mt-3 mt-xxl-0">
                    <div className="overflow_lg_scroll">
                      <div className="customer_lg_overflow_X">
                        <div className="d-flex justify-content-between align-items-center">
                          <h2 className="fw-400 fs-2sm black mb-0  "> Order</h2>
                          <h2 className="fw-400 fs-2sm black mb-0  ">Total Spent :₹{totalSpent}</h2>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3"></div>
                        <div className="overflow-x-auto">
                          <div style={{ minWidth: '1100px' }} className="pb-3">
                            <table className="w-100 costomer_order_table">
                              <thead className="table_head">
                                <tr className="product_borderbottom">
                                  <th className="p-3">
                                    <h2 className="fw-400 fs-sm black mb-0"> Order Id. </h2>
                                  </th>
                                  <th className="py-3">
                                    <h2 className="fw-400 fs-sm black mb-0"> Invoice </h2>
                                  </th>
                                  <th className="py-3">
                                    <h2 className="fw-400 fs-sm black mb-0"> Order Date </h2>
                                  </th>
                                  <th className="p-3">
                                    <h2 className="fw-400 fs-sm black mb-0"> Status </h2>
                                  </th>
                                  <th className="py-3">
                                    <h2 className="fw-400 fs-sm black mb-0"> Items </h2>
                                  </th>

                                  <th className="mx_140 ps-3">
                                    <h2 className="fw-400 fs-sm black mb-0">Billed Amount</h2>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="table_body costomer_order_table">
                                {targetOrder
                                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                  .map((data, index) => {
                                    return (
                                      <>
                                        <tr className="product_borderbottom">
                                          <td className="p-3">
                                            <Link to={`/orders/orderdetails/${data.order_id}`}>
                                              <h2 className="fw-400 fs-sm color_blue mb-0 ">
                                                {' '}
                                                # {data.order_id}.{' '}
                                              </h2>
                                            </Link>
                                          </td>
                                          <td>
                                            <Link
                                              to={'/invoices'}
                                              className="fw-400 fs-sm color_blue mb-0 ">
                                              {typeof data.invoiceNumber === 'undefined'
                                                ? 'N/A'
                                                : `#${data.invoiceNumber}`}
                                            </Link>
                                          </td>
                                          <td className="py-3">
                                            <h2 className="fw-400 fs-sm black mb-0">
                                              {' '}
                                              {formatDate(data.created_at)}{' '}
                                            </h2>
                                          </td>
                                          <td className="p-3">
                                            <h2
                                              className={`d-inline-block ${data.status.toString().toLowerCase() === 'new'
                                                ? 'fs-sm fw-400 red mb-0 new_order'
                                                : data.status.toString().toLowerCase() ===
                                                  'processing'
                                                  ? 'fs-sm fw-400 mb-0 processing_skyblue'
                                                  : data.status.toString().toLowerCase() ===
                                                    'delivered'
                                                    ? 'fs-sm fw-400 mb-0 green stock_bg'
                                                    : 'fs-sm fw-400 mb-0 black cancel_gray'
                                                }`}>
                                              {data.status}
                                            </h2>
                                          </td>
                                          <td className="py-3">
                                            <h2 className="fw-400 fs-sm black mb-0">
                                              {' '}
                                              {data.items.length} Items{' '}
                                            </h2>
                                          </td>
                                          <td className="mx_140 ps-3">
                                            <h2 className="fw-400 fs-sm black mb-0">
                                              ₹{data.order_price}
                                            </h2>
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="product_shadow p-3 bg_white mt-3">
                    <h2 className="fw-400 fs-2sm black mb-0  "> Addresses</h2>
                    <div className="product_borderbottom mt-3"></div>
                    {/* 1st */}
                    {Customerdata.addresses.length === 0 ? (
                      <h2 className="fw-400 fs-xs black mb-0 mt-3 py-2 pb-3 product_borderbottom">
                        Address not found
                      </h2>
                    ) : (
                      Customerdata.addresses.map((address, index) => (
                        <div key={index}>
                          <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                            <div>
                              <h2 className="fw-700 fs-sm black mb-0">{address.name}</h2>
                              <h2 className="fw-400 fs-xs black mb-0 mt-2">
                                {address.house_no +
                                  ', ' +
                                  address.colony +
                                  ', ' +
                                  address.landmark +
                                  ', ' +
                                  address.city +
                                  ', ' +
                                  address.state +
                                  ',   ' +
                                  address.number}
                              </h2>
                            </div>
                            <img className="threedot" src={threedot} alt="threedot" />
                          </div>
                          <div className="product_borderbottom mt-3"></div>
                        </div>
                      ))
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ViewCustomerDetails;

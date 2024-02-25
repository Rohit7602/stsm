import React, { useEffect, useState } from 'react';
import filtericon from '../../Images/svgs/filtericon.svg';
import SearchIcon from '../../Images/svgs/search.svg';
import addicon from '../../Images/svgs/addicon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import shortIcon from '../../Images/svgs/short-icon.svg';
import { OrderTable } from '../../Common/Helper';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, NavLink } from 'react-router-dom';
import { useOrdercontext } from '../../context/OrderGetter';
import { useCustomerContext } from '../../context/Customergetters';
const OrderList = () => {
  const { customer } = useCustomerContext();

  // context
  const { orders, updateData } = useOrdercontext();
  const [searchvalue, setSearchvalue] = useState('');

  // format date logic start from here
  // console.log(orderStatus);
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  /*  *******************************
  checkbox functionality start 
*********************************************   **/
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = orders.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [orders]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = orders.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateData(updatedData);
    setSelectAll(!selectAll);
  };

  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...orders];
    updatedData[index].checked = !orders[index].checked;
    updateData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  /*  *******************************
      Sorting Functionality start from here 
    *********************************************   **/

  const [order, setorder] = useState('ASC');
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...orders];

    if (order === 'ASC') {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        console.log('asdf', valueA);
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateData(sortedData);
  };

  /*  *******************************
      Sorting Functionality end from here  
    *********************************************   **/

  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Orders</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <form className="form_box   mx-2 d-flex p-2 align-items-center" action="">
              <div className="d-flex">
                <img src={SearchIcon} alt=" search icon" />
              </div>
              <input
                type="text"
                className="bg-transparent  border-0 px-2 fw-400  outline-none"
                placeholder="Search for Orders"
                onChange={(e) => setSearchvalue(e.target.value)}
              />
            </form>
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={24} src={filtericon} alt="filtericon" />
              Filter
            </button>
          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1350">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="mw-200 p-3 w-100 cursor_pointer" onClick={() => sorting('id')}>
                      <div className="d-flex align-items-center min_width_300">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
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
                    <th className="mw-200 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th className="mw-200 p-3" onClick={() => sorting('customer.name')}>
                      <h3 className="fs-sm fw-400 black mb-0">Customer </h3>
                    </th>
                    <th className="mw_160 p-3">
                      <span className="d-flex align-items-center">
                        <h3 className="fs-sm fw-400 black mb-0 white_space_nowrap">
                          Payment Status
                        </h3>
                      </span>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Order Status</h3>
                    </th>
                    <th className="mw_140 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Order Price</h3>
                    </th>
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {orders
                    .filter((items) => {
                      return (
                        searchvalue.toLowerCase() === '' ||
                        items.id.toLowerCase().includes(searchvalue)
                      );
                    })
                    .map((orderTableData, index) => {
                      return (
                        <tr>
                          <td className="p-3 w-100">
                            <div className="min_width_300  d-flex align-items-center">
                              <label className="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={orderTableData.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <Link
                                className="fw-400 fs-sm color-blue ms-2"
                                to={`orderdetails/${orderTableData.id}`}>
                                {orderTableData.id}
                              </Link>
                            </div>
                          </td>
                          <td className="p-3 mw-200">
                            <h3 className="fs-xs fw-400 black mb-0">
                              {formatDate(orderTableData.created_at)}
                            </h3>
                          </td>
                          <td className="p-3 mw-200">
                            <Link to={`/viewcustomerdetails/${'id'}`}>
                              <h3 className="fs-sm fw-400 color-blue mb-0">
                                {orderTableData.customer.name}
                              </h3>
                            </Link>
                          </td>
                          <td className="p-3 mw_160">
                            <h3
                              className={`fs-sm fw-400 mb-0 d-inline-block ${
                                orderTableData.transaction.status.toString().toLowerCase() ===
                                'paid'
                                  ? 'black stock_bg'
                                  : orderTableData.transaction.status.toString().toLowerCase() ===
                                    'cod'
                                  ? 'black cancel_gray'
                                  : orderTableData.transaction.status.toString().toLowerCase() ===
                                    'refund'
                                  ? 'new_order red'
                                  : 'color_brown on_credit_bg'
                              }`}>
                              {orderTableData.transaction.status}
                            </h3>
                          </td>
                          <td className="p-3 mw_160">
                            <p
                              className={`d-inline-block ${
                                orderTableData.status.toString().toLowerCase() === 'new'
                                  ? 'fs-sm fw-400 red mb-0 new_order'
                                  : orderTableData.status.toString().toLowerCase() === 'processing'
                                  ? 'fs-sm fw-400 mb-0 processing_skyblue'
                                  : orderTableData.status.toString().toLowerCase() === 'delivered'
                                  ? 'fs-sm fw-400 mb-0 green stock_bg'
                                  : 'fs-sm fw-400 mb-0 black cancel_gray'
                              }`}>
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
                            <div class="dropdown">
                              <button
                                class="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton3"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img src={dropdownDots} alt="dropdownDots" />
                              </button>
                              <ul
                                class="dropdown-menu categories_dropdown"
                                aria-labelledby="dropdownMenuButton3">
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={eye_icon} alt="" />
                                      <Link
                                        to={`/orderslist/${
                                          orderTableData.OrderStatus === 'New Order'
                                            ? 'neworder'
                                            : orderTableData.OrderStatus === 'Processing'
                                            ? 'processing'
                                            : orderTableData.OrderStatus === 'Delivered'
                                            ? 'delivered'
                                            : 'canceled'
                                        }`}>
                                        <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={updown_icon} alt="" />
                                      <p className="fs-sm fw-400 green mb-0 ms-2">
                                        Change to Hidden
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={delete_icon} alt="" />
                                      <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
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
      </div>
    </div>
  );
};

export default OrderList;

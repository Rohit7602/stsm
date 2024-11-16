import React, { useState } from "react";
import filtericon from "../../Images/svgs/filtericon.svg";
import threedot from "../../Images/svgs/threedot.svg";
import search from "../../Images/svgs/search.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import manimage from "../../Images/Png/manimage.jpg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import { Link, useLocation } from "react-router-dom";
import { useCustomerContext } from "../../context/Customergetters";
import { set } from "date-fns";
import { useOrdercontext } from "../../context/OrderGetter";

const DeliveryList = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [orderpricevalueselect, setOrderPriceValueSelect] = useState(0);
  const [filterpop, setFilterPop] = useState(false);
  const [selectAll, setSelectAll] = useState([]);
  const { customer } = useCustomerContext();
  const [searchdata, setSearchData] = useState(0);

  const location = useLocation();

  function handlecheckboxes(e) {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectAll([...selectAll, value]);
    } else {
      setSelectAll((prev) =>
        prev.filter((id) => {
          return id != value;
        })
      );
    }
  }
  function handleMainCheckBox() {
    if (customer.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = customer.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }

  const data = Array.from(
    new Set([
      ...location.state.deliverydata.map((value) => value.status),
      "All",
    ])
  );

  const handleClickstatus = () => {
    let newIndex = searchdata + 1;
    if (newIndex >= data.length) {
      newIndex = 0;
    }
    setSearchData(newIndex);
  };

  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      {filterpop ? <div className="bg_black_overlay"></div> : null}
      {filterpop && (
        <div className="customer_pop position-fixed center_pop">
          <div className=" text-end">
            <button
              className=" border-0 bg-transparent px-1 fw-500 fs-4"
              onClick={() => setFilterPop(false)}
            >
              ✗
            </button>
          </div>
          <div>
            <label className=" text-black fs-xs" htmlFor="Spent">
              Total Spent
            </label>
            <input
              type="range"
              className="w-100 my-2"
              onChange={(e) => setOrderPriceValueSelect(e.target.value)}
              max={Math.max(
                ...location.state.deliverydata
                  .filter(
                    (value) =>
                      data[searchdata] === "All" ||
                      value.status === data[searchdata]
                  )
                  .map((value) => value.order_price)
              )}
              min={Math.min(
                ...location.state.deliverydata
                  .filter(
                    (value) =>
                      data[searchdata] === "All" ||
                      value.status === data[searchdata]
                  )
                  .map((value) => value.order_price)
              )}
              step={100}
              value={orderpricevalueselect}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.min(
                ...location.state.deliverydata
                  .filter(
                    (value) =>
                      data[searchdata] === "All" ||
                      value.status === data[searchdata]
                  )
                  .map((value) => value.order_price)
              )}
            </span>
            <span className="fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.max(
                ...location.state.deliverydata
                  .filter(
                    (value) =>
                      data[searchdata] === "All" ||
                      value.status === data[searchdata]
                  )
                  .map((value) => value.order_price)
              )}
            </span>
          </div>

          <form onSubmit={(e) => (e.preventDefault(), setFilterPop(false))}>
            <div className=" border border-dark-subtle mt-4">
              <input
                type="text"
                className=" w-100  py-2 px-3 border-0 outline_none"
                value={orderpricevalueselect}
                max={Math.max(
                  ...location.state.deliverydata.map(
                    (value) => value.order_price
                  )
                )}
                min={Math.min(
                  ...location.state.deliverydata.map(
                    (value) => value.order_price
                  )
                )}
                onChange={(e) => setOrderPriceValueSelect(e.target.value)}
              />
            </div>
            <div className=" text-end mt-4">
              <button
                type="button"
                onClick={() => setOrderPriceValueSelect(0)}
                className="apply_btn fs-sm fw-normal"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Delivery List</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <div className="d-flex px-2 gap-2 align-items-center input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                value={searchvalue}
                onChange={(e) => setSearchvalue(e.target.value)}
                className="fw-400 categorie_input"
                placeholder="Search for Customers..."
              />
            </div>
            <button
              className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400  "
              onClick={() => setFilterPop(true)}
            >
              <img
                className="me-1"
                width={24}
                src={filtericon}
                alt="filtericon"
              />
              Filter
            </button>
          </div>
        </div>
        {/* Customers details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="Customers_overflow_X">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="mw-450 py-2 px-3 w-100 cursor_pointer">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                          <input
                            onChange={handleMainCheckBox}
                            checked={customer.length === selectAll.length}
                            type="checkbox"
                          />
                          <span class="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ">
                          Name
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
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Registration</h3>
                    </th>
                    <th className="mw-300 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">City / State</h3>
                    </th>
                    <th className="mw_300 p-3 cursor_pointer">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Order Status
                        <span onClick={handleClickstatus}>
                          <img
                            className="ms-2 cursor_pointer"
                            width={20}
                            src={shortIcon}
                            alt="short-icon"
                          />
                        </span>
                      </h3>
                    </th>
                    <th className="mw-200 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Order Price</h3>
                    </th>
                    <th className="mw-90 p-3 text-center me-3">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {location.state.deliverydata
                    .filter((data) => {
                      return searchvalue.toLowerCase() === ""
                        ? data
                        : data.customer.name
                            .toLowerCase()
                            .includes(searchvalue);
                    })
                    .filter((value) => {
                      if (data[searchdata] === "All") {
                        return true;
                      } else {
                        return (
                          value.status.toLowerCase() ===
                          data[searchdata].toLowerCase()
                        );
                      }
                    })
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                    })
                    .filter((value) =>
                      Number(orderpricevalueselect)
                        ? value.order_price < Number(orderpricevalueselect)
                        : value
                    )
                    .sort((a, b) => b.order_price - a.order_price)
                    .map((item, index) => {
                      const {
                        id,
                        customer,
                        city,
                        is_customer,
                        email,
                        status,
                        uid,
                        is_wholesaler,
                        shipping,
                        image,
                        order_price,
                        created_at,
                      } = item;
                      const formatNumbers = function (num) {
                        return num < 10 ? "0" + num : num;
                      };
                      const formatDate = function (date) {
                        let day = formatNumbers(date.getDate());
                        let month = formatNumbers(date.getMonth() + 1);
                        let year = date.getFullYear();

                        return day + "-" + month + "-" + year;
                      };
                      const newval = new Date(created_at);
                      const newDate = formatDate(newval);
                      return (
                        <>
                          <tr>
                            <td className="py-2 px-3 w-100">
                              <div className="d-flex align-items-center gap-3 min_width_300">
                                <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                                  <input
                                    value={item.id}
                                    onChange={handlecheckboxes}
                                    checked={selectAll.includes(item.id)}
                                    type="checkbox"
                                  />
                                  <span class="checkmark"></span>
                                </label>
                                <div className="d-flex align-items-center">
                                  <img
                                    className="manicon me-2"
                                    src={!image ? manimage : image}
                                    alt="manicon"
                                  />
                                  <div>
                                    <Link
                                      className="d-flex py-1 color_blue"
                                      to={`viewcustomerdetails/${id}`}
                                    >
                                      {customer.name}
                                    </Link>

                                    <h3 className="fs-xxs fw-400 fade_grey mt-1 mb-0">
                                      {customer.email}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 mw_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {newDate}
                              </h3>
                            </td>
                            <td className="p-3 mw-300">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {shipping.city} / {shipping.state}
                              </h3>
                            </td>
                            <td className="p-3 mw-300">
                              <h2
                                className={`d-inline-block ${
                                  status.toString().toLowerCase() === "new"
                                    ? "fs-sm fw-400 red mb-0 new_order"
                                    : status.toString().toLowerCase() ===
                                      "processing"
                                    ? "fs-sm fw-400 mb-0 processing_skyblue"
                                    : status.toString().toLowerCase() ===
                                      "delivered"
                                    ? "fs-sm fw-400 mb-0 green stock_bg"
                                    : "fs-sm fw-400 mb-0 black cancel_gray"
                                }`}
                              >
                                {status}
                              </h2>
                            </td>
                            <td className="p-3 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                ₹ {order_price}
                              </h3>
                            </td>

                            <td className="text-center mw-90">
                              <div class="dropdown">
                                <button
                                  class="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton3"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <abbr title="View">
                                    <img src={threedot} alt="dropdownDots" />
                                  </abbr>
                                </button>
                                <ul
                                  class="dropdown-menu categories_dropdown border-0"
                                  aria-labelledby="dropdownMenuButton3"
                                >
                                  <li>
                                    <Link
                                      to={`/customer/viewcustomerdetails/${uid}`}
                                    >
                                      <div className="d-flex align-items-center categorie_dropdown_options">
                                        <img src={eye_icon} alt="" />
                                        <p className="fs-sm fw-400 black mb-0 ms-2">
                                          View Details
                                        </p>
                                      </div>
                                    </Link>
                                  </li>
                                  {/* <li> */}
                                  {/*
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
                                        <p className="fs-sm fw-400 red mb-0 ms-2">
                                          Delete
                                        </p>
                                      </div>
                                    </div>
                                  </li> */}
                                </ul>
                              </div>
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
  );
};

export default DeliveryList;

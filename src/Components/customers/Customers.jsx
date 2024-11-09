import React, { useState } from "react";
import filtericon from "../../Images/svgs/filtericon.svg";
import manicon from "../../Images/svgs/manicon.svg";
import threedot from "../../Images/svgs/threedot.svg";
import search from "../../Images/svgs/search.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import pencil_icon from "../../Images/svgs/pencil.svg";
import delete_icon from "../../Images/svgs/delte.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import manimage from "../../Images/Png/manimage.jpg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import { Link } from "react-router-dom";
import { useCustomerContext } from "../../context/Customergetters";
import { set } from "date-fns";
import { useOrdercontext } from "../../context/OrderGetter";

const Customers = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [orderpricevalueselect, setOrderPriceValueSelect] = useState(0);
  const [filterpop, setFilterPop] = useState(false);
  const [selectAll, setSelectAll] = useState([]);
  const { orders } = useOrdercontext();
  const { customer } = useCustomerContext();

  // Function to calculate total spent by a customer/////////////////////////////////////

  const totalSpentByCustomer = customer.map((customer) => {
    const totalSpent = orders
      .filter((order) => order.uid === customer.id)
      .reduce((total, order) => total + order.order_price, 0);

    return { ...customer, totalSpent };
  });

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
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
              step={100}
              value={orderpricevalueselect}
              min={Math.min(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
            />
          </div>
          <div className=" d-flex justify-content-between align-items-center">
            <span className=" fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.min(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
            </span>
            <span className=" fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.max(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
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
                  ...totalSpentByCustomer.map((value) => value.totalSpent)
                )}
                min={Math.min(
                  ...totalSpentByCustomer.map((value) => value.totalSpent)
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
            <h1 className="fw-500  mb-0 black fs-lg">Customers</h1>
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
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Group</h3>
                    </th>
                    <th className="mw-200 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Total Spent</h3>
                    </th>
                    <th className="mw-90 p-3 text-center me-3">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {totalSpentByCustomer
                    .filter((data) => {
                      return searchvalue.toLowerCase() === ""
                        ? data
                        : data.name.toLowerCase().includes(searchvalue);
                    })
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                    })
                    .filter((value) =>
                      Number(orderpricevalueselect)
                        ? value.totalSpent < Number(orderpricevalueselect)
                        : value
                    )
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .map((item, index) => {
                      const {
                        id,
                        city,
                        is_customer,
                        email,
                        is_salesman,
                        state,
                        is_wholesaler,
                        name,
                        image,
                        totalSpent,
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
                                      {name}
                                    </Link>

                                    <h3 className="fs-xxs fw-400 fade_grey mt-1 mb-0">
                                      {email}
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
                                {city} / {state}
                              </h3>
                            </td>
                            <td className="p-3 mw_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                Public
                              </h3>
                            </td>
                            <td className="p-3 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                ₹ {totalSpent}
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
                                    <Link to={`viewcustomerdetails/${id}`}>
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

export default Customers;

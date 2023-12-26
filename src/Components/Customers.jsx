import React from 'react';
import filtericon from '../Images/svgs/filtericon.svg';
import manicon from '../Images/svgs/manicon.svg';
import threedot from '../Images/svgs/threedot.svg';
import search from '../Images/svgs/search.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import updown_icon from '../Images/svgs/arross.svg';
import manimage from '../Images/Png/manimage.png';
import { Link } from 'react-router-dom';
import { useCustomerContext } from '../context/Customergetters';

const Customers = () => {
  const { customer } = useCustomerContext()
  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            {/* <button onClick={() => setOpen(!open)}>Click</button> */}
            <h1 className="fw-500  mb-0 black fs-lg">Customers</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <div className="d-flex px-2 gap-2 align-items-center input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                className="fw-400 categorie_input"
                placeholder="Search for categories..."
              />
            </div>
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400  ">
              <img className="me-1" width={24} src={filtericon} alt="filtericon" />
              Filter
            </button>
          </div>
        </div>
        {/* Customers details  */}
        <div className="p-3 mt-3 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="Customers_overflow_X">
              <div className="d-flex align-items-center justify-content-between py-3">
                <table className="w-100">
                  <tr className="product_borderbottom">
                    <th className="mw-450 py-2 px-3">
                      <div className="d-flex align-items-center gap-3">
                        <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                          Name
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
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
                    <th className=" mw-90 p-3 text-center me-3">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                  {customer.map((item, index) => {
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
                      created_at,
                    } = item;
                    const formatNumbers = function (num) {
                      return num < 10 ? '0' + num : num;
                    };
                    const formatDate = function (date) {
                      let day = formatNumbers(date.getDate());
                      let month = formatNumbers(date.getMonth() + 1);
                      let year = date.getFullYear();

                      return day + '-' + month + '-' + year;
                    };
                    const newval = new Date(created_at);
                    const newDate = formatDate(newval);
                    return (
                      <>
                        <tr>
                          <td className="py-2 px-3">
                            <div className="d-flex align-items-center gap-3">
                              <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                                <img
                                  className="manicon mx-2"
                                  src={!image ? manimage : image}
                                  alt="manicon"
                                />
                                <div>
                                  <Link
                                    className="d-flex py-1 color_black_02"
                                    to={`/customer/viewcustomerdetails/${id}`}>
                                    {name}
                                  </Link>

                                  <h3 className="fs-xxs fw-400 fade_grey mt-1 mb-0">{email}</h3>
                                </div>
                                <input type="checkbox" />
                                <span class="checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td className="p-3">
                            <h3 className="fs-sm fw-400 black mb-0">{newDate}</h3>
                          </td>
                          <td className="p-3">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {city} / {state}
                            </h3>
                          </td>
                          <td className="p-3">
                            <h3 className="fs-sm fw-400 black mb-0">Public</h3>
                          </td>
                          <td className="p-3">
                            <h3 className="fs-sm fw-400 black mb-0">₹ 32,460.00</h3>
                          </td>
                          <td className="text-center">
                            <div class="dropdown">
                              <button
                                class="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton3"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img
                                  // onClick={() => {
                                  //  ;
                                  // }}
                                  src={threedot}
                                  alt="dropdownDots"
                                />
                              </button>
                              <ul
                                class="dropdown-menu categories_dropdown"
                                aria-labelledby="dropdownMenuButton3">
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={eye_icon} alt="" />
                                      <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={pencil_icon} alt="" />
                                      <p className="fs-sm fw-400 black mb-0 ms-2">Edit Product</p>
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
                                    <div
                                      // onClick={() => handleDelete(item.id)}
                                      className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={delete_icon} alt="" />
                                      <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </table>
              </div>
              {/* <div className="product_borderbottom"></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;

import React, { useState } from 'react';
import filtericon from '../Images/svgs/filtericon.svg';
import SearchIcon from '../Images/svgs/search.svg';
import addicon from '../Images/svgs/addicon.svg';
import dropdownDots from '../Images/svgs/dots2.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import updown_icon from '../Images/svgs/arross.svg';
import { ProductList } from '../Common/Helper';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, NavLink } from 'react-router-dom';
import Modifyproduct from './Modifyproduct';

const ProductListComponent = () => {
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
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
              />
            </form>
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={24} src={filtericon} alt="filtericon" />
              Filter
            </button>
          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-3 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1350">
              <table className="w-100">
                <tr className="product_borderbottom">
                  <th className="mw-200 p-3">
                    <div className="d-flex align-items-center">
                      <label className="check1 fw-400 fs-sm black mb-0">
                        Order Number
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={() => setSelectAll(!selectAll)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </th>
                  <th className="mw-200 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                  </th>
                  <th className="mw-200 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Customer</h3>
                  </th>
                  <th className="mw_160 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Payment Status</h3>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <NavLink
                      to="/orderslist/neworder"
                      className="fs-sm fw-400 black mb-0 new_order">
                      New Order
                    </NavLink>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 new_order">New Order</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 new_order">New Order</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 new_order">New Order</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 new_order">New Order</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
                <tr>
                  <td className="p-3">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      #1002
                      <div className="d-flex align-items-center"></div>
                      <input type="checkbox" checked={selectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-xs fw-400 black mb-0">01-01-2023 | 10:20 AM</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">John Doe</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 stock_bg">Paid</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0 new_order">New Order</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">2 items</h3>
                  </td>
                  <td className="p-3">
                    <h3 className="fs-sm fw-400 black mb-0">₹ 1,260.00</h3>
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
                          //   handleDelete(value.id);
                          // }}
                          src={dropdownDots}
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
                              <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
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
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListComponent;

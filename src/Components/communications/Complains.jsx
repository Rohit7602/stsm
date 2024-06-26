import React from "react";
import starIcon from "../../Images/svgs/star-icon.svg";
import threeDots from "../../Images/svgs/dots2.svg";
import { NavLink } from "react-router-dom";

export default function Complain() {
  return (
    <div className="complain">
      <div className="complain_heading mt-4">
        <h2 className="fs_36 fw_500 color_black ff_outfit ps-2">Complaints</h2>
        <div className="d-flex align-items-center gap-3 mt-4 pt-1 ms-2">
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fs_12 fw_500">All</span> (68817)
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Pending</span> (6)
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Replyed</span> (17)
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Completed</span> (6810)
          </p>
        </div>
      </div>
      <div className="line_scroll mt-4">
        <div style={{ minWidth: "1500px", height: "calc(100vh - 254px)" }} className="bg-white">
          <table className="w-100">
            <tbody>
              <tr className="bg-white">
                <td className="p_10 mx_180">
                  <span className="d-flex align-items-center justify-content-between p_10">
                    <label class="check1 fw-400 fs-sm black mb-0">
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                    <img src={starIcon} alt="starIcon" />
                    <NavLink
                      to="/communications/complaindetails"
                      className="fs-xs fw_500 color_blue d-inline-block">
                      #2453
                    </NavLink>
                  </span>
                </td>
                <td className="px_10 mx_220 py-0">
                  <p className="fs-xs fw_500 color_black mb-0">John Doe</p>
                  <p className="fs-xxs fw_400 black opacity-75 mb-0">ID : 79G57H606865H9N0</p>
                </td>
                <td className="p_10 w-100 mx_xxl_580">
                  <p className="fs-xs fw_500 color_black m-0 mx_580">
                    Your credit score might be changed !!
                    <span className="fw_400 opacity-75">
                      Hi Navdeep, your updated credit score for feb’24 is here, check...
                    </span>
                  </p>
                </td>
                <td className="p_10 mx_125">
                  <p className="fs-xs fw_500 color_green complain_resolved m-0">Resolved</p>
                </td>
                <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                  3:02 PM
                </td>
                <td className=" mx_85 text-center">
                  <div class="dropdown complain_dd">
                    <button
                      class="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <img src={threeDots} alt="dropdownDots" />
                    </button>
                    <ul
                      class="dropdown-menu categories_dropdown py-2"
                      aria-labelledby="dropdownMenuButton3">
                      <li>
                        <div class="dropdown-item">
                          <button className="fs-xs fw_400 text-white comm_resolve_btn">
                            Resolve
                          </button>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <NavLink
                            to="/communications/complaindetails"
                            className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                            Details
                          </NavLink>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <button className="comm_delete_btn fs-xs fw_400 text-white">
                            Delete
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p_10 mx_180">
                  <span className="d-flex align-items-center justify-content-between p_10">
                    <label class="check1 fw-400 fs-sm black mb-0">
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                    <img src={starIcon} alt="starIcon" />
                    <NavLink
                      to="/communications/complaindetails"
                      className="fs-xs fw_500 color_blue d-inline-block">
                      #2453
                    </NavLink>
                  </span>
                </td>
                <td className="px_10 mx_220 py-0">
                  <p className="fs-xs fw_500 color_black mb-0">John Doe</p>
                  <p className="fs-xxs fw_400 black opacity-75 mb-0">ID : 79G57H606865H9N0</p>
                </td>
                <td className="p_10 w-100 mx_xxl_580">
                  <p className="fs-xs fw_500 color_black m-0 mx_580">
                    Your credit score might be changed !!
                    <span className="fw_400 opacity-75">
                      Hi Navdeep, your updated credit score for feb’24 is here, check...
                    </span>
                  </p>
                </td>
                <td className="p_10 mx_125">
                  <p className="fs-xs fw_500 color_green complain_resolved m-0">Resolved</p>
                </td>
                <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                  3:02 PM
                </td>
                <td className=" mx_85 text-center">
                  <div class="dropdown complain_dd">
                    <button
                      class="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <img src={threeDots} alt="dropdownDots" />
                    </button>
                    <ul
                      class="dropdown-menu categories_dropdown py-2"
                      aria-labelledby="dropdownMenuButton3">
                      <li>
                        <div class="dropdown-item">
                          <button className="fs-xs fw_400 text-white comm_resolve_btn">
                            Resolve
                          </button>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <NavLink
                            to="/communications/complaindetails"
                            className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                            Details
                          </NavLink>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <button className="comm_delete_btn fs-xs fw_400 text-white">
                            Delete
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p_10 mx_180">
                  <span className="d-flex align-items-center justify-content-between p_10">
                    <label class="check1 fw-400 fs-sm black mb-0">
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                    <img src={starIcon} alt="starIcon" />
                    <NavLink
                      to="/communications/complaindetails"
                      className="fs-xs fw_500 color_blue d-inline-block">
                      #2453
                    </NavLink>
                  </span>
                </td>
                <td className="px_10 mx_220 py-0">
                  <p className="fs-xs fw_500 color_black mb-0">John Doe</p>
                  <p className="fs-xxs fw_400 black opacity-75 mb-0">ID : 79G57H606865H9N0</p>
                </td>
                <td className="p_10 w-100 mx_xxl_580">
                  <p className="fs-xs fw_500 color_black m-0 mx_580">
                    Your credit score might be changed !!
                    <span className="fw_400 opacity-75">
                      Hi Navdeep, your updated credit score for feb’24 is here, check...
                    </span>
                  </p>
                </td>
                <td className="p_10 mx_125">
                  <p className="fs-xs fw_500  complain_pending m-0">Pending</p>
                </td>
                <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                  3:02 PM
                </td>
                <td className=" mx_85 text-center">
                  <div class="dropdown complain_dd">
                    <button
                      class="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <img src={threeDots} alt="dropdownDots" />
                    </button>
                    <ul
                      class="dropdown-menu categories_dropdown py-2"
                      aria-labelledby="dropdownMenuButton3">
                      <li>
                        <div class="dropdown-item">
                          <button className="fs-xs fw_400 text-white comm_resolve_btn">
                            Resolve
                          </button>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <NavLink
                            to="/communications/complaindetails"
                            className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                            Details
                          </NavLink>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <button className="comm_delete_btn fs-xs fw_400 text-white">
                            Delete
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p_10 mx_180">
                  <span className="d-flex align-items-center justify-content-between p_10">
                    <label class="check1 fw-400 fs-sm black mb-0">
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                    <img src={starIcon} alt="starIcon" />
                    <NavLink
                      to="/communications/complaindetails"
                      className="fs-xs fw_500 color_blue d-inline-block">
                      #2453
                    </NavLink>
                  </span>
                </td>
                <td className="px_10 mx_220 py-0">
                  <p className="fs-xs fw_500 color_black mb-0">John Doe</p>
                  <p className="fs-xxs fw_400 black opacity-75 mb-0">ID : 79G57H606865H9N0</p>
                </td>
                <td className="p_10 w-100 mx_xxl_580">
                  <p className="fs-xs fw_500 color_black m-0 mx_580">
                    Your credit score might be changed !!
                    <span className="fw_400 opacity-75">
                      Hi Navdeep, your updated credit score for feb’24 is here, check...
                    </span>
                  </p>
                </td>
                <td className="p_10 mx_125">
                  <p className="fs-xs fw_500  complain_pending m-0">Pending</p>
                </td>
                <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                  3:02 PM
                </td>
                <td className=" mx_85 text-center">
                  <div class="dropdown complain_dd">
                    <button
                      class="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <img src={threeDots} alt="dropdownDots" />
                    </button>
                    <ul
                      class="dropdown-menu categories_dropdown py-2"
                      aria-labelledby="dropdownMenuButton3">
                      <li>
                        <div class="dropdown-item">
                          <button className="fs-xs fw_400 text-white comm_resolve_btn">
                            Resolve
                          </button>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <NavLink
                            to="/communications/complaindetails"
                            className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                            Details
                          </NavLink>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <button className="comm_delete_btn fs-xs fw_400 text-white">
                            Delete
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p_10 mx_180">
                  <span className="d-flex align-items-center justify-content-between p_10">
                    <label class="check1 fw-400 fs-sm black mb-0">
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                    <img src={starIcon} alt="starIcon" />
                    <NavLink
                      to="/communications/complaindetails"
                      className="fs-xs fw_500 color_blue d-inline-block">
                      #2453
                    </NavLink>
                  </span>
                </td>
                <td className="px_10 mx_220 py-0">
                  <p className="fs-xs fw_500 color_black mb-0">John Doe</p>
                  <p className="fs-xxs fw_400 black opacity-75 mb-0">ID : 79G57H606865H9N0</p>
                </td>
                <td className="p_10 w-100 mx_xxl_580">
                  <p className="fs-xs fw_500 color_black m-0 mx_580">
                    Your credit score might be changed !!
                    <span className="fw_400 opacity-75">
                      Hi Navdeep, your updated credit score for feb’24 is here, check...
                    </span>
                  </p>
                </td>
                <td className="p_10 mx_125">
                  <p className="fs-xs fw_500  complain_pending m-0">Pending</p>
                </td>
                <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                  3:02 PM
                </td>
                <td className=" mx_85 text-center">
                  <div class="dropdown complain_dd">
                    <button
                      class="btn dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton3"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <img src={threeDots} alt="dropdownDots" />
                    </button>
                    <ul
                      class="dropdown-menu categories_dropdown py-2"
                      aria-labelledby="dropdownMenuButton3">
                      <li>
                        <div class="dropdown-item">
                          <button className="fs-xs fw_400 text-white comm_resolve_btn">
                            Resolve
                          </button>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <NavLink
                            to="/communications/complaindetails"
                            className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                            Details
                          </NavLink>
                        </div>
                      </li>
                      <li>
                        <div class="dropdown-item">
                          <button className="comm_delete_btn fs-xs fw_400 text-white">
                            Delete
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

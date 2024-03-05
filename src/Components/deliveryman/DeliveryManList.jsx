import React, { useState } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import search from "../../Images/svgs/search.svg";

import dropdownDots from "../../Images/svgs/dots2.svg";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
const DeliveryManList = () => {
  const [loading, setloading] = useState(false);
  const [searchvalue, setSearchvalue] = useState("");
  //  get parent category  function  end  from here
  if (loading) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">Delivery Man </h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search for Order’s and Deivery M.."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <Link className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Delivery Man
              </Link>
            </div>
          </div>
          <div className="row justify-content-star  mt-3">
            <div className="col-xl col-lg-3 col-md-6 mr-3  mt-3 mt-lg-0">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between align-items-center justify-content-center   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">
                    Active Delivery Man’s
                  </h3>
                  <button className="fw-400 color_blue fs-xs border-0 bg-white">
                    <img src={dropdownDots} alt="dropdownDots" />
                  </button>
                </div>
                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg"> 6</h3>
                </div>
              </div>
            </div>
            <div className="col-xl col-lg-3 col-md-6 mr-3 mt-3 mt-lg-0 ">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between align-items-center justify-content-center   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">On Going Delivery</h3>
                  <button className="fw-400 color_blue fs-xs border-0 bg-white">
                    <img src={dropdownDots} alt="dropdownDots" />
                  </button>
                </div>
                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg"> 160</h3>
                </div>
              </div>
            </div>
            <div className="col-xl col-lg-3 col-md-6 mr-3 mt-3 mt-lg-0 ">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between align-items-center justify-content-center   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Pending Delivery</h3>
                  <button className="fw-400 color_blue fs-xs border-0 bg-white">
                    <img src={dropdownDots} alt="dropdownDots" />
                  </button>
                </div>
                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg"> 120</h3>
                </div>
              </div>
            </div>
            <div className="col-xl col-lg-3 col-md-6 mr-3 mt-3 mt-lg-0 ">
              <div className="bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between align-items-center justify-content-center   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Cancled Delivery</h3>
                  <button className="fw-400 color_blue fs-xs border-0 bg-white">
                    <img src={dropdownDots} alt="dropdownDots" />
                  </button>
                </div>
                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg"> 0</h3>
                </div>
              </div>
            </div>
          </div>
          {/* Chart-section-bar  */}
          <div className="mt-3 ">
            <div className="row  justify-content-between ">
              <div className="col-xl-4 col-lg-5 col-12  ">
                <div className="chart_content_wrapper p-4 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between pb-3 bottom_border">
                    <p className="fw-400 mb-0 text-black"> Loads</p>
                    <Link className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                      <img
                        className="me-1"
                        width={20}
                        src={addicon}
                        alt="add-icon"
                      />
                      add Item
                    </Link>
                  </div>
                  <div className="row align-items-center py-3 justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0"> Item</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> Sold</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> Available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center  justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0"> Khal</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> 27 KG</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  text-end mb-0">
                            {" "}
                            150 KG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center mt-3 justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0"> Ghee</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> 27 KG</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  text-end mb-0">
                            {" "}
                            150 KG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center mt-3 justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0"> Sugar</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> 27 KG</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  text-end mb-0">
                            {" "}
                            150 KG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center mt-3 justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0">Surf</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> 27 KG</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  text-end mb-0">
                            {" "}
                            150 KG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center mt-3 justify-content-between">
                    <div className="col-6">
                      <p className="fw-400 text-black  mb-0">Oil</p>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-6">
                          <p className="fw-400 text-black  mb-0"> 27 KG</p>
                        </div>
                        <div className="col-6">
                          <p className="fw-400 text-black  text-end mb-0">
                            {" "}
                            150 KG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-12 h-100 mt-4 mt-lg-0 ">
                <div className="  h-100 chart_box px-2 py-3  chart_content_wrapper bg-white">
                  <div className="d-flex justify-content-between   bg-white">
                    <h3 className="fw-400 black fs-xs">Delivery Static </h3>
                    <button className="fw-400 fs-xxxs date_btn">
                      Year 2024
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.68689 7.53418L9.24518 11.0925L12.8035 7.53418"
                          stroke="black"
                          stroke-width="2.13497"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default DeliveryManList;

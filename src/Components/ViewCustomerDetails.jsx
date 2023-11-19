import React from "react";
import saveicon from "../Images/svgs/saveicon.svg";
import threedot from "../Images/svgs/threedot.svg";
import manimage from "../Images/Png/manimage.png";
import SearchIcon from "../Images/svgs/search.svg";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  getDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const ViewCustomerDetails = ({ setOpen, open }) => {
  const { id } = useParams();
  const [data, setData] = useState([]);


  const formatNumbers = function (num) {
    return num < 10 ? "0" + num : num;
  };
  const formatDate = function (date) {
    let day = formatNumbers(date.getDate());
    let month = formatNumbers(date.getMonth() + 1);
    let year = date.getFullYear();

    return day + "-" + month + "-" + year;
  };
  const newval = new Date(data.created_at);
  const newDate = formatDate(newval);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const docRef = doc(db, "customers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
     
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100 d-flex flex-column">
      {/* top-bar  */}
      <div className="top_bar px-3  bg-white py-2 ">
        <div className="d-flex align-items-center  justify-content-between">
          <div className="d-flex align-items-center search_bar_wrapper">
            <svg
              onClick={() => setOpen(!open)}
              className="togle cursor   "
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.3999 9.59961C2.3999 9.28135 2.52633 8.97613 2.75137 8.75108C2.97642 8.52604 3.28164 8.39961 3.5999 8.39961H15.9695C16.2878 8.39961 16.593 8.52604 16.818 8.75108C17.0431 8.97613 17.1695 9.28135 17.1695 9.59961C17.1695 9.91787 17.0431 10.2231 16.818 10.4481C16.593 10.6732 16.2878 10.7996 15.9695 10.7996H3.5999C3.28164 10.7996 2.97642 10.6732 2.75137 10.4481C2.52633 10.2231 2.3999 9.91787 2.3999 9.59961ZM2.3999 4.79961C2.3999 4.48135 2.52633 4.17612 2.75137 3.95108C2.97642 3.72604 3.28164 3.59961 3.5999 3.59961H20.3999C20.7182 3.59961 21.0234 3.72604 21.2484 3.95108C21.4735 4.17612 21.5999 4.48135 21.5999 4.79961C21.5999 5.11787 21.4735 5.42309 21.2484 5.64814C21.0234 5.87318 20.7182 5.99961 20.3999 5.99961H3.5999C3.28164 5.99961 2.97642 5.87318 2.75137 5.64814C2.52633 5.42309 2.3999 5.11787 2.3999 4.79961ZM2.3999 14.3996C2.3999 14.0814 2.52633 13.7761 2.75137 13.5511C2.97642 13.326 3.28164 13.1996 3.5999 13.1996H20.3999C20.7182 13.1996 21.0234 13.326 21.2484 13.5511C21.4735 13.7761 21.5999 14.0814 21.5999 14.3996C21.5999 14.7179 21.4735 15.0231 21.2484 15.2481C21.0234 15.4732 20.7182 15.5996 20.3999 15.5996H3.5999C3.28164 15.5996 2.97642 15.4732 2.75137 15.2481C2.52633 15.0231 2.3999 14.7179 2.3999 14.3996ZM2.3999 19.1996C2.3999 18.8814 2.52633 18.5761 2.75137 18.3511C2.97642 18.126 3.28164 17.9996 3.5999 17.9996H15.9695C16.2878 17.9996 16.593 18.126 16.818 18.3511C17.0431 18.5761 17.1695 18.8814 17.1695 19.1996C17.1695 19.5179 17.0431 19.8231 16.818 20.0481C16.593 20.2732 16.2878 20.3996 15.9695 20.3996H3.5999C3.28164 20.3996 2.97642 20.2732 2.75137 20.0481C2.52633 19.8231 2.3999 19.5179 2.3999 19.1996Z"
                fill="black"
              />
            </svg>
            <form
              className="form_box   mx-2 d-flex p-2 align-items-center"
              action=""
            >
              <div className="d-flex">
                <img src={SearchIcon} alt=" search icon" />
              </div>
              <input
                type="text"
                className="bg-transparent  border-0 px-2 fw-400  outline-none"
                placeholder="Search in the admin panel"
              />
            </form>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 18H19V11.031C19 7.148 15.866 4 12 4C8.134 4 5 7.148 5 11.031V18ZM12 2C16.97 2 21 6.043 21 11.031V20H3V11.031C3 6.043 7.03 2 12 2ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="container">
          <div className="d-flex  align-items-center flex-column gap-2 gap-sm-0 flex-sm-row  justify-content-between">
            <div className="d-flex">
              {/* <button onClick={() => setOpen(!open)}>Click</button> */}
              <h1 className="fw-500  mb-0 black fs-lg">
                View Customer Details
              </h1>
            </div>
            <div className="d-flex align-itmes-center gap-3">
              <button className="reset_border">
                <button className="fs-sm reset_btn  border-0 fw-400 ">
                  Block Customer
                </button>
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
                <img className="manimage" src={!data.image ?manimage :data.image} alt="manimage" />
                <h2 className="fw-700 fs-2sm black mb-0 mt-3">{data.name}</h2>
                <h2 className="fw-400 fs-2sm black mb-0 mt-2">
                  {data.email}
                </h2>
                <h2 className="fw-400 fs-2sm black mb-0 ">{data.phone}</h2>
              </div>
              {/*   last order */}
              <div className="product_shadow bg_white p-3 mt-3">
                <h2 className="fw-400 fs-2sm black mb-0  ">Last Order</h2>
                <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">
                  3 days ago -{" "}
                  <span className="color_light_blue">#87oh67t</span>
                </h2>
                <h2 className="fw-400 fs-2sm black mb-0 mt-3  ">
                  Average Order Value
                </h2>
                <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">345.00</h2>
                <h2 className="fw-400 fs-2sm black mb-0 mt-3 ">Registration</h2>
                <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">
                  {newDate}
                </h2>
              </div>
            </Col>
            <Col xxl={8}>
              <div className="product_shadow p-3 bg_white mt-3 mt-xxl-0">
                <div className="overflow_lg_scroll">
                  <div className="customer_lg_overflow_X">
                    <div className="d-flex justify-content-between align-items-center">
                      <h2 className="fw-400 fs-2sm black mb-0  "> Order</h2>{" "}
                      <h2 className="fw-400 fs-2sm black mb-0  ">
                        Total Spent : ₹ 12,590.00
                      </h2>
                    </div>
                    {/* 1st */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Order No.{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Order Date{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Status{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Items{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15  me-2">
                        {" "}
                        Billed Amount{" "}
                      </h2>
                    </div>

                    <div className="product_borderbottom mt-3"></div>
                    {/* 2nd */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h2 className="fw-400 fs-sm color_green mb-0 mt-3 ">
                        {" "}
                        #p7oh67gtbyh{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        01-01-2023{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Pending{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        2 items{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 me-2">
                        ₹ 1,260.00
                      </h2>
                    </div>
                    <div className="product_borderbottom mt-3"></div>
                    {/* 3rd */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h2 className="fw-400 fs-sm color_green mb-0 mt-3 ">
                        {" "}
                        #p7oh67gtbyh{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        01-01-2023{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Pending{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        2 items{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 me-2">
                        ₹ 1,260.00
                      </h2>
                    </div>
                    <div className="product_borderbottom mt-3"></div>
                    {/* 4th */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h2 className="fw-400 fs-sm color_green mb-0 mt-3 ">
                        {" "}
                        #p7oh67gtbyh{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        01-01-2023{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        Pending{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 ">
                        {" "}
                        2 items{" "}
                      </h2>
                      <h2 className="fw-400 fs-sm black mb-0 mt-3 width_15 me-2">
                        ₹ 1,260.00
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="product_borderbottom mt-3"></div>
                <div className="mt-3 d-flex align-items-center justify-content-center">
                  <button className="border-0 bg-transparent fs-sm fw-400 color_blue">
                    View all 6 orders
                  </button>
                </div>
              </div>
              <div className="product_shadow p-3 bg_white mt-3">
                <h2 className="fw-400 fs-2sm black mb-0  "> Addresses</h2>{" "}
                <div className="product_borderbottom mt-3"></div>
                {/* 1st */}
                <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                  <div>
                    <h2 className="fw-700 fs-sm black mb-0   ">John Doe</h2>
                    <h2 className="fw-400 fs-xs black mb-0   ">
                      Address Line 1, Landmark, Area, Landmark, City, State
                    </h2>
                  </div>
                  <img className="threedot" src={threedot} alt="threedot" />
                </div>
                <div className="product_borderbottom mt-3"></div>
                {/* 2nd */}
                <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                  <div>
                    <h2 className="fw-700 fs-sm black mb-0   ">John Doe</h2>
                    <h2 className="fw-400 fs-xs black mb-0   ">
                      Address Line 1, Landmark, Area, Landmark, City, State
                    </h2>
                  </div>
                  <img className="threedot" 
                
                  src={threedot} alt="threedot" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerDetails;

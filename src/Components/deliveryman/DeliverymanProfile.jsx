import React from "react";
import paymenticon from "../../Images/svgs/saveicon.svg";
import { Col, Row } from "react-bootstrap";
import profile_image from "../../Images/Png/customer_profile.png";
const DeliverymanProfile = () => {
  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mt-4 mx-2">
        <h1 className="fw-500  mb-0 black fs-lg">
          John loe #0001 <span className="fs-2sm">( Delivery Man )</span>
        </h1>
        <div className="d-flex justify-content-center">
          <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
            <div className="d-flex align-itmes-center gap-3">
              <button className="reset_border">
                <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                  <svg
                    width="14"
                    height="18"
                    viewBox="0 0 14 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H11C11.5304 18 12.0391 17.7893 12.4142 17.4142C12.7893 17.0391 13 16.5304 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z"
                      fill="#D73A60"
                    />
                  </svg>
                  Delete Delivery Man
                </button>
              </button>
              <button className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black">
                <img src={paymenticon} alt="paymenticon" />
                Payment
              </button>
              <svg className="cursor_pointer"
                width="44"
                height="48"
                viewBox="0 0 44 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="48" rx="10" fill="white" />
                <path
                  d="M25 17.9997L28 20.9997M23 31.9997H31M15 27.9997L14 31.9997L18 30.9997L29.586 19.4137C29.9609 19.0386 30.1716 18.53 30.1716 17.9997C30.1716 17.4694 29.9609 16.9608 29.586 16.5857L29.414 16.4137C29.0389 16.0388 28.5303 15.8281 28 15.8281C27.4697 15.8281 26.9611 16.0388 26.586 16.4137L15 27.9997Z"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-4 py-3 px-2 mt-2 mb-3">
        <p className="fs-xs fw-400 black mb-0">22 Feb 2024</p>
        <span>|</span>
        <p className="fs-xs fw-400 black mb-0">4 Items delivered</p>
        <span>|</span>
        <p className="fs-xs fw-400 black mb-0 paid stock_bg">Paid Amount</p>
      </div>
      <Row>
        <Col xxl={8}>
          <div className="p-3 bg-white product_shadow">
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="d-flex align-items-center mw-300 p-2">
                <div>
                  <img
                    src={profile_image}
                    alt="mobileicon"
                    className="items_images"
                  />
                </div>
                <div className="ps-3">
                  <p className="fs-sm fw-400 black mb-0">John Doe</p>
                  <p className="fs-xxs fw-400 fade_grey mb-0">
                    john@example.com
                  </p>
                </div>
              </div>
            </div>
            <div className="row align-items-center mt-4">
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">DOB</p>
                <p className="mb-0 fs-sm fw-400 black">22 March 1980</p>
              </div>
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">Mobile</p>
                <p className="mb-0 fs-sm fw-400 black">+91 849858590</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0 fs-sm fw-400 black">Address</p>
              <p className="mb-0 fs-sm fw-400 black">
                #01, Talaki Gate, Near Bus stand<br></br>Hisar - 125001
                (Haryana)
              </p>
            </div>
            <p className="mb-0 fs-2sm fw-400 black mt-4">Bank Detail’s</p>
            <div className="row align-items-center mt-3 ">
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">Bank Name</p>
                <p className="mb-0 fs-sm fw-400 black">
                  Punjab National Bank Hisar
                </p>
              </div>
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">Routing Number</p>
                <p className="mb-0 fs-sm fw-400 black">( HS45545SS )</p>
              </div>
            </div>
            <div className="row align-items-center mt-3 ">
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">Account Holder’s Name</p>
                <p className="mb-0 fs-sm fw-400 black">John leo</p>
              </div>
              <div className="col-6">
                <p className="mb-0 fs-sm fw-400 black">Account No.</p>
                <p className="mb-0 fs-sm fw-400 black">5422545436XC</p>
              </div>
            </div>
            <p className="mb-0 fs-2sm fw-400 black mt-4">
              Payment Method <br></br>Direct
            </p>
          </div>
          <Row>
            <Col xxl={5}>
              <div className="p-3 bg-white product_shadow mt-4">
                <p className="mb-0 fs-2sm fw-400 black ">
                  Emergency Contact Information
                </p>
                <p className="mb-0 fs-2sm fw-400 black mt-4">Dipu Kumar</p>
                <div className="mt-4">
                  <p className="mb-0 fs-sm fw-400 black">
                    Relatonship to Employee{" "}
                  </p>
                  <p className="mb-0 fs-sm fw-400 black">Brother</p>
                </div>
                <div className="mt-4">
                  <p className="mb-0 fs-sm fw-400 black">Contact </p>
                  <p className="mb-0 fs-sm fw-400 black">+9144545562655</p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xxl={4}>
          <div className="p-3 bg-white product_shadow">
            <div className="d-flex align-items-center justify-content-between">
              <p className="mb-0 fs-sm fw-400 black mb-0">Working Status </p>
              <div className="text-end">
                <p className="mb-0 fs-xs fw-400 black mb-0">Started </p>
                <p className="mb-0 fs-sm fw-400 black mb-0">22/02/24</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0 fs-sm fw-400 black">Full Time </p>
              <p className="mb-0 fs-sm fw-400 black">10AM to 5 PM</p>
            </div>
            <div className="mt-4">
              <p className="mb-0 fs-sm fw-400 black">Identifiaction </p>
              <p className="mb-0 fs-sm fw-400 black">
                Rashan card (45543535435430)
              </p>
            </div>
          </div>
          <div className="p-3 bg-white product_shadow mt-4">
            <p className="mb-0 fs-2sm fw-400 black ">Vehicle Information</p>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div>
                <p className="mb-0 fs-xs fw-400 black mb-0">
                  Vehicle Regestration Number
                </p>
                <p className="mb-0 fs-sm fw-400 black mb-0">D872D665546</p>
              </div>
              <div className="text-end">
                <p className="mb-0 fs-xs fw-400 black mb-0">Type of Vehicle </p>
                <p className="mb-0 fs-sm fw-400 black mb-0">Motorcycle</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-0 fs-sm fw-400 black">Incurence detail </p>
              <p className="mb-0 fs-sm fw-400 black">42563436466</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DeliverymanProfile;

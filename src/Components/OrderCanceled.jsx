import React from 'react';
import saveicon from '../Images/svgs/saveicon.svg';
import mobileicon from '../Images/Png/mobile_icon_40.png';
import profile from '../Images/Png/customer_profile.png';
import billicon from '../Images/svgs/bill_icon.svg';
import { Col, Row } from 'react-bootstrap';
export default function NewOrder() {
  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      <div className="d-flex align-items-center justify-content-between py-3 my-1">
        <div className="d-flex align-items-center">
          <h1 className="fs-lg fw-500 black mb-0 me-1">Order #1002</h1>
          <p className="cancel_gray fs-xs fw-400 mb-0 black ms-3">Canceled</p>
        </div>
        <div className="d-flex align-items-center">
          <button
            className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black"
            type="submit">
            <img src={saveicon} alt="saveicon" />
            Mark as Refunded
          </button>
        </div>
      </div>
      <div className="d-flex align-items-center gap-4 py-3 px-2 mt-2 mb-3">
        <p className="fs-xs fw-400 black mb-0">01-01-2023 at 10:30 AM</p>
        <span>|</span>
        <p className="fs-xs fw-400 black mb-0">2 items</p>
        <span>|</span>
        <p className="fs-xs fw-400 black mb-0">₹ 1,260.00</p>
        <span>|</span>
        <p className="fs-xs fw-400 black mb-0 paid stock_bg">Paid</p>
      </div>
      <Row className="">
        <Col xxl={8}>
          <div className="p-3 bg-white product_shadow">
            <p className="fs-2sm fw-400 black mb-0">Items</p>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="d-flex align-items-center mw-300 p-2">
                <img src={mobileicon} alt="mobileicon" />
                <div className="ps-3">
                  <p className="fs-sm fw-400 black mb-0">Vivo V3 Pro</p>
                  <p className="fs-xxs fw-400 fade_grey mb-0">ID : 1022</p>
                </div>
              </div>
              <div className="d-flex align-items-center p-3">
                <p className="fs-sm fw-400 black mb-0">₹ 300.00</p>
                <p className="fs-sm fw-400 black mb-0 ps-4 ms-2">2</p>
              </div>
              <p className="fs-sm fw-400 black mb-0 p-3">₹ 300.00</p>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="d-flex align-items-center mw-300 p-2">
                <img src={mobileicon} alt="mobileicon" />
                <div className="ps-3">
                  <p className="fs-sm fw-400 black mb-0">Vivo V3 Pro</p>
                  <p className="fs-xxs fw-400 fade_grey mb-0">ID : 1022</p>
                </div>
              </div>
              <div className="d-flex align-items-center p-3">
                <p className="fs-sm fw-400 black mb-0">₹ 300.00</p>
                <p className="fs-sm fw-400 black mb-0 ps-4 ms-2">1</p>
              </div>
              <p className="fs-sm fw-400 black mb-0 p-3">₹ 300.00</p>
            </div>
            <div className="product_borderbottom mt-3"></div>
            <div className="d-flex align-items-center justify-content-between mt-4">
              <p className="fs-sm fw-400 black mb-0">Subtotal</p>
              <p className="fs-sm fw-400 black mb-0">₹ 1,260.00</p>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <p className="fs-sm fw-400 black mb-0">Shipping Cost</p>
              <p className="fs-sm fw-400 black mb-0">₹ 0.00</p>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2 mb-4">
              <p className="fs-sm fw-400 black mb-0">Promo Discount</p>
              <p className="fs-sm fw-400 black mb-0">(-) ₹ 50.00</p>
            </div>
            <div className="product_borderbottom mt-3"></div>
            <div>
              <div className="d-flex align-items-center justify-content-between mt-4 mb-3">
                <p className="fs-sm fw-400 black mb-0">Total</p>
                <p className="fs-sm fw-700 black mb-0">₹ 1,260.00</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white product_shadow mt-4">
            <p className="fs-2sm fw-400 black mb-0">Transactions</p>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="p-2">
                <p className="fs-sm fw-400 black mb-0">Mode of Payment</p>
                <p className="fs-xxs fw-400 fade_grey mb-0">via UPI | tx : HO67G58TH9</p>
              </div>
              <p className="fs-sm fw-400 black mb-0 p-3">01-01-2023</p>
              <p className="fs-sm fw-400 black mb-0 p-3">₹ 1,260.00</p>
            </div>
          </div>
        </Col>
        <Col xxl={4}>
          <div className="p-3 bg-white product_shadow">
            <p className="fs-2sm fw-400 black mb-0">Customer</p>
            <div className="d-flex align-items-center p-2 mt-3">
              <img src={profile} alt="profile" />
              <div className="ps-3">
                <p className="fs-sm fw-400 black mb-0">John Doe</p>
                <p className="fs-xxs fw-400 fade_grey mb-0">john@example.com</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="fs-2sm fw-400 black mb-0">Contact</p>
              <p className="fs-xs fw-400 black mb-0 pt-1 mt-3">John Doe</p>
              <p className="fs-xs fw-400 black mb-0 pt-1">#01, Talaki Gate, Near Bus stand</p>
              <p className="fs-xs fw-400 black mb-0 pt-1">Hisar - 125001 (Haryana)</p>
            </div>
          </div>
          <div className="p-3 bg-white product_shadow mt-4">
            <p className="fs-2sm fw-400 black mb-0">Shipping Info</p>
            <p className="fs-xs fw-400 black mb-0 pt-1 mt-3">John Doe</p>
            <p className="fs-xs fw-400 black mb-0 pt-1">#01, Talaki Gate, Near Bus stand</p>
            <p className="fs-xs fw-400 black mb-0 pt-1">Hisar - 125001 (Haryana)</p>
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="d-flex align-items-center bill_generate">
              <img src={billicon} alt="billicon" />
              <p className="fs-sm fw-400 black mb-0 ms-2">Generate Bill</p>
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

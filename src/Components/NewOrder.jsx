import React from 'react';
import saveicon from '../Images/svgs/saveicon.svg';
import { Col, Row } from 'react-bootstrap';
export default function NewOrder() {
  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      <div className="d-flex align-items-center justify-content-between py-3 my-1">
        <div className="d-flex align-items-center">
          <h1 className="fs-lg fw-500 black mb-0 me-1">Order #1002</h1>
          <p className="neworder_red fs-xs fw-400 red mb-0 ms-3">New Order</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-itmes-center gap-3">
            <button className="reset_border">
              <button className="fs-sm reset_btn  border-0 fw-400">Reject Order</button>
            </button>
            <button
              className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
              type="submit">
              <img src={saveicon} alt="saveicon" />
              ACCEPT ORDER
            </button>
          </div>
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
          
        </Col>
        <Col xxl={4}></Col>
      </Row>
    </div>
  );
}

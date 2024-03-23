import React from 'react';
import billLogo from '../../Images/svgs/bill-logo.svg';
const InvoiceBill = () => {
  return (
    <div>
      <div className="bill m-auto">
        <div className="d-flex align-items-center justify-content-between">
          <img src={billLogo} alt="billLogo" />
          <div className="text-end">
            <h1 className="fs_24 fw-700 black mb-0">INVOICE</h1>
            <p className="fs-xxs fw_700 black mb-0"># G67R7G78H9</p>
            <p className="fs-xs fw_400 green mb-0">PAID</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div className="w-50">
              <p className="fs-xs fw-700 black mb-0">Save Time Save Money</p>
              <p className="fs-xxs fw-400 black mb-0 mt-1">Near TVS Agency, Hansi Road, Barwala</p>
              <p className="fs-xxs fw-400 black mb-0 mt-1">Hisar, Haryana - 125121</p>
              <p className="fs-xxs fw-400 black mb-0 mt-1">GSTIN : 06GWMPS2545Q1ZJ</p>
            </div>
            <div className="text-end w-50">
              <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
              <p className="fs-xxs fw-700 black mb-0">John Doe</p>
              <p className="fs-xxs fw-400 black mb-0 mt-1">Street/ Area/ Landmark Name,</p>
              <p className="fs-xxs fw-400 black mb-0 mt-4 text-end">Invoice Date : 01-01-2024</p>
            </div>
          </div>
          <table className="w-100 mt-3">
            <thead>
              <tr className="bg_dark_black">
                <th className="fs-xxs fw-400 white p_10">#</th>
                <th className="fs-xxs fw-400 white p_10">Item Description</th>
                <th className="fs-xxs fw-400 white p_10 text-center">Qty</th>
                <th className="fs-xxs fw-400 white p_10 text-end">Unit Cost</th>
                <th className="fs-xxs fw-400 white p_10 text-center">Tax</th>
                <th className="fs-xxs fw-400 white p_10 text-end">Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fs-xxs fw-400 black p_5_10">1</td>
                <td className="p_5_10">
                  <span>
                    <p className="fs-xxs fw-400 black mb-0">Kamdhenu Khal</p>
                    <span className="d-flex align-items-center gap-2">
                      <p className=" fs-xxxs fw-700 black mb-0">₹ 130 OFF</p>
                      <p className="fs-xxxs fw-400 black mb-0"> MRP : 1360.00</p>
                    </span>
                    <span className="d-flex align-items-center gap-3">
                      <p className=" fs-xxxs fw-400 black mb-0">Variant : 49 KG</p>
                      <p className="fs-xxxs fw-400 black mb-0">Color : Red</p>
                    </span>
                  </span>
                </td>
                <td className="fs-xxs fw-400 black p_5_10 text-center">2</td>
                <td className="fs-xxs fw-400 black p_5_10 text-end">1230.00</td>
                <td className="fs-xxs fw-400 black p_5_10 text-center">0%</td>
                <td className="fs-xxs fw-400 black p_5_10 text-end">2567.00</td>
              </tr>
              <tr>
                <td className="fs-xxs fw-400 black p_5_10">1</td>
                <td className="p_5_10">
                  <span>
                    <p className="fs-xxs fw-400 black mb-0">Kamdhenu Khal</p>
                    <span className="d-flex align-items-center gap-2">
                      <p className=" fs-xxxs fw-700 black mb-0">₹ 130 OFF</p>
                      <p className="fs-xxxs fw-400 black mb-0"> MRP : 1360.00</p>
                    </span>
                    <span className="d-flex align-items-center gap-3">
                      <p className=" fs-xxxs fw-400 black mb-0">Variant : 49 KG</p>
                      <p className="fs-xxxs fw-400 black mb-0">Color : Red</p>
                    </span>
                  </span>
                </td>
                <td className="fs-xxs fw-400 black p_5_10 text-center">2</td>
                <td className="fs-xxs fw-400 black p_5_10 text-end">1230.00</td>
                <td className="fs-xxs fw-400 black p_5_10 text-center">0%</td>
                <td className="fs-xxs fw-400 black p_5_10 text-end">2567.00</td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="w-75 text-end">
              <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
              <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">Promo Discount</p>
              <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">Total Amount</p>
            </div>
            <div className="text-end">
              <p className="fs_xxs fw-400 black mb-0">₹ 2567.00</p>
              <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">(-) ₹ 0.00</p>
              <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">₹ 2567.00</p>
            </div>
          </div>
        </div>
        <span className="mt-3 bill_border d-inline-block"></span>
        <p className="fs-xxxs fw-400 black m-0 mt-1">
          Note : You Saved <span className="fw-700">₹ 260.00</span> on product discount.
        </p>
        <p className="fs_xxs fw-400 black mb-0 mt-3">Transactions:</p>
        <table className="mt-3 w-100">
          <thead>
            <tr>
              <th className="fs-xxs fw-400 black py_2">Transaction ID</th>
              <th className="fs-xxs fw-400 black py_2">Payment Mode</th>
              <th className="fs-xxs fw-400 black py_2">Date</th>
              <th className="fs-xxs fw-400 black py_2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bill_border">
              <td className="fs-xxs fw-400 black py-1">5798h608HTI</td>
              <td className="fs-xxs fw-400 black py-1">UPI</td>
              <td className="fs-xxs fw-400 black py-1">01-01-2024</td>
              <td className="fs-xxs fw-400 black py-1">01-01-2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InvoiceBill;

import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { InvoicesList } from "../../Common/Helper";
import rightDubbleArrow from "../../Images/svgs/dubble-arrow.svg";
import pdfIcon from "../../Images/svgs/pdf-icon.svg";
import printIcon from "../../Images/svgs/print-icon2.svg";
import { ReactToPrint } from "react-to-print";

export default function Invoices() {
  const [viewSideBill, setViewSideBIll] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);
  const componentRef = useRef();

  return (
    <>
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body invoice_data">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="fw-500 black fs-lg mb-0">Invoices</h1>
            <img
              onClick={() =>
                setViewSideBIll(viewSideBill === true ? false : true)
              }
              className={`transform_rotate cursor_pointer ${
                viewSideBill === true ? "transform_rotate_arrow" : ""
              }`}
              src={rightDubbleArrow}
              alt="rightDubbleArrow"
            />
          </div>

          {/* categories details  */}

          <div className="px-3 pb-2 bg-white product_shadow mt-4 position-relative">
            {viewSideBill === true ? (
              <div className="side_invoice_view">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <NavLink
                    to="/invoicesbill"
                    className="d-flex align-items-center view_pdf_btn"
                  >
                    <p className="fs-xxs fw-400 black mb-0">View PDF</p>
                    <img src={pdfIcon} alt="pdfIcon" />
                  </NavLink>
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <button
                          onClick={() => window.print()}
                          className="d-flex align-items-center view_pdf_btn ms-1"
                        >
                          <p className="fs-xxs fw-400 black mb-0">PRINT</p>
                          <img src={printIcon} alt="printIcon" />
                        </button>
                      );
                    }}
                    content={() => componentRef.current}
                    documentTitle="Invoice"
                    pageStyle="print"
                  />
                </div>
                <div className="mt-3">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div className="w-50">
                      <p className="fs-xs fw-700 black mb-0"># G67R7G78H9</p>
                      <p className="fs-xs fw-700 black mb-0">
                        Save Time Save Money
                      </p>
                      <p className="fs-xs fw-400 black mb-0 mt-1">
                        Street/ Area/ Landmark Name,
                      </p>
                      <p className="fs-xs fw-400 black mb-0 mt-1">
                        City, State - Pin Code
                      </p>
                    </div>
                    <div className="text-end w-50">
                      <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                      <p className="fs-xxs fw-700 black mb-0">John Doe</p>
                      <p className="fs-xs fw-400 black mb-0 mt-1">
                        Street/ Area/ Landmark Name,
                      </p>
                      <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                        Invoice Date : 01-01-2024
                      </p>
                    </div>
                  </div>
                  <table className="w-100 mt-3">
                    <thead>
                      <tr className="bg_dark_black">
                        <th className="fs-xxs fw-400 white p_10">#</th>
                        <th className="fs-xxs fw-400 white p_10">
                          Item Description
                        </th>
                        <th className="fs-xxs fw-400 white p_10 text-center">
                          Qty
                        </th>
                        <th className="fs-xxs fw-400 white p_10 text-end">
                          Rate
                        </th>
                        <th className="fs-xxs fw-400 white p_10 text-center">
                          Tax
                        </th>
                        <th className="fs-xxs fw-400 white p_10 text-end">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="fs-xxs fw-400 black p_5_10">1</td>
                        <td className="p_5_10">
                          <span>
                            <p className="fs-xxs fw-400 black mb-0">
                              Kamdhenu Khal
                            </p>
                            <span className="d-flex align-items-center gap-3 mt-1">
                              <p className=" fs-xxxs fw-400 black mb-0">
                                Variant : 49 KG
                              </p>
                              <p className="fs-xxxs fw-400 black mb-0">
                                Color : Red
                              </p>
                            </span>
                          </span>
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-center">
                          2
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-end">
                          1230.00
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-center">
                          0%
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-end">
                          2567.00
                        </td>
                      </tr>
                      <tr>
                        <td className="fs-xxs fw-400 black p_5_10">1</td>
                        <td className="p_5_10">
                          <span>
                            <p className="fs-xxs fw-400 black mb-0">
                              Kamdhenu Khal
                            </p>
                            <span className="d-flex align-items-center gap-3 mt-1">
                              <p className=" fs-xxxs fw-400 black mb-0">
                                Variant : 49 KG
                              </p>
                              <p className="fs-xxxs fw-400 black mb-0">
                                Color : Red
                              </p>
                            </span>
                          </span>
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-center">
                          2
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-end">
                          1230.00
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-center">
                          0%
                        </td>
                        <td className="fs-xxs fw-400 black p_5_10 text-end">
                          2567.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="w-75 text-end">
                      <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
                      <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                        Total
                      </p>
                      <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                        Total Paid
                      </p>
                      <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                        Amount Due
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="fs_xxs fw-400 black mb-0">₹ 2567.00</p>
                      <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                        ₹ 2567.00
                      </p>
                      <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                        ₹ 2567.00
                      </p>
                      <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                        ₹ 2567.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th className="mx_220 p-2">
                        <p className="fw-400 fs-sm black mb-0 cursor_pointer">
                          # Invoice
                        </p>
                      </th>
                      <th className="mx_180 px-2 py-3">
                        <p className="fs-sm fw-400 black mb-0">Customer</p>
                      </th>
                      <th className="mx_150 cursor_pointer px-2 py-3">
                        <p className="fw-400 fs-sm black mb-0">Date</p>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Amount</h3>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Total Tax</h3>
                      </th>
                      <th className="mx_180 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Payment Status
                        </h3>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Payment Mode
                        </h3>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Paid On</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {InvoicesList.map((items) => {
                      return (
                        <tr className="product_borderbottom">
                          <td className="px-2 py-3 mx_220">
                            <Link
                              onClick={() =>
                                setViewSideBIll(
                                  viewSideBill === true ? false : true
                                )
                              }
                              className="fs-sm fw-400 color_blue mb-0"
                            >
                              {items.Invoice}
                            </Link>
                          </td>
                          <td className="px-2 py-3 mx_180">
                            <Link className="fs-sm fw-400 color_blue mb-0">
                              {items.Customer}
                            </Link>
                          </td>
                          <td className="px-2 py-3 mx_150">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {items.Date}
                            </h3>
                          </td>
                          <td className="px-2 py-3 mx_150">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {items.Amount}
                            </h3>
                          </td>
                          <td className="px-2 py-3 mx_150">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {items.TotalTax}
                            </h3>
                          </td>
                          <td className="px-2 py-3 mx_180">
                            <h3
                              className={`fs-sm fw-400 black mb-0 ${
                                items.PaymentStatus === "Unpaid"
                                  ? "unpiad"
                                  : "paid_invoice"
                              }`}
                            >
                              {items.PaymentStatus}
                            </h3>
                          </td>
                          <td className="px-2 py-3 mx_150">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {items.PaymentMode}
                            </h3>
                          </td>
                          <td className="px-2 py-3 mx_150">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {items.PaidOn === "" ? "-" : items.PaidOn}
                            </h3>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/************* {Invoice PDF} *************/}

      <div>
        <div className="bill m-auto" ref={componentRef}>
          <div className="text-end">
            <h1 className="fs_24 fw-700 black mb-0">INVOICE</h1>
            <p className="fs-xxs fw_700 black mb-0"># G67R7G78H9</p>
            <p className="fs-xs fw_400 green mb-0">PAID</p>
          </div>
          <div className="mt-3">
            <div className="d-flex align-items-start justify-content-between gap-3">
              <div className="w-50">
                <p className="fs-xs fw-700 black mb-0">Save Time Save Money</p>
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  Street/ Area/ Landmark Name,
                </p>
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  City, State - Pin Code
                </p>
              </div>
              <div className="text-end w-50">
                <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                <p className="fs-xxs fw-700 black mb-0">John Doe</p>
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  Street/ Area/ Landmark Name,
                </p>
                <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                  Invoice Date : 01-01-2024
                </p>
              </div>
            </div>
            <table className="w-100 mt-3">
              <thead>
                <tr className="bg_dark_black">
                  <th className="fs-xxs fw-400 white p_10">#</th>
                  <th className="fs-xxs fw-400 white p_10">Item Description</th>
                  <th className="fs-xxs fw-400 white p_10 text-center">Qty</th>
                  <th className="fs-xxs fw-400 white p_10 text-end">Rate</th>
                  <th className="fs-xxs fw-400 white p_10 text-center">Tax</th>
                  <th className="fs-xxs fw-400 white p_10 text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fs-xxs fw-400 black p_5_10">1</td>
                  <td className="p_5_10">
                    <span>
                      <p className="fs-xxs fw-400 black mb-0">Kamdhenu Khal</p>
                      <span className="d-flex align-items-center gap-3 mt-1">
                        <p className=" fs-xxxs fw-400 black mb-0">
                          Variant : 49 KG
                        </p>
                        <p className="fs-xxxs fw-400 black mb-0">Color : Red</p>
                      </span>
                    </span>
                  </td>
                  <td className="fs-xxs fw-400 black p_5_10 text-center">2</td>
                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                    1230.00
                  </td>
                  <td className="fs-xxs fw-400 black p_5_10 text-center">0%</td>
                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                    2567.00
                  </td>
                </tr>
                <tr>
                  <td className="fs-xxs fw-400 black p_5_10">1</td>
                  <td className="p_5_10">
                    <span>
                      <p className="fs-xxs fw-400 black mb-0">Kamdhenu Khal</p>
                      <span className="d-flex align-items-center gap-3 mt-1">
                        <p className=" fs-xxxs fw-400 black mb-0">
                          Variant : 49 KG
                        </p>
                        <p className="fs-xxxs fw-400 black mb-0">Color : Red</p>
                      </span>
                    </span>
                  </td>
                  <td className="fs-xxs fw-400 black p_5_10 text-center">2</td>
                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                    1230.00
                  </td>
                  <td className="fs-xxs fw-400 black p_5_10 text-center">0%</td>
                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                    2567.00
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <div className="w-75 text-end">
                <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
                <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">Total</p>
                <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">Total Paid</p>
                <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">Amount Due</p>
              </div>
              <div className="text-end">
                <p className="fs_xxs fw-400 black mb-0">₹ 2567.00</p>
                <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">₹ 2567.00</p>
                <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">₹ 2567.00</p>
                <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">₹ 2567.00</p>
              </div>
            </div>
          </div>
          <span className="mt-3 bill_border d-inline-block"></span>
          <p className="fs_xxs fw-400 black mb-0 mt-3">Transactions:</p>
          <table className="mt-3 w-100">
            <thead>
              <tr>
                <th className="fs-xxs fw-400 black py_2">Transaction ID</th>
                <th className="fs-xxs fw-400 black py_2">Payment Mode</th>
                <th className="fs-xxs fw-400 black py_2">Date</th>
                <th className="fs-xxs fw-400 black py_2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bill_border">
                <td className="fs-xxs fw-400 black py-1">5798h608HTI</td>
                <td className="fs-xxs fw-400 black py-1">UPI</td>
                <td className="fs-xxs fw-400 black py-1">01-01-2024</td>
                <td className="fs-xxs fw-400 black py-1">₹ 1067.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

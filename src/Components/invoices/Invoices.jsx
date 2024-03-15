import React from "react";
import { Link } from "react-router-dom";
import { InvoicesList } from "../../Common/Helper";
import rightDubbleArrow from "../../Images/svgs/dubble-arrow.svg";
import pdfIcon from "../../Images/svgs/pdf-icon.svg";
import printIcon from "../../Images/svgs/print-icon2.svg";

export default function Invoices() {
  return (
    <div className="main_panel_wrapper bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="fw-500 black fs-lg mb-0">Invoices</h1>
          <img src={rightDubbleArrow} alt="rightDubbleArrow" />
        </div>

        {/* categories details  */}

        <div className="px-3 pb-2 bg-white product_shadow mt-4 position-relative">
          <div className="side_invoice_view">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <button className="d-flex align-items-center view_pdf_btn">
                <p className="fs-xxs fw-400 black mb-0">View PDF</p>
                <img src={pdfIcon} alt="pdfIcon" />
              </button>
              <button className="d-flex align-items-center view_pdf_btn ms-1">
                <p className="fs-xxs fw-400 black mb-0">PRINT</p>
                <img src={printIcon} alt="printIcon" />
              </button>
            </div>
            <div className="mt-3">
              <div className="d-flex align-items-center justify-content-between">
                <p className="fs-xs fw-700 black mb-0"># G67R7G78H9</p>
                <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <p className="fs-xs fw-700 black mb-0">Save Time Save Money</p>
                <p className="fs-xxs fw-700 black mb-0">John Doe</p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  Street/ Area/ Landmark Name,
                </p>
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  Street/ Area/ Landmark Name,
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="fs-xs fw-400 black mb-0 mt-1">
                  City, State - Pin Code
                </p>
                <p className="fs-xs fw-400 black mb-0 mt-1"></p>
              </div>
              <p className="fs-xs fw-400 black mb-0 mt-1 text-end">
                Invoice Date : 01-01-2024
              </p>
            </div>
          </div>
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
                      <h3 className="fs-sm fw-400 black mb-0">Payment Mode</h3>
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
                          <Link className="fs-sm fw-400 color_blue mb-0">
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
  );
}

import React from "react";
import { Link } from 'react-router-dom';
import { InvoicesList } from "../../Common/Helper";
export default function Invoices() {
  return (
    <div className="main_panel_wrapper bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <h1 className="fw-500   black fs-lg mb-0">Invoices</h1>

        {/* categories details  */}

        <div className="p-3 bg-white product_shadow mt-4">
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
                 {InvoicesList.map((items)=>{
                    return(
                        <tr className="product_borderbottom">
                        <td className="px-2 py-3 mx_220">
                          <Link className="fs-sm fw-400 color_blue mb-0">{items.Invoice}</Link>
                        </td>
                        <td className="px-2 py-3 mx_180">
                        <Link className="fs-sm fw-400 color_blue mb-0">{items.Customer}</Link>
                        </td>
                        <td className="px-2 py-3 mx_150">
                          <h3 className="fs-sm fw-400 black mb-0">{items.Date}</h3>
                        </td>
                        <td className="px-2 py-3 mx_150">
                          <h3 className="fs-sm fw-400 black mb-0">{items.Amount}</h3>
                        </td>
                        <td className="px-2 py-3 mx_150">
                          <h3 className="fs-sm fw-400 black mb-0">{items.TotalTax}</h3>
                        </td>
                        <td className="px-2 py-3 mx_180">
                          <h3 className={`fs-sm fw-400 black mb-0 ${items.PaymentStatus==="Unpaid"? "unpiad":"paid_invoice"}`}>{items.PaymentStatus}</h3>
                        </td>
                        <td className="px-2 py-3 mx_150">
                          <h3 className="fs-sm fw-400 black mb-0">{items.PaymentMode}</h3>
                        </td>
                        <td className="px-2 py-3 mx_150">
                          <h3 className="fs-sm fw-400 black mb-0">{items.PaidOn===""? "-":items.PaidOn}</h3>
                        </td>
                      </tr>
                    )
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

import React from 'react'
import { Link } from 'react-router-dom';
import { useCustomerContext } from '../context/Customergetters';
import { CrossIcons } from '../Common/Icon';
import { useOrdercontext } from '../context/OrderGetter';

const AllCustomerPopup = ({ setShowAllCustomers }) => {
    const { customer } = useCustomerContext();
    const {ordersAll}=useOrdercontext()
    const totalSpentByCustomer = customer.map((customer) => {
        const totalSpent = ordersAll
            .filter((order) => order.uid === customer.id)
            .filter((value) => value.status.toUpperCase() === "DELIVERED")
            .reduce((total, order) => total + order.order_price, 0);
        return { ...customer, totalSpent };
    });
  return (
    <div>
          <div className="bg-white p-4 rounded-4 w-100 position-fixed center_pop  h-100">
            <div className="d-flex align-items-center justify-content-between">
                          <h2 className="text-black fw-700 fs-2sm mb-0">
                            All Orders
                          </h2>
                          <button
                            className="border-0 bg-white"
                      onClick={() => setShowAllCustomers(false)}
                          >
                            <CrossIcons />
                          </button>
                        </div>
              <div className="overflow-x-scroll line_scroll">
                  <div className="Customers_overflow_X">
                      <table className="w-100">
                          <thead className="table_head w-100">
                              <tr className="product_borderbottom">
                                  <th className="mw-450 py-2 px-3 w-100 cursor_pointer">
                                      <div className="d-flex align-items-center gap-3 min_width_300">
                                          
                                          <p className="fw-400 fs-sm black mb-0 ">
                                              Name
                                              
                                          </p>
                                      </div>
                                  </th>
                                  <th className="mw_160 p-3">
                                      <h3 className="fs-sm fw-400 black mb-0">
                                          Registration{" "}
                                          
                                      </h3>
                                  </th>
                                  <th className="mw-300 p-3">
                                      <h3 className="fs-sm fw-400 black mb-0">City / State</h3>
                                  </th>
                                  <th className="mw_160 p-3">
                                      <h3 className="fs-sm fw-400 black mb-0">Group</h3>
                                  </th>
                                  <th className="mw-200 p-3">
                                      <h3 className="fs-sm fw-400 black mb-0">Total Spent</h3>
                                  </th>
                                 
                              </tr>
                          </thead>
                          <tbody className="table_body">
                              {totalSpentByCustomer.map((item, index) => {
                                      const {
                                          id,
                                          city,
                                          email,
                                          state,
                                          name,
                                          totalSpent,
                                          addresses,
                                          created_at,
                                      } = item;
                                      const formatNumbers = function (num) {
                                          return num < 10 ? "0" + num : num;
                                      };
                                      const formatDate = function (date) {
                                          let day = formatNumbers(date.getDate());
                                          let month = formatNumbers(date.getMonth() + 1);
                                          let year = date.getFullYear();

                                          return day + "-" + month + "-" + year;
                                      };
                                      const newval = new Date(created_at);
                                      const newDate = formatDate(newval);
                                      return (
                                          <>
                                              <tr
                                                  key={id}
                                                 
                                              >
                                                  <td className="py-2 px-3">
                                                      <div className="d-flex align-items-center gap-3">
                                                         
                                                          <div className="d-flex align-items-center">
                                                             
                                                              <div>
                                                                  <Link
                                                                      className="d-flex py-1 color_blue"
                                                                     
                                                                  >
                                                                      {name}
                                                                  </Link>

                                                                  <h3 className="fs-xxs fw-400 fade_grey mt-1 mb-0">
                                                                      {email}
                                                                  </h3>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </td>
                                                  <td className="p-3 mw_160">
                                                      <h3 className="fs-sm fw-400 black mb-0">
                                                          {newDate}
                                                      </h3>
                                                  </td>
                                                  <td className="p-3 mw-300">
                                                      <h3 className="fs-sm fw-400 black mb-0">
                                                          {addresses[0]
                                                              ? `${addresses[0].city} / ${city} / ${state}`
                                                              : "Not Available Service Area"}
                                                      </h3>
                                                  </td>
                                                  <td className="p-3 mw_160">
                                                      <h3 className="fs-sm fw-400 black mb-0">
                                                          Public
                                                      </h3>
                                                  </td>
                                                  <td className="p-3 mw-200">
                                                      <h3 className="fs-sm fw-400 black mb-0">
                                                          ₹ {totalSpent}
                                                      </h3>
                                                  </td>

                                                 
                                              </tr>
                                          </>
                                      );
                                  })}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default AllCustomerPopup

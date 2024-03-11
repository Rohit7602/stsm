import React, { useEffect, useState } from 'react';
import SearchIcon from '../../Images/svgs/search.svg';
import { Link } from 'react-router-dom';
import {DateIcon, ExportIcon} from "../../Common/Icon"
import { useOrdercontext } from '../../context/OrderGetter';
const DeliveryOrderList = () => {
  // context
  const { orders, updateData } = useOrdercontext();
  const [searchvalue, setSearchvalue] = useState('');

  /*  *******************************
  checkbox functionality start 
*********************************************   **/
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = orders.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [orders]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = orders.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateData(updatedData);
    setSelectAll(!selectAll);
  };

  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...orders];
    updatedData[index].checked = !orders[index].checked;
    updateData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  /*  *******************************
      Sorting Functionality start from here 
    *********************************************   **/

  const [order, setorder] = useState('ASC');
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...orders];

    if (order === 'ASC') {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        console.log('asdf', valueA);
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateData(sortedData);
  };

  /*  *******************************
      Sorting Functionality end from here  
    *********************************************   **/

  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Order’s List</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <form className="form_box   mx-2 d-flex p-2 align-items-center" action="">
              <div className="d-flex">
                <img src={SearchIcon} alt=" search icon" />
              </div>
              <input
                type="text"
                className="bg-transparent  border-0 px-2 fw-400  outline-none"
                placeholder="Search for Orders"
                onChange={(e) => setSearchvalue(e.target.value)}
              />
            </form>
            <button className="addnewproduct_btn black d-flex align-items-center gap-2 fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <DateIcon />
                Jan 1  2024 - Feb 1  2024
              </button>
              <button className="addnewproduct_btn black d-flex align-items-center gap-2 fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <ExportIcon />
                Export
              </button>
          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1120">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="mw_200 p-3 w-100 cursor_pointer" onClick={() => sorting('id')}>
                      <div className="d-flex align-items-center min_width_300">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                        Customer
                          
                        </p>
                      </div>
                    </th>
                    <th className="mw_130 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Sold Items</h3>
                    </th>
                    <th className="mw_140 p-3" onClick={() => sorting('customer.name')}>
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th className="mw_140 p-3">
                        <h3 className="fs-sm fw-400 black mb-0 ">
                        Quantity
                        </h3>
                      
                    </th>
                    <th className="mw_220 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Address</h3>
                    </th>
                    <th className="mw_140 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Online orders</h3>
                    </th>
                    <th className="mw_130 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Method</h3>
                    </th>
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Amount</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {orders
                    .filter((items) => {
                      return (
                        searchvalue.toLowerCase() === '' ||
                        items.id.toLowerCase().includes(searchvalue)
                      );
                    })
                    .map((orderTableData, index) => {
                      return (
                        <tr>
                          <td className="p-3 w-100">
                            <div className="min_width_300  d-flex align-items-center">
                              <label className="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={orderTableData.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <Link
                                className="fw-400 fs-sm black ms-2"
                                to={`orderdetails/${orderTableData.id}`}>
                               John Doe
                              </Link>
                            </div>
                          </td>
                          <td className="p-3 mw_130">
                            <h3 className="fs-xs fw-400 color_green mb-0">
                            Ghee
                            </h3>
                          </td>
                          <td className="p-3 mw_140">
                            <Link to={`/customer/viewcustomerdetails/${orderTableData.uid}`}>
                              <h3 className="fs-sm fw-400 black mb-0">
                              26/02/24
                              </h3>
                            </Link>
                          </td>
                          <td className="p-3 mw_140">
                            <h3
                              className="fs-sm fw-400 mb-0 d-inline-block ">
                            10KG
                            </h3>
                          </td>
                          <td className="p-3 mw_220">
                            <p
                              className="d-inline-block ">
                         #01, Talaki Gate, Near Bus stand
                            </p>
                          </td>
                          <td className="p-3 mw_140">
                            <h3 className="fs-sm fw-400 black mb-0">
                            Online 
                            </h3>
                          </td>
                          <td className="p-3 mw_130">
                            <h3 className="fs-sm fw-400 black mb-0">
                            Cash
                            </h3>
                          </td>
                          <td className="text-center mx_100">
                          ₹ 700.00
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
};

export default DeliveryOrderList;

import React, {  useRef, useState } from "react";
import filtericon from "../../Images/svgs/filtericon.svg";
import threedot from "../../Images/svgs/threedot.svg";
import search from "../../Images/svgs/search.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import manimage from "../../Images/Png/manimage.jpg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import { Link } from "react-router-dom";
import {  useCustomerContext } from "../../context/Customergetters";
import { useOrdercontext } from "../../context/OrderGetter";
import Loader from "../Loader";

const Customers = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [orderpricevalueselect, setOrderPriceValueSelect] = useState(0);
  const [filterpop, setFilterPop] = useState(false);
  const [selectAll, setSelectAll] = useState([]);
  const [pincode, setPinCode] = useState("");
  const [servicearea, setServicearea] = useState("");

  const { customer, fetchMoreCustomers, loading, hasMore } =
    useCustomerContext();
  const [filtervalue, setFilterValue] = useState("");
  const [customerdate, setCustomerdate] = useState(false);

  const [loader, setLoader]=useState(false)

 const {ordersAll}=useOrdercontext()


// infinite customer calls

  const observer = useRef();

  const lastOrderRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreCustomers();
      }
    });

    if (node) observer.current.observe(node);
  };

  // Function to calculate total spent by a customer/////////////////////////////////////
  const customeraddress = customer
    .flatMap((value) => value.addresses)
    .map((value) => value);

  let uniquePincodes = [
    ...new Set(customeraddress.map((value) => value.pincode)),
  ];

  let uniqueservice = customeraddress.filter(
    (value) => value.pincode === Number(pincode)
  );

  let uniqueservicename = [
    ...new Set(uniqueservice.map((value) => value.city)),
  ];

  const totalSpentByCustomer = customer.map((customer) => {
    const totalSpent = ordersAll
      .filter((order) => order.uid === customer.id)
      .filter((value) => value.status.toUpperCase() === "DELIVERED")
      .reduce((total, order) => total + order.order_price, 0);
    return { ...customer, totalSpent };
  });

  function handlecheckboxes(e) {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectAll([...selectAll, value]);
    } else {
      setSelectAll((prev) =>
        prev.filter((id) => {
          return id != value;
        })
      );
    }
  }
  function handleMainCheckBox() {
    if (customer.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = customer.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }

  

  //////////////////////  Export Excel File  //////////////////////////

  const ExcelJS = require("exceljs");
  function exportExcelFile() {
    const workbook = new ExcelJS.Workbook();
    const excelSheet = workbook.addWorksheet("Order List");
    excelSheet.properties.defaultRowHeight = 20;

    excelSheet.getRow(1).font = {
      name: "Conic Sans MS",
      family: 4,
      size: 14,
      bold: true,
    };
    excelSheet.columns = [
      {
        header: "CustomerVisit",
        key: "CustomerVisit",
        width: 40,
      },
      {
        header: "CustomerName",
        key: "CustomerName",
        width: 40,
      },
      {
        header: "Email",
        key: "Email",
        width: 40,
      },
      {
        header: "PhoneNo",
        key: "PhoneNo",
        width: 25,
      },

      {
        header: "State",
        key: "State",
        width: 25,
      },
      {
        header: "Colony",
        key: "Colony",
        width: 25,
      },
      {
        header: "City",
        key: "City",
        width: 30,
      },
      {
        header: "Pincode",
        key: "Pincode",
        width: 20,
      },

      {
        header: "totalSpent",
        key: "totalSpent",
        width: 25,
      },
    ];

    totalSpentByCustomer
      .filter((data) => {
        return searchvalue.toLowerCase() === ""
          ? data
          : data.name.toLowerCase().includes(searchvalue);
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      })
      .filter((value) =>
        Number(orderpricevalueselect)
          ? value.totalSpent < Number(orderpricevalueselect)
          : value
      )
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .filter((customer) =>
        Number(pincode)
          ? customer.addresses.some(
              (address) => address.pincode === Number(pincode)
            )
          : customer
      )
      .filter((customer) =>
        servicearea
          ? customer.addresses.some(
              (address) =>
                address.city.toLowerCase() === servicearea.toLowerCase()
            )
          : customer
      )
      .sort((a, b) =>
        customerdate
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      )
      .map((customer) => {
        let date = new Date(customer.created_at);
        excelSheet.addRow({
          CustomerVisit: `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${date.getFullYear()}`,
          CustomerName: customer?.name,
          Email: customer?.email,
          City: customer.addresses[0]?.city,
          Pincode: `${
            customer.addresses[0]?.pincode
              ? customer.addresses[0]?.pincode
              : " "
          }`,
          State: customer?.state,
          PhoneNo: customer?.phone,
          Colony: customer.addresses[0]?.colony,
          totalSpent: `₹ ${customer?.totalSpent}`,
        });
      });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "customerList.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }

  console.log(totalSpentByCustomer,"totalSpentByCustomer");


 if (loader) {
   return <Loader />;
 }
  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      {filterpop ? <div className="bg_black_overlay"></div> : null}
      {filterpop && (
        <div className="customer_pop position-fixed center_pop">
          <div className=" text-end">
            <button
              className=" border-0 bg-transparent px-1 fw-500 fs-4"
              onClick={() => setFilterPop(false)}
            >
              ✗
            </button>
          </div>
          <div>
            <label className=" text-black fs-xs" htmlFor="Spent">
              Total Spent
            </label>
            <input
              type="range"
              className="w-100 my-2"
              onChange={(e) => setOrderPriceValueSelect(e.target.value)}
              max={Math.max(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
              step={100}
              value={orderpricevalueselect}
              min={Math.min(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
            />
          </div>
          <div className=" d-flex justify-content-between align-items-center">
            <span className=" fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.min(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
            </span>
            <span className=" fw-normal fs-xxs text-black opacity-50">
              ₹{" "}
              {Math.max(
                ...totalSpentByCustomer.map((value) => value.totalSpent)
              )}
            </span>
          </div>

          <form onSubmit={(e) => (e.preventDefault(), setFilterPop(false))}>
            <div className=" border border-dark-subtle mt-4">
              <input
                type="text"
                className=" w-100  py-2 px-3 border-0 outline_none"
                value={orderpricevalueselect}
                max={Math.max(
                  ...totalSpentByCustomer.map((value) => value.totalSpent)
                )}
                min={Math.min(
                  ...totalSpentByCustomer.map((value) => value.totalSpent)
                )}
                onChange={(e) => setOrderPriceValueSelect(e.target.value)}
              />
            </div>
            <div className="w-100 d-flex align-items-center gap-3 quantity_bg mt-4 rounded-3">
              <select
                required
                value={pincode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-100  bg-transparent outline_none border-0"
              >
                <option value={"All"}>Select Pin Code</option>
                {uniquePincodes.map((pincode) => (
                  <option key={pincode} value={pincode}>
                    {pincode}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdown w-100">
              <button
                style={{ height: "44px" }}
                className="w-100 d-flex align-items-center gap-3 quantity_bg mt-4 rounded-3"
                type="button"
                id="dropdownMenuButton3"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <p className="ff-outfit fw-400 fs_sm mb-0 ">
                    {servicearea ? servicearea : "Select Service Area"}
                  </p>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <ul
                className="dropdown-menu delivery_man_dropdown w-100 pt-0 bg-white mt-3"
                aria-labelledby="dropdownMenuButton3"
              >
                <li className="p-2 position-sticky start-0 top-0 bg-white">
                  <input
                    type="text"
                    className="form-control shadow-none border-1 border-dark-subtle"
                    placeholder="Search Service Area..."
                    value={filtervalue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </li>
                {uniqueservicename
                  .filter((v) =>
                    v.toLowerCase().includes(filtervalue.toLowerCase())
                  )
                  .map((servicearea, index) => (
                    <li key={index}>
                      <div
                        onClick={() => {
                          setServicearea(servicearea);
                          setFilterValue("");
                        }}
                        className="dropdown-item py-2"
                      >
                        <p className="fs-sm fw-400 black m-0">{servicearea}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <div className=" text-end mt-4">
              <button
                type="button"
                onClick={() => (
                  setOrderPriceValueSelect(0),
                  setPinCode(""),
                  setServicearea("")
                )}
                className="apply_btn fs-sm fw-normal"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Customers</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <div className="d-flex px-2 gap-2 align-items-center input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                value={searchvalue}
                onChange={(e) => setSearchvalue(e.target.value)}
                className="fw-400 categorie_input"
                placeholder="Search for Customers..."
              />
            </div>
            <button
              className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400  "
              onClick={() => setFilterPop(true)}
            >
              <img
                className="me-1"
                width={24}
                src={filtericon}
                alt="filtericon"
              />
              Filter
            </button>
            <button
              onClick={exportExcelFile}
              className="export_btn  white fs-xxs px-3 py-2 fw-400 border-0"
            >
              Export
            </button>
          </div>
        </div>
        {/* Customers details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="Customers_overflow_X">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="mw-450 py-2 px-3 w-100 cursor_pointer">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                          <input
                            onChange={handleMainCheckBox}
                            checked={customer.length === selectAll.length}
                            type="checkbox"
                          />
                          <span class="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ">
                          Name
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </p>
                      </div>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Registration{" "}
                        <span onClick={() => setCustomerdate(!customerdate)}>
                          <img
                            className="ms-2 cursor_pointer"
                            width={20}
                            src={shortIcon}
                            alt="short-icon"
                          />
                        </span>
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
                    <th className="mw-90 p-3 text-center me-3">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {totalSpentByCustomer
                    .filter((data) => {
                      return searchvalue.toLowerCase() === ""
                        ? data
                        : data.name.toLowerCase().includes(searchvalue);
                    })
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB - dateA;
                    })
                    .filter((value) =>
                      Number(orderpricevalueselect)
                        ? value.totalSpent < Number(orderpricevalueselect)
                        : value
                    )
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .filter((customer) =>
                      Number(pincode)
                        ? customer.addresses.some(
                            (address) => address.pincode === Number(pincode)
                          )
                        : customer
                    )
                    .filter((customer) =>
                      servicearea
                        ? customer.addresses.some(
                            (address) =>
                              address.city.toLowerCase() ===
                              servicearea.toLowerCase()
                          )
                        : customer
                    )
                    .sort((a, b) =>
                      customerdate
                        ? new Date(a.created_at) - new Date(b.created_at)
                        : new Date(b.created_at) - new Date(a.created_at)
                    )

                    .map((item, index) => {
                      const {
                        id,
                        city,
                        is_customer,
                        email,
                        is_salesman,
                        state,
                        is_wholesaler,
                        name,
                        image,
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
                            ref={
                              index === customer.length - 1 ? lastOrderRef : null
                            }
                          >
                            <td className="py-2 px-3 w-100">
                              <div className="d-flex align-items-center gap-3 min_width_300">
                                <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                                  <input
                                    value={item.id}
                                    onChange={handlecheckboxes}
                                    checked={selectAll.includes(item.id)}
                                    type="checkbox"
                                  />
                                  <span class="checkmark"></span>
                                </label>
                                <div className="d-flex align-items-center">
                                  <img
                                    className="manicon me-2"
                                    src={!image ? manimage : image}
                                    alt="manicon"
                                  />
                                  <div>
                                    <Link
                                      className="d-flex py-1 color_blue"
                                      to={`viewcustomerdetails/${id}`}
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

                            <td className="text-center mw-90">
                              <div class="dropdown">
                                <button
                                  class="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton3"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <abbr title="View">
                                    <img src={threedot} alt="dropdownDots" />
                                  </abbr>
                                </button>
                                <ul
                                  class="dropdown-menu categories_dropdown border-0"
                                  aria-labelledby="dropdownMenuButton3"
                                >
                                  <li>
                                    <Link to={`viewcustomerdetails/${id}`}>
                                      <div className="d-flex align-items-center categorie_dropdown_options">
                                        <img src={eye_icon} alt="" />
                                        <p className="fs-sm fw-400 black mb-0 ms-2">
                                          View Details
                                        </p>
                                      </div>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
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
    </div>
  );
};

export default Customers;

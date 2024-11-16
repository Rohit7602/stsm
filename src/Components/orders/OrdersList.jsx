import React, { useEffect, useRef, useState } from "react";
import filtericon from "../../Images/svgs/filtericon.svg";
import SearchIcon from "../../Images/svgs/search.svg";
import dropdownDots from "../../Images/svgs/dots2.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import { Link, NavLink } from "react-router-dom";
import { useOrdercontext } from "../../context/OrderGetter";
import { exec } from "apexcharts";
import viewBill from "../invoices/InvoiceBill";
import { ReactToPrint } from "react-to-print";
import billLogo from "../../Images/svgs/bill-logo.svg";
const OrderList = () => {
  const componentRef = useRef();
  // context
  const { orders, updateData } = useOrdercontext();
  const [searchvalue, setSearchvalue] = useState("");
  const [selectedBill, setSelectedBill] = useState("");
  const [searchdata, setSearchData] = useState(0);
  const [searchprice, setSearchPrice] = useState(0);
  const [datepop, setDatePop] = useState(false);
  const [orderStatus, setOrderStatus] = useState([]);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleBillNumberClick = (invoiceNumber) => {
    const bill = orders.filter(
      (order) => order.invoiceNumber === invoiceNumber
    );
    setSelectedBill([...bill]);
  };

  // format date logic start from here
  // console.log(orderStatus);
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate.replace("at", "|");
  }

  /*  *******************************
  checkbox functionality start 
*********************************************   **/
  const [selectAll, setSelectAll] = useState([]);

  // Main checkbox functionality start from here
  function handleSelectAll() {
    if (orders.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = orders.map((item) => {
        return item.id;
      });
      setSelectAll(allCheck);
    }
  }
  function handleSelect(e) {
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
  // const handleMainCheckboxChange = () => {
  //   const updatedData = orders.map((item) => ({
  //     ...item,
  //     checked: !selectAll,
  //   }));
  //   updateData(updatedData);
  //   setSelectAll(!selectAll);
  // };

  // Datacheckboxes functionality strat from here
  // const handleCheckboxChange = (index) => {
  //   const updatedData = [...orders];
  //   updatedData[index].checked = !orders[index].checked;
  //   updateData(updatedData);

  //   // Check if all checkboxes are checked
  //   const allChecked = updatedData.every((item) => item.checked);
  //   setSelectAll(allChecked);
  // };

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  /*  *******************************
      Sorting Functionality start from here 
    *********************************************   **/

  const [order, setorder] = useState("ASC");
  // const sorting = (col) => {
  //   // Create a copy of the data array
  //   const sortedData = [...orders];

  //   if (order === 'ASC') {
  //     sortedData.sort((a, b) => {
  //       const valueA = a[col].toLowerCase();
  //       const valueB = b[col].toLowerCase();
  //       return valueA.localeCompare(valueB);
  //     });
  //   } else {
  //     // If the order is not ASC, assume it's DESC
  //     sortedData.sort((a, b) => {
  //       const valueA = a[col].toLowerCase();
  //       console.log('asdf', valueA);
  //       const valueB = b[col].toLowerCase();
  //       return valueB.localeCompare(valueA);
  //     });
  //   }

  //   // Update the order state
  //   const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
  //   setorder(newOrder);

  //   // Update the data using the updateData function from your context
  //   updateData(sortedData);
  // };

  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...orders];

    if (order === "ASC") {
      sortedData.sort((a, b) => {
        const valueA =
          typeof getProperty(a, col) === "number"
            ? getProperty(a, col)
            : getProperty(a, col).toLowerCase();
        const valueB =
          typeof getProperty(b, col) === "number"
            ? getProperty(b, col)
            : getProperty(b, col).toLowerCase();
        return typeof valueA === "number"
          ? valueA - valueB
          : valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA =
          typeof getProperty(a, col) === "number"
            ? getProperty(a, col)
            : getProperty(a, col).toLowerCase();
        const valueB =
          typeof getProperty(b, col) === "number"
            ? getProperty(b, col)
            : getProperty(b, col).toLowerCase();
        return typeof valueA === "number"
          ? valueB - valueA
          : valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateData(sortedData);
  };

  const getProperty = (obj, path) => {
    const keys = path.split(".");
    let result = obj;
    for (let key of keys) {
      result = result[key];
    }
    return result;
  };

  /*  *******************************
      Sorting Functionality end from here  
    *********************************************   **/

  /*  *******************************
    Export  Excel File start from here  
  *********************************************   **/
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
        header: "OrderNumber",
        key: "OrderNumber",
        width: 15,
      },
      {
        header: "Invoice",
        key: "Invoice",
        width: 15,
      },
      {
        header: "Date",
        key: "Date",
        width: 25,
      },
      {
        header: "Customer",
        key: "Customer",
        width: 15,
      },
      {
        header: "PaymentStatus",
        key: "PaymentStatus",
        width: 15,
      },
      {
        header: "OrderStatus",
        key: "OrderStatus",
        width: 20,
      },
      {
        header: "Items",
        key: "items",
        width: 30,
      },
      {
        header: "Address",
        key: "Address",
        width: 70,
      },
      {
        header: "DeliverymanId",
        key: "DeliverymanId",
        width: 35,
      },
      {
        header: "phoneNo",
        key: "phoneNo",
        width: 15,
      },

      {
        header: "OrderPrice",
        key: "OrderPrice",
        width: 15,
      },
    ];

    orders.map((order) => {
      excelSheet.addRow({
        OrderNumber: order.order_id,
        Invoice:
          typeof order.invoiceNumber === "undefined"
            ? "N/A"
            : order.invoiceNumber,
        Date: formatDate(order.created_at),
        Customer: order.customer.name,
        PaymentStatus: order.transaction.status,
        OrderStatus: order.status,
        items: order.items.map((v) => `${v.title} - ${v.size}`).join(","),
        OrderPrice: order.order_price,
        Address: order.shipping.address,
        phoneNo: order.customer.phone,
        DeliverymanId: order.assign_to,
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "orderList.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /*  *******************************
  Export  Excel File end  here  
*********************************************   **/

  const data = [
    "All",
    "DELIVERED",
    "REJECTED",
    "NEW",
    "PROCESSING",
    "OUT_FOR_DELIVERY",
    "CANCELLED",
    "CONFIRMED",
  ];
  const handleClickstatus = () => {
    let newIndex = searchdata + 1;
    if (newIndex >= data.length) {
      newIndex = 0;
    }
    setSearchData(newIndex);
  };

  let sortingprice = ["all", "topprice", "lowprice"];
  const handleClickprice = () => {
    let newIndex = searchprice + 1;
    if (newIndex >= sortingprice.length) {
      newIndex = 0;
    }
    setSearchPrice(newIndex);
  };

  const handleOrderStatusChange = (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    setSelectedStatuses((prevStatuses) => {
      if (!prevStatuses.includes(newStatus) && newStatus !== "") {
        return [...prevStatuses, newStatus];
      }
      return prevStatuses;
    });
  };

  const handleDateRangeSelection = (range) => {
    setSelectedRange(range);
    const today = new Date();
    switch (range) {
      case "yesterday":
        setStartDate(
          new Date(today.setDate(today.getDate() - 1))
            .toISOString()
            .split("T")[0]
        );
        setEndDate(new Date().toISOString().split("T")[0]);
        setShowCustomDate(false);
        break;
      case "week":
        setStartDate(
          new Date(today.setDate(today.getDate() - 7))
            .toISOString()
            .split("T")[0]
        );
        setEndDate(new Date().toISOString().split("T")[0]);
        setShowCustomDate(false);
        break;
      case "month":
        setStartDate(
          new Date(today.setMonth(today.getMonth() - 1))
            .toISOString()
            .split("T")[0]
        );
        setEndDate(new Date().toISOString().split("T")[0]);
        setShowCustomDate(false);
        break;
      case "six_months":
        setStartDate(
          new Date(today.setMonth(today.getMonth() - 6))
            .toISOString()
            .split("T")[0]
        );
        setEndDate(new Date().toISOString().split("T")[0]);
        setShowCustomDate(false);
        break;
      case "custom":
        setStartDate("");
        setEndDate("");
        setShowCustomDate(true);
        break;
      default:
        setShowCustomDate(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchCriteria = {
      orderStatus,
      startDate: selectedRange === "custom" ? startDate : startDate,
      endDate: selectedRange === "custom" ? endDate : endDate,
    };
  };

  const handleRemoveStatus = (status) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.filter((item) => item !== status)
    );
  };


  
  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      {datepop ? <div className="bg_black_overlay"></div> : null}
      {datepop && (
        <div className="customer_pop position-fixed center_pop overflow-auto xl_h_500">
          <div className="text-end">
            <button
              className="border-0 bg-transparent px-1 fw-500 fs-4"
              onClick={() => setDatePop(false)}
            >
              ✗
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="border border-dark-subtle mt-4 w-100 px-2">
              <select
                value={orderStatus}
                onChange={handleOrderStatusChange}
                className="w-100 outline_none py-2 border-0"
              >
                <option value="">Order Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
                <option value="New">New</option>
                <option value="Processing">Processing</option>
                <option value="Out_for_delivery">Out for Delivery</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>
            <div className="mb-3 mt-2">
              <label className="text-black fs-xs" htmlFor="Spent">
                Select Order Date Range
              </label>
              <div className="d-flex flex-column mt-2">
                <button
                  type="button"
                  className={` ${
                    selectedRange === "yesterday"
                      ? " bg-secondary text-white"
                      : ""
                  } btn btn-outline-secondary mb-1`}
                  onClick={() => handleDateRangeSelection("yesterday")}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  className={` ${
                    selectedRange === "week" ? " bg-secondary text-white" : ""
                  } btn btn-outline-secondary mb-1`}
                  onClick={() => handleDateRangeSelection("week")}
                >
                  One Week
                </button>
                <button
                  type="button"
                  className={` ${
                    selectedRange === "month" ? "bg-secondary text-white" : ""
                  } btn btn-outline-secondary mb-1`}
                  onClick={() => handleDateRangeSelection("month")}
                >
                  One Month
                </button>
                <button
                  type="button"
                  className={` ${
                    selectedRange === "six_months"
                      ? "bg-secondary text-white"
                      : ""
                  } btn btn-outline-secondary mb-1`}
                  onClick={() => handleDateRangeSelection("six_months")}
                >
                  Six Months
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => handleDateRangeSelection("custom")}
                >
                  Custom
                </button>
              </div>
            </div>

            {showCustomDate && (
              <div className="p-3 border rounded bg-light mt-2">
                <div className="mb-2">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control"
                    placeholder="Start Date"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                    placeholder="End Date"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            )}

            <div className="text-end mt-4">
              <button
                onClick={() => (
                  setOrderStatus(""),
                  setStartDate(""),
                  setEndDate(""),
                  setSelectedRange(""),
                  setSelectedStatuses([])
                )}
                type="button"
                className="apply_btn fs-sm fw-normal btn_bg_green"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Orders</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <form
              className="form_box   mx-2 d-flex p-2 align-items-center"
              action=""
            >
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
            <button
              className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              onClick={() => setDatePop(true)}
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
        {/* product details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className=" d-flex gap-4">
            {selectedStatuses.map((value) => {
              return (
                <button
                  key={value}
                  type="button"
                  className="btn btn-secondary btn-sm me-2 mb-2"
                  onClick={() => handleRemoveStatus(value)}
                >
                  {value} <span>✗</span>
                </button>
              );
            })}
          </div>
          <div className="overflow-x-scroll line_scroll">
            <div style={{ minWidth: "1650px" }}>
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th
                      className="mw-200 p-3 cursor_pointer"
                      onClick={() => sorting("id")}
                    >
                      <div className="d-flex align-items-center">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={selectAll.length === orders.length}
                            onChange={handleSelectAll}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Order Number
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
                    <th className="mw-200 p-2">
                      <h3 className="fs-sm fw-400 black mb-0">Invoice</h3>
                    </th>
                    <th className="mw-200 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th
                      className="mw-200 p-3"
                      onClick={() => sorting("customer.name")}
                    >
                      <h3 className="fs-sm fw-400 black mb-0">Customer </h3>
                    </th>
                    <th
                      onClick={() => sorting("transaction.status")}
                      className="mw_160 p-3 cursor_pointer"
                    >
                      <span className="d-flex align-items-center">
                        <h3 className="fs-sm fw-400 black mb-0 white_space_nowrap text-capitalize">
                          Payment Status
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </h3>
                      </span>
                    </th>
                    <th
                      onClick={() => sorting("status")}
                      className="mw_160 p-3 cursor_pointer"
                    >
                      <h3 className="fs-sm fw-400 black mb-0">
                        Order Status
                        <span onClick={handleClickstatus}>
                          <img
                            className="ms-2 cursor_pointer"
                            width={20}
                            src={shortIcon}
                            alt="short-icon"
                          />
                        </span>
                      </h3>
                    </th>
                    <th className="mw_140 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                    </th>
                    <th
                      onClick={() => sorting("order_price")}
                      className="mw_160 p-3 cursor_pointer"
                    >
                      <h3 className="fs-sm fw-400 black mb-0">
                        Order Price
                        <span onClick={handleClickprice}>
                          <img
                            className="ms-2 cursor_pointer"
                            width={20}
                            src={shortIcon}
                            alt="short-icon"
                          />
                        </span>
                      </h3>
                    </th>
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {orders
                    .filter((item) => {
                      return (
                        searchvalue.toLowerCase() === "" ||
                        item.customer.name.toLowerCase().includes(searchvalue)
                      );
                    })

                    .filter((item) => {
                      if (selectedStatuses.length === 0) return true;
                      return selectedStatuses.some(
                        (status) =>
                          status.toLowerCase() === item.status.toLowerCase()
                      );
                    })

                    .filter((item) => {
                      if (!startDate && !endDate) return true;
                      const orderDate = new Date(item.created_at);
                      if (startDate && orderDate <= new Date(startDate))
                        return false;
                      if (endDate && orderDate >= new Date(endDate))
                        return false;
                      return true;
                    })

                    .filter((value) => {
                      if (data[searchdata] === "All") {
                        return true;
                      } else {
                        return (
                          value.status.toLowerCase() ===
                          data[searchdata].toLowerCase()
                        );
                      }
                    })

                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )

                    .sort((a, b) => {
                      if (sortingprice[searchprice] === "all") {
                        return 0;
                      } else if (sortingprice[searchprice] === "topprice") {
                        return b.order_price - a.order_price;
                      } else {
                        return a.order_price - b.order_price;
                      }
                    })

                    .map((orderTableData, index) => {
                      
                      return (
                        <tr>
                          <td className="p-3 mw-200">
                            <span className="d-flex align-items-center">
                              <label className="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  value={orderTableData.id}
                                  checked={selectAll.includes(
                                    orderTableData.id
                                  )}
                                  onChange={handleSelect}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <Link
                                className="fw-400 fs-sm color_blue ms-2"
                                to={`orderdetails/${orderTableData.order_id}`}
                              >
                                # {orderTableData.order_id}
                              </Link>
                            </span>
                          </td>
                          <td className="p-2 mw-200">
                            {orderTableData.invoiceNumber !== undefined && (
                              <button
                                onClick={() =>
                                  handleBillNumberClick(
                                    orderTableData.invoiceNumber
                                  )
                                }
                                className="border-0 bg-white"
                              >
                                <ReactToPrint
                                  trigger={() => {
                                    return (
                                      <h3 className="fs-xs fw-400 color_blue mb-0">
                                        #{orderTableData.invoiceNumber}
                                      </h3>
                                    );
                                  }}
                                  content={() => componentRef.current}
                                  documentTitle="Invoice"
                                  pageStyle="print"
                                />
                              </button>
                            )}
                            {orderTableData.invoiceNumber === undefined && (
                              <h3 className="fs-xs fw-400 color_blue mb-0">
                                #N/A
                              </h3>
                            )}
                          </td>
                          <td className="p-3 mw-200">
                            <h3 className="fs-xs fw-400 black mb-0">
                              {formatDate(orderTableData.created_at)}
                            </h3>
                          </td>
                          <td className="p-3 mw-200">
                            <Link
                              to={
                                orderTableData.order_created_by === "Van"
                                  ? ""
                                  : `/customer/viewcustomerdetails/${orderTableData.uid}`
                              }
                            >
                              <h3 className="fs-sm fw-400 color_blue mb-0">
                                {orderTableData.customer.name}
                              </h3>
                            </Link>
                          </td>
                          <td className="p-3 mw_160">
                            <h3
                              className={`fs-sm fw-400 mb-0 d-inline-block ${
                                orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "CANCELLED" &&
                                orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "REJECTED" &&
                                orderTableData.status
                                  .toString()
                                  .toUpperCase() !== "RETURNED"
                                  ? orderTableData.transaction.status
                                      .toString()
                                      .toLowerCase() === "paid"
                                    ? "black stock_bg"
                                    : orderTableData.transaction.status
                                        .toString()
                                        .toLowerCase() === "cod"
                                    ? "black cancel_gray"
                                    : orderTableData.transaction.status
                                        .toString()
                                        .toLowerCase() === "refund"
                                    ? "new_order red"
                                    : "color_brown on_credit_bg"
                                  : ""
                              }`}
                            >
                              {orderTableData.status
                                .toString()
                                .toUpperCase() !== "CANCELLED" &&
                              orderTableData.status.toString().toUpperCase() !==
                                "REJECTED" &&
                              orderTableData.status.toString().toUpperCase() !==
                                "RETURNED"
                                ? orderTableData.transaction.status
                                : null}
                            </h3>
                          </td>
                          <td className="p-3 mw_190">
                            <p
                              className={`d-inline-block ${
                                orderTableData.status
                                  .toString()
                                  .toLowerCase() === "new"
                                  ? "fs-sm fw-400 red mb-0 new_order"
                                  : orderTableData.status
                                      .toString()
                                      .toLowerCase() === "processing"
                                  ? "fs-sm fw-400 mb-0 processing_skyblue"
                                  : orderTableData.status
                                      .toString()
                                      .toLowerCase() === "delivered"
                                  ? "fs-sm fw-400 mb-0 green stock_bg"
                                  : "fs-sm fw-400 mb-0 black cancel_gray"
                              }`}
                            >
                              {orderTableData.status}
                            </p>
                          </td>
                          <td className="p-3 mw_140">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {orderTableData.items.length} items
                            </h3>
                          </td>
                          <td className="p-3 mw_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              ₹ {orderTableData.order_price}
                            </h3>
                          </td>
                          <td className="text-center mx_100">
                            <div className="dropdown">
                              <button
                                className="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton3"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <abbr title="View">
                                  <img src={dropdownDots} alt="dropdownDots" />
                                </abbr>
                              </button>
                              <ul
                                className="dropdown-menu categories_dropdown"
                                aria-labelledby="dropdownMenuButton3"
                              >
                                <li>
                                  <div className="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={eye_icon} alt="" />
                                      <Link
                                        to={`orderdetails/${orderTableData.order_id}`}
                                      >
                                        <p className="fs-sm fw-400 black mb-0 ms-2">
                                          View Details
                                        </p>
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
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

      <div>
        <div>
          {selectedBill.length > 0
            ? selectedBill.map((items) => {
                const subtotal = items.items.reduce(
                  (acc, data) => acc + data.quantity * data.final_price,
                  0
                );
                const savedDiscount = items.items.reduce(
                  (acc, data) => acc + data.quantity * data.varient_discount,
                  0
                );
                return (
                  <div className="bill m-auto" ref={componentRef}>
                    <div className="d-flex align-items-start justify-content-between">
                      <img src={billLogo} alt="billLogo" />
                      <div className="text-end">
                        <h1 className="fs_24 fw-700 black mb-0">INVOICE</h1>
                        <p className="fs-xxs fw_700 black mb-0">
                          #{items.invoiceNumber}
                        </p>
                        <p className="fs-xs fw_400 green mb-0">
                          {items.transaction.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div className="w-50">
                          <p className="fs-xs fw-700 black mb-0">
                            Save Time Save Money
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-1">
                            Near TVS Agency, Hansi Road, Barwala,
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-1">
                            Hisar, Haryana - 125121
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-1">
                            GSTIN : 06GWMPS2545Q1ZJ
                          </p>
                        </div>
                        <div className="text-end w-50">
                          <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                          <p className="fs-xxs fw-700 black mb-0">
                            {items.customer.name}
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-1">
                            {items.shipping.address}
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-1">
                            {items.shipping.city} {items.shipping.state}{" "}
                          </p>
                          <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                            Invoice Date : {formatDate(items.created_at)}
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
                              Unit Cost
                            </th>
                            <th className="fs-xxs fw-400 white p_10 text-center">
                              Tax
                            </th>
                            <th className="fs-xxs fw-400 white p_10 text-end">
                              Line Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.items.map((data) => {
                            return (
                              <tr>
                                <td className="fs-xxs fw-400 black p_5_10">
                                  1
                                </td>
                                <td className="p_5_10">
                                  <span>
                                    <p className="fs-xxs fw-400 black mb-0">
                                      {data.title}
                                    </p>
                                    <span className="d-flex align-items-center gap-2">
                                      <p className=" fs-xxxs fw-700 black mb-0">
                                        ₹ {data.varient_discount} OFF
                                      </p>
                                      <p
                                        className={`fs-xxxs fw-400 black mb-0  ${
                                          data.varient_discount !== "0"
                                            ? "strikethrough"
                                            : null
                                        }`}
                                      >
                                        MRP : {data.varient_price}
                                      </p>
                                    </span>
                                    <span className="d-flex align-items-center gap-3">
                                      <p className=" fs-xxxs fw-400 black mb-0">
                                        {data.varient_name} {data.unitType}
                                      </p>
                                      <p className="fs-xxxs fw-400 black mb-0">
                                        {data.color}
                                      </p>
                                    </span>
                                  </span>
                                </td>
                                <td className="fs-xxs fw-400 black p_5_10 text-center">
                                  {data.quantity}
                                </td>
                                <td className="fs-xxs fw-400 black p_5_10 text-end">
                                  {data.final_price}
                                </td>
                                <td className="fs-xxs fw-400 black p_5_10 text-center">
                                  {typeof data.Tax === "undefined"
                                    ? "0"
                                    : data.Tax}
                                  %
                                </td>
                                <td className="fs-xxs fw-400 black p_5_10 text-end">
                                  ₹
                                  {data.quantity * data.final_price +
                                    (typeof data.text === "undefined"
                                      ? 0
                                      : data.quantity *
                                        data.final_price *
                                        (data.Tax / 100))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="w-75 text-end">
                          <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
                          <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                            Promo Discount
                          </p>
                          <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                            Total Amount
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fs_xxs fw-400 black mb-0">
                            ₹{subtotal}
                          </p>
                          <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                            (-) ₹ {items.additional_discount.discount}
                          </p>
                          <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                            {/* {((data.quantity * data.final_price) * (data.Tax / 100))} */}
                            {items.order_price}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="mt-3 bill_border d-inline-block"></span>
                    <p className=" fs-xxxs fw-400 black mb-0 mt-1">
                      Note : You Saved{" "}
                      <span className="fw-700"> ₹{savedDiscount} </span> on
                      product discount.
                    </p>
                    {items.transaction.status === "Paid" ? (
                      <div>
                        <p className="fs_xxs fw-400 black mb-0 mt-3">
                          Transactions:
                        </p>
                        <table className="mt-3 w-100">
                          <thead>
                            <tr>
                              <th className="fs-xxs fw-400 black py_2">
                                Transaction ID
                              </th>
                              <th className="fs-xxs fw-400 black py_2">
                                Payment Mode
                              </th>
                              <th className="fs-xxs fw-400 black py_2">Date</th>
                              <th className="fs-xxs fw-400 black py_2">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bill_border">
                              <td className="fs-xxs fw-400 black py-1">
                                {items.transaction.tx_id === ""
                                  ? "N/A"
                                  : items.transaction.tx_id}
                              </td>
                              <td className="fs-xxs fw-400 black py-1">
                                {items.transaction.mode}
                              </td>
                              <td className="fs-xxs fw-400 black py-1">
                                {formatDate(items.transaction.date)}
                              </td>
                              <td className="fs-xxs fw-400 black py-1">
                                ₹{items.order_price}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default OrderList;

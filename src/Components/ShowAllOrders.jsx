import React, { useEffect, useState } from 'react';
import { CrossIcons } from '../Common/Icon';
import { useOrdercontext } from '../context/OrderGetter';
import { Link } from 'react-router-dom';
import ExcelJS from 'exceljs';  // Import ExcelJS
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import Loader from './Loader';

const ShowAllOrders = ({ setShowAllOrder, formatDate }) => {
    const [loading, setLoading] = useState(true);

    const [allOrders, setAllOrders] = useState([])

      useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // Loading start
          const querySnapshot = await getDocs(collection(db, "order"));
          const allOrder = [];
          querySnapshot.forEach((doc) => {
            allOrder.push({ id: doc.id, ...doc.data() });
          });
          setAllOrders(allOrder);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false); // Loading end
        }
      };

      fetchData();
    }, [setLoading]); 





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
    // Ensure allOrders is an array
    const exportOrdersExcelFile = () => {
        if (!Array.isArray(allOrders)) {
            console.error("allOrders is not an array");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const excelSheet = workbook.addWorksheet("Order List");
        excelSheet.properties.defaultRowHeight = 20;

        // Define headers for order data
        excelSheet.columns = [
            { header: "Order Number", key: "OrderNumber", width: 20 },
            { header: "Invoice", key: "Invoice", width: 20 },
            { header: "Customer Name", key: "CustomerName", width: 30 },
            { header: "Father Name", key: "FatherName", width: 30 },
            { header: "Phone", key: "phone", width: 30 },
            { header: "Date", key: "OrderDate", width: 30 },
            { header: "Payment Status", key: "PaymentStatus", width: 15 },
            { header: "Order Status", key: "OrderStatus", width: 15 },
            { header: "Delivered Date", key: "DeliveredDate", width: 30 },
            { header: "Total Items", key: "TotalItems", width: 10 },
            { header: "Order Price", key: "OrderPrice", width: 10 },
            { header: "address", key: "address", width: 30, style: { alignment: { wrapText: true, vertical: 'top' } } },
        ];

        // Populate the rows with order data
        allOrders.forEach((order) => {
            const formattedDate = formatDate(order.created_at);
            const deliveredDate = order.transaction.date
                ? formatDate(order.transaction.date)
                : "N/A";

            excelSheet.addRow({
                OrderNumber: order.order_id,
                OrderDate: formattedDate,
                Invoice: order.order_created_by === "Van" ? "" : order.invoiceNumber,
                CustomerName: order.customer.name,
                FatherName: order.fathername,
                phone: order.customer.phone,
                PaymentStatus: order.transaction.status,
                OrderStatus: order.status,
                DeliveredDate: deliveredDate,
                TotalItems: order.items.length,
                address: order.shipping.address,
                OrderPrice: `₹ ${order.order_price}`,
            });
        });

        // Download the file
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "allOrders.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };
    // console.log(allOrders,"orders")

    if (loading) {
        return <Loader />;
    }
    return (
        <div>
            <div className="bg-white p-4 rounded-4 w-100 position-fixed center_pop h-100">
                <div className="d-flex align-items-center justify-content-between">
                    <h2 className="text-black fw-700 fs-2sm mb-0">
                        All Orders
                    </h2>
                    <div className="d-flex gap-3">
                        <button
                            onClick={exportOrdersExcelFile}
                            className="export_btn white fs-xxs px-3 py-2 fw-400 border-0"
                        >
                            Export
                        </button>
                        <Link to="/"
                            className="border-0 bg-white"
                        // onClick={() => setShowAllOrder(false)}
                        >
                            <CrossIcons />
                        </Link>
                    </div>
                </div>
                <div className="overflow-auto">
                    {allOrders.length === 0 ? (
                        <p className="text-center my-3">There are no orders 😢</p>
                    ) : (
                        <div style={{ minWidth: "1750px" }}>
                            <table className="w-100">
                                <thead className="table_head w-100">
                                    <tr className="product_borderbottom">
                                        <th className="mw-200 p-3 cursor_pointer">
                                            <div className="d-flex align-items-center">
                                                <p className="fw-400 fs-sm black mb-0 ms-2">
                                                    Order Number
                                                </p>
                                            </div>
                                        </th>
                                        <th className="mw-200 p-2">
                                            <h3 className="fs-sm fw-400 black mb-0">Invoice</h3>
                                        </th>

                                        <th className="mw-200 p-2">
                                            <h3 className="fs-sm fw-400 black mb-0">Customer</h3>
                                        </th>

                                        <th className="mw-200 p-3">
                                            <h3 className="fs-sm fw-400 black mb-0">Father Name</h3>
                                        </th>
                                        <th className="mw-200 p-2">
                                            <h3 className="fs-sm fw-400 black mb-0">phone</h3>
                                        </th>
                                        <th className="mw-200 p-3">
                                            <h3 className="fs-sm fw-400 black mb-0 d-flex">
                                                Date
                                            </h3>
                                        </th>
                                        <th className="mw-200 p-3 cursor_pointer">
                                            <span className="d-flex align-items-center">
                                                <h3 className="fs-sm fw-400 black mb-0 white_space_nowrap text-capitalize">
                                                    Payment Status
                                                </h3>
                                            </span>
                                        </th>
                                        <th className="mw_190 p-3 cursor_pointer">
                                            <h3 className="fs-sm fw-400 black mb-0">
                                                Order Status
                                            </h3>
                                        </th>
                                        <th className="py-3 ps-5 mw-300">
                                            <h3 className="fs-sm fw-400 black mb-0 d-flex">
                                                Delivered Date
                                            </h3>
                                        </th>
                                        <th className="mw_140 p-3">
                                            <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                                        </th>
                                        <th className="mw_160 p-3 cursor_pointer">
                                            <h3 className="fs-sm fw-400 black mb-0">
                                                Order Price
                                            </h3>
                                        </th>
                                        <th className="mx_160 p-3 pe-4 text-center">
                                            <h3 className="fs-sm fw-400 black mb-0">Address</h3>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table_body w-100">
                                    {allOrders.map((orderTableData, index) => {
                                        console.log(orderTableData)
                                        return (
                                            <tr key={orderTableData.id}>
                                                <td className="p-3 mw-200">
                                                    <h3 className="fs-xs fw-400 black mb-0">
                                                        {orderTableData.order_id}
                                                    </h3>
                                                </td>
                                                <td className="p-3 mw-200">
                                                    <h3 className="fs-xs fw-400 black mb-0">
                                                        {orderTableData.invoiceNumber}
                                                    </h3>
                                                </td> <td className="p-3 mw-200">
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
                                              
                                               
                                                <td className="p-3 mw-200">
                                                    <h3 className="fs-xs fw-400 black mb-0">
                                                        {orderTableData.fathername}
                                                    </h3>
                                                </td>  <td className="p-3 mw-200">
                                                    <h3 className="fs-xs fw-400 black mb-0">
                                                        {orderTableData.customer.phone}
                                                    </h3>
                                                </td>
                                                <td className="p-3 mw-200">
                                                    <h3 className="fs-xs fw-400 black mb-0">
                                                        {formatDate(orderTableData.created_at)}
                                                    </h3>
                                                </td>
                                                <td className="p-3 mw-200">
                                                    <h3 className={`fs-sm fw-400 mb-0 d-inline-block`}>
                                                        {orderTableData.transaction.status}
                                                    </h3>
                                                </td>
                                                <td className="p-3 mw_190">
                                                    <p className="d-inline-block fs-sm fw-400 mb-0">
                                                        {orderTableData.status}
                                                    </p>
                                                </td>
                                                <td className="py-3 ps-5 mw-300">
                                                    <h3 className="fs-sm fw-400 black mb-0">
                                                        {formatDate(orderTableData.transaction.date)}
                                                    </h3>
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
                                                <td className="p-3 mw_160">
                                                    <h3 className="fs-sm fw-400 black mb-0">
                                                        {orderTableData.shipping.address}
                                                    </h3>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowAllOrders;

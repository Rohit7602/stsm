
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CrossIcons } from '../Common/Icon';
import ExcelJS from 'exceljs';  // Import ExcelJS
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Loader from './Loader';

const AllCustomerPopup = ({ setShowAllCustomers }) => {
    const [loading, setLoading] = useState(true);

    const [allOrders, setAllOrders] = useState([])
    const [customer, setCustomer] = useState([])

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
        const fetchAllCustomer = async () => {
            try {
                setLoading(true); // Loading start
                const querySnapshot = await getDocs(collection(db, "customers"));
                const allCustomer = [];
                querySnapshot.forEach((doc) => {
                    allCustomer.push({ id: doc.id, ...doc.data() });
                });
                setCustomer(allCustomer);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false); // Loading end
            }
        };

        fetchData();
        fetchAllCustomer()
    }, [setLoading]);

    const totalSpentByCustomer = customer.map((customer) => {
        const totalSpent = allOrders
            .filter((order) => order.uid === customer.id)
            .filter((value) => value.status.toUpperCase() === "DELIVERED")
            .reduce((total, order) => total + order.order_price, 0);
        return { ...customer, totalSpent };
    });

    // Function to export customer data to Excel
    const exportExcelFile = () => {
        const workbook = new ExcelJS.Workbook();
        const excelSheet = workbook.addWorksheet("Customer List");
        excelSheet.properties.defaultRowHeight = 20;

        // Define headers for customer data
        excelSheet.columns = [
            { header: "Name", key: "Name", width: 30 },
            { header: "Email", key: "Email", width: 30 },
            { header: "Gender", key: "Gender", width: 10 },
            { header: "FatherName", key: "FatherName", width: 20 },
            { header: "Mobile", key: "Mobile", width: 15 },
            { header: "Total Spent", key: "TotalSpent", width: 15 },
            { header: "Registration Date", key: "RegistrationDate", width: 20 },
            { header: "House No", key: "HouseNo", width: 20 },
            { header: "Colony", key: "Colony", width: 25, style: { alignment: { wrapText: true, vertical: 'top' } }   },
            { header: "Landmark", key: "Landmark", width: 20 ,style: { alignment: { wrapText: true, vertical: 'top' } }  },
            { header: "City", key: "City", width: 15 ,style: { alignment: { wrapText: true, vertical: 'top' } }  },
            { header: "State", key: "State", width: 15,style: { alignment: { wrapText: true, vertical: 'top' } }   },
            { header: "Pin Code", key: "ZIP", width: 10 },
        ];

        // Populate the rows with customer data
        totalSpentByCustomer.forEach((customer) => {
            const formattedDate = new Date(customer.created_at).toLocaleDateString();
            const address = (customer.addresses && customer.addresses[0]) || {};
            excelSheet.addRow({
                Name: customer.name,
                Email: customer.email,
                Gender: customer.gender,
                FatherName: customer.fathername,
                Mobile: customer.phone,
                TotalSpent: `₹ ${customer.totalSpent}`,
                RegistrationDate: formattedDate,
                HouseNo: address.house_no || "",
                Colony: address.colony || "",
                Landmark: address.landmark || "",
                City: address.city || "",
                State: address.state || "",
                ZIP: address.pincode || "",
            });
        });

        // Download the file
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
    };
    console.log(customer, "customer")

    if (loading) {
        return <Loader />;
    }
    return (
        <div>
            <div className="bg-white p-4 rounded-4 w-100 position-fixed center_pop h-100">
                <div className="d-flex align-items-center justify-content-between">
                    <h2 className="text-black fw-700 fs-2sm mb-0">All Customers</h2>
                    <div className="d-flex gap-3">
                        <button
                            className="export_btn white fs-xxs px-3 py-2 fw-400 border-0"
                            onClick={exportExcelFile}  // Trigger export when clicked
                        >
                            Export
                        </button>
                        <Link to={"/"}
                            className="border-0 bg-white"
                        // onClick={() => setShowAllCustomers(false)}
                        >
                            <CrossIcons />
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-scroll">
                    <div className="Customers_overflow_X">
                        <table className="w-100">
                            <thead className="table_head w-100">
                                <tr className="product_borderbottom">
                                    <th className="mw-300 py-2 px-3 cursor_pointer">
                                        <div className="d-flex align-items-center gap-3 min_width_300">
                                            <p className="fw-400 fs-sm black mb-0">Name</p>
                                        </div>
                                    </th>
                                    <th className="mw_160 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Registration</h3>
                                    </th>
                                    <th className="mw-300 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Address</h3>
                                    </th>
                                    <th className="mw-160 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Gender</h3>
                                    </th>
                                    <th className="mw-160 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Father Name</h3>
                                    </th>
                                    <th className="mw-160 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Phone</h3>
                                    </th>

                                    <th className="mw-200 p-3">
                                        <h3 className="fs-sm fw-400 black mb-0">Total Spent</h3>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table_body">
                                {totalSpentByCustomer.map((item, index) => {
                                    const { id, phone, email, fathername, name, totalSpent, created_at, gender, addresses } = item;
                                    const formattedDate = new Date(created_at).toLocaleDateString();
                                    console.log(item, "item")
                                    return (
                                        <tr key={id}>
                                            <td className="py-2 px-3  mw-300">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <Link className="d-flex py-1 color_blue">
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
                                                    {formattedDate}
                                                </h3>
                                            </td>
                                            <td className="p-3 mw-300">
                                                <h3 className="fs-sm fw-400 black mb-0">
                                                    {addresses.map((items) => {
                                                        return (
                                                            <div>
                                                                {items.house_no} &nbsp;
                                                                {items.colony}&nbsp;
                                                                {items.landmark}&nbsp;
                                                                {items.city}&nbsp;
                                                                {items.state}&nbsp;

                                                            </div>
                                                        )
                                                    })}

                                                </h3>
                                            </td>
                                            <td className="p-3 mw-160">
                                                <h3 className="fs-sm fw-400 black mb-0">
                                                    {gender}
                                                </h3>
                                            </td>
                                            <td className="p-3 mw-160">
                                                <h3 className="fs-sm fw-400 black mb-0">
                                                    {fathername}
                                                </h3>
                                            </td>
                                            <td className="p-3 mw-160">
                                                <h3 className="fs-sm fw-400 black mb-0">
                                                    {phone}
                                                </h3>
                                            </td>

                                            <td className="p-3 mw-200">
                                                <h3 className="fs-sm fw-400 black mb-0">₹ {totalSpent}</h3>
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
    );
};

export default AllCustomerPopup;

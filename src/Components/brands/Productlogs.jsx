import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import shortIcon from "../../Images/svgs/short-icon.svg";
function Productlogs() {
  const [productslogdata, setProductsLogData] = useState([]);
  const fetchProductsLogs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Productslogs"));
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsLogData(productsList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductsLogs();
  }, []);

  return (
    <>
      <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
        <div className="d-flex my-4">
          <h1 className="fw-500  mb-0 black fs-lg">Products Logs</h1>
        </div>
        <div
          className="p-3 mt-3 bg-white product_shadow mt-4 overflow-scroll"
          style={{ height: "78vh" }}
        >
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1850">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="p-3 cursor_pointer mx_180">
                      <div className="d-flex align-items-center">
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Product Date
                        </p>
                      </div>
                    </th>
                    <th className="p-3 cursor_pointer ">
                      <div className="d-flex align-items-center ms-4">
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Product{" "}
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
                      <h3 className="fs-sm fw-400 black mb-0">Category</h3>
                    </th>
                    <th className="mx_180 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Unit Purchase Price
                      </h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Unit Sale Price
                      </h3>
                    </th>
                    <th className="mx_180 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Stock</h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Total Value</h3>
                    </th>
                    <th className=" mx_170 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Stock Updated On
                      </h3>
                    </th>
                    <th className="mw_130 p-3 cursor_pointer">
                      <p className="fw-400 fs-sm black mb-0 ms-2">
                        Status
                        <span>
                          <img
                            className="ms-2 cursor_pointer"
                            width={20}
                            src={shortIcon}
                            alt="short-icon"
                          />
                        </span>
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productslogdata.map((productdata, index, array) => {
                    return (
                      <div>
                        {productdata.logs
                          .sort((a, b) => new Date(a) - new Date(b))
                          .map((value, index) => {
                            return (
                              <tr key={index}>
                                <td className="p-3 d-flex align-items-center">
                                  <td className="p-3 mx_180 me-3">
                                    <h3 className="fs-sm fw-400 black mb-0 text-nowrap">
                                      {`${value.producttime.date
                                        .split("-")
                                        .reverse()
                                        .join("-")} , ${
                                        value.producttime.time
                                      }`}
                                    </h3>
                                  </td>
                                  <div className="d-flex align-items-center ms-2">
                                    <div className="w_40">
                                      <img src={value.productImages} alt="" />
                                    </div>
                                    <div className="ps-3 ms-1">
                                      <p className="fw-400 fs-sm black mb-0">
                                        {value.name}
                                      </p>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 fs-xxs fw-400 fade_grey d-flex flex-column">
                                          <span className="pe-1">
                                            {" "}
                                            ID : {value.id}{" "}
                                          </span>
                                          <span>SKU : {value.sku}</span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 mw_160">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    {value.categories.name}
                                  </h3>
                                </td>
                                <td className="p-3 mx_180">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    ₹ {value.perUnitPrice}
                                  </h3>
                                </td>
                                <td className="p-3 mw_160">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    ₹{" "}
                                    {/* {value.varients.map((item) => {
                              const data =
                                item.discountType === "Amount"
                                  ? item.unitPrice - item.discountvalue
                                  : item.unitPrice -
                                    (item.unitPrice * item.discountvalue) / 100;

                              const truncatedNumber = parseFloat(
                                data.toFixed(3)
                              );

                              return truncatedNumber;
                            })} */}
                                    {value.salesprice}
                                  </h3>
                                </td>
                                <td className="p-3 mx_180">
                                  <h3
                                    className={`fs-sm fw-400 black mb-0  white_space_nowrap  ${
                                      parseInt(value.totalStock) === 0
                                        ? "stock_bg_red text-white"
                                        : parseInt(value.totalStock) <=
                                          parseInt(value.stockAlert)
                                        ? "stock_bg_orange"
                                        : "px-2 stock_bg"
                                    } `}
                                  >
                                    {parseInt(value.totalStock) === 0
                                      ? `Out of Stock`
                                      : parseInt(value.totalStock) >=
                                        parseInt(value.stockAlert)
                                      ? `${value.totalStock} ${
                                          value.stockUnitType
                                        }  ${" "} in Stock`
                                      : `${value.totalStock}  ${
                                          value.stockUnitType
                                        } ${" "}  Left`}
                                  </h3>
                                </td>

                                <td className="p-3 mw_160">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    ₹{" "}
                                    {/* {value.varients.map(
                              (item) =>
                                (item.discountType === "Amount"
                                  ? item.unitPrice - item.discountvalue
                                  : item.unitPrice -
                                    (item.unitPrice * item.discountvalue) /
                                      100) * value.totalStock
                            )} */}
                                    {Math.round(
                                      value.salesprice * value.totalStock
                                    )}
                                  </h3>
                                </td>
                                <td className="p-3 mx_170">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    {new Date(
                                      value.updated_at
                                    ).toLocaleDateString("en-GB")}
                                  </h3>
                                </td>
                                <td className="p-3 mw_130">
                                  <h3
                                    className={`fs-sm fw-400 black mb-0 ms-2 ${
                                      value.status === "hidden"
                                        ? "text-danger"
                                        : null
                                    } `}
                                  >
                                    {value.status}
                                  </h3>
                                </td>
                              </tr>
                            );
                          })}
                      </div>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Productlogs;

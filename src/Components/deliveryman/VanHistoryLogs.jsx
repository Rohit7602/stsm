import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import profile_image from "../../Images/Png/customer_profile.png";
import { CrossIcons } from "../../Common/Icon";
function VanHistoryLogs() {
  const location = useLocation();
  const [viewlogspop, setViewLogsPop] = useState(null);
  const updatedFilterHistory = location.state.filterhistory.map((entry) => ({
    ...entry,
    pendingitems: entry.loaditems.filter(
      (loadItem) =>
        !entry.unloaditems.some(
          (unloadItem) => unloadItem.productid === loadItem.id
        )
    ),
  }));
console.log(updatedFilterHistory);

  return (
    <div className="main_panel_wrapper bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between ">
          <div>
            {location.state.deliverydata.length > 0 &&
              location.state.deliverydata.map((data) => {
                return (
                  <div className="d-flex align-items-center mw-300 p-2">
                    <div>
                      <img
                        src={profile_image}
                        alt="mobileicon"
                        className="items_images"
                      />
                    </div>
                    <div className="ps-3">
                      <p className="fs-sm fw-400 black mb-0">
                        {data.basic_info.name}
                      </p>
                      <p className="fs-xxs fw-400 fade_grey mb-0">
                        {data.basic_info.email}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <button
              onClick={() => window.history.back()}
              className={`outline_none border-0 update_entry d-flex gap-2 text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span> Go Back</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4>Van History</h4>
        <div className="p-3 mt-3 bg-white product_shadow mt-3">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X ">
              <table className="w-100 ">
                <thead className="w-100 table_head">
                  <tr className="product_borderbottom">
                    <th className="py-3 col-2">
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th className=" col-3">
                      <h3 className="fs-sm fw-400 black mb-0 ms-0">
                        Load Items
                      </h3>
                    </th>
                    <th className=" col-3">
                      <p className="fw-400 fs-sm black mb-0 ms-0">
                        Unload Items
                      </p>
                    </th>
                    <th className=" col-3">
                      <p className="fw-400 fs-sm black mb-0 ms-0">
                        Pending Items
                      </p>
                    </th>
                    <th className=" col-2">
                      <p className="fw-400 fs-sm black mb-0 ms-0">
                        Total Amount
                      </p>
                    </th>
                    <th className=" col-1 text-center">
                      <p className="fw-400 fs-sm black mb-0 ms-0">Actions</p>
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{ maxHeight: "calc(100vh - 360px)" }}
                  className="table_body"
                >
                  {updatedFilterHistory
                    .sort((a, b) => {
                      const dateA = new Date(a.formattedDate);
                      const dateB = new Date(b.formattedDate);
                      return dateB - dateA;
                    })
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <tr className="product_borderbottom">
                              <td className=" py-3 col-2">
                                <h3 className="fs-sm fw-400 black mb-0 ">
                                  {item.formattedDate
                                    .split("-")
                                    .reverse()
                                    .join("-")}
                                </h3>
                              </td>
                              <td className=" col-3">
                                <h3 className="fs-sm fw-400 black mb-0 ">
                                  {item.loaditems.length}
                                </h3>
                              </td>

                              <td className=" col-3">
                                <h3 className="fs-sm fw-400 black mb-0 ">
                                  {item.unloaditems.length}
                                </h3>
                              </td>
                              <td className=" col-3">
                                <h3 className="fs-sm fw-400 black mb-0 ">
                                  {item.pendingitems.length}
                                </h3>
                              </td>
                              <td className=" col-2">
                                <h3 className="fs-sm fw-400 black mb-0 ">
                                  {item.totalamount
                                    ? item.totalamount
                                    : "No amount collect"}
                                </h3>
                              </td>
                              <td className=" col-1 text-center">
                                <button
                                  onClick={() =>
                                    setViewLogsPop((prev) =>
                                      prev === index ? null : index
                                    )
                                  }
                                  className="border-0 bg-transparent text-primary"
                                >
                                  {viewlogspop === index
                                    ? "hide all"
                                    : "view all"}
                                </button>
                              </td>
                            </tr>
                          </div>
                          {viewlogspop === index && (
                            <div
                              style={{ height: "200px" }}
                              className="bg-white border d-flex position-relative mx-auto my-4 justify-content-center overflow-y-auto rounded-2"
                            >
                              <table className="table table-bordered mb-0">
                                <thead>
                                  <tr>
                                    <th className="col-4 px-3">
                                      <div className="d-flex justify-content-between">
                                        <span className=" fw-500">
                                          Loaded Items
                                        </span>
                                        <span className=" fw-500">
                                          Quantity
                                        </span>
                                      </div>
                                    </th>
                                    <th className="col-4 px-3">
                                      <div className="d-flex justify-content-between">
                                        <span className=" fw-500">
                                          {" "}
                                          Unloaded Items
                                        </span>
                                        <span className=" fw-500">
                                          Quantity
                                        </span>
                                      </div>
                                    </th>
                                    <th className="col-4 px-3">
                                      <div className="d-flex justify-content-between">
                                        <span className=" fw-500">
                                          Pending Items
                                        </span>
                                        <span className=" fw-500">
                                          Quantity
                                        </span>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Render rows dynamically */}
                                  {Array.from({
                                    length: Math.max(
                                      item.loaditems.length,
                                      item.unloaditems.length,
                                      item.pendingitems.length
                                    ),
                                  }).map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                      <td className="px-3">
                                        {item.loaditems[rowIndex] ? (
                                          <div className="d-flex justify-content-between">
                                            <span>
                                              {item.loaditems[rowIndex].name}
                                            </span>
                                            <span className=" text-nowrap">
                                              {item.loaditems[
                                                rowIndex
                                              ].updatedQuantity.toFixed(3)}{" "}
                                              {
                                                item.loaditems[rowIndex]
                                                  .stockUnitType
                                              }
                                            </span>
                                          </div>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                      <td className="px-3">
                                        {item.unloaditems[rowIndex] ? (
                                          <div className="d-flex justify-content-between">
                                            <span>
                                              {item.unloaditems[rowIndex].name}
                                            </span>
                                            <span className=" text-nowrap">
                                              {item.unloaditems[
                                                rowIndex
                                              ].quantity.toFixed(3)}{" "}
                                              {
                                                item.unloaditems[rowIndex]
                                                  .stockUnitType
                                              }
                                            </span>
                                          </div>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                      <td className="px-3">
                                        {item.pendingitems[rowIndex] ? (
                                          <div className="d-flex justify-content-between">
                                            <span>
                                              {item.pendingitems[rowIndex].name}
                                            </span>
                                            <span className=" text-nowrap">
                                              {item.pendingitems[
                                                rowIndex
                                              ].updatedQuantity.toFixed(3)}{" "}
                                              {
                                                item.pendingitems[rowIndex]
                                                  .stockUnitType
                                              }
                                            </span>
                                          </div>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
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

export default VanHistoryLogs;

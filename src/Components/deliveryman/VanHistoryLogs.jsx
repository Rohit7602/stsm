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

  console.log(viewlogspop);

  return (
    <div className="main_panel_wrapper bg_light_grey w-100">
      {viewlogspop !== null && <div className="bg_black_overlay"></div>}
      {viewlogspop !== null && (
        <div className="bg-white p-4 rounded-4 w_500 position-fixed center_pop overflow-auto xl_h_500">
          <div className=" text-end mb-3" onClick={()=> setViewLogsPop(null)}>
            <button className=" border-0 bg-transparent">
              <CrossIcons />
            </button>
          </div>
          <div className="product_borderbottom d-flex justify-content-between pb-3">
            <p className="fs-sm fw-400 black mb-0 ms-0">Load Items</p>
            <p className="fw-400 fs-sm black mb-0 ms-0">Unload Items</p>
            <p className="fw-400 fs-sm black mb-0 ms-0">Pending Items</p>
          </div>
          <div className=" d-flex justify-content-between py-3 gap-3">
            <div className=" d-flex flex-column gap-3">
              {viewlogspop.loaditems.map((value, index) => {
                return (
                  <h3
                    className="fs-sm fw-400 black mb-0 pb-2 product_borderbottom"
                    key={index}
                  >
                    {value.name}
                  </h3>
                );
              })}
            </div>
            <div className=" d-flex flex-column gap-3">
              {viewlogspop.unloaditems.map((value, index) => {
                return (
                  <h3
                    className="fs-sm fw-400 black mb-0 pb-2 product_borderbottom"
                    key={index}
                  >
                    {value.name}
                  </h3>
                );
              })}
            </div>
            <div className=" d-flex flex-column gap-3">
              {viewlogspop.pendingitems.map((value, index) => {
                return (
                  <h3
                    className="fs-sm fw-400 black mb-0 pb-2 product_borderbottom"
                    key={index}
                  >
                    {value.name}
                  </h3>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between ">
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
      </div>

      <div>
        <h4>Van History</h4>
        <div className="p-3 mt-3 bg-white product_shadow mt-3">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X ">
              <table className="w-100 ">
                <thead className="w-100 table_head">
                  <tr className="product_borderbottom">
                    <th className="py-3">
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th>
                      <h3 className="fs-sm fw-400 black mb-0 ms-0">
                        Load Items
                      </h3>
                    </th>
                    <th>
                      <p className="fw-400 fs-sm black mb-0 ms-0">
                        Unload Items
                      </p>
                    </th>
                    <th>
                      <p className="fw-400 fs-sm black mb-0 ms-0">
                        Pending Items
                      </p>
                    </th>
                    <th>
                      <p className="fw-400 fs-sm black mb-0 ms-0">Actions</p>
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{ maxHeight: "calc(100vh - 460px)" }}
                  className="table_body "
                >
                  {updatedFilterHistory
                    .sort((a, b) => {
                      const dateA = new Date(a.formattedDate);
                      const dateB = new Date(b.formattedDate);
                      return dateB - dateA;
                    })
                    .map((item, index) => {
                      return (
                        <tr className="product_borderbottom" key={index}>
                          <td className=" py-3">
                            <h3 className="fs-sm fw-400 black mb-0 ">
                              {item.formattedDate
                                .split("-")
                                .reverse()
                                .join("-")}
                            </h3>
                          </td>
                          <td>
                            <h3 className="fs-sm fw-400 black mb-0 ">
                              {item.loaditems.length}
                            </h3>
                          </td>

                          <td>
                            <h3 className="fs-sm fw-400 black mb-0 ">
                              {item.unloaditems.length}
                            </h3>
                          </td>
                          <td>
                            <h3 className="fs-sm fw-400 black mb-0 ">
                              {item.pendingitems.length}
                            </h3>
                          </td>
                          <td>
                            <button
                              onClick={() => setViewLogsPop(item)}
                              className="border-0 bg-transparent text-primary"
                            >
                              view all
                            </button>
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

export default VanHistoryLogs;

import React from "react";
import starIcon from "../../Images/svgs/star-icon.svg";
import threeDots from "../../Images/svgs/dots2.svg";
import { NavLink } from "react-router-dom";
import { UseComplaintsContext } from "../../context/ComplainsGetter";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Complain() {
  const { complaints } = UseComplaintsContext();
  async function deleteComplain(id) {
    await deleteDoc(doc(db, "Complaints", id));
  }
  async function resolveComplain(id) {
    await deleteDoc(doc(db, "Complaints", id));
  }
  const pendingComplains = complaints.filter((items) => items.status === "NEW");
  const compliteComplaine = complaints.filter((items) => items.status !== "NEW");
  const withdrawalComplaine = complaints.filter((items) => items.status === "WITHDRAWAL");
  return (
    <div className="complain">
      <div className="complain_heading mt-4">
        <h2 className="fs_36 fw_500 color_black ff_outfit ps-2">Complaints</h2>
        <div className="d-flex align-items-center gap-3 mt-4 pt-1 ms-2">
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fs_12 fw_500">All</span> ({complaints.length})
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Pending</span> ({pendingComplains.length})
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Withrawal </span> ({withdrawalComplaine.length})
          </p>
          <p className="fs_12 fw_400 color_black ff_outfit">
            <span className="fw_500 color_blue">Completed</span> ({compliteComplaine.length})
          </p>
        </div>
      </div>
      <div className="line_scroll mt-4">
        <div style={{ minWidth: "1500px", height: "calc(100vh - 254px)" }} className="bg-white">
          <table className="w-100">
            <tbody>
              {complaints.map((item, index) => {
                return (
                  <tr key={index} className="bg-white">
                    <td className="p_10 mx_220">
                      <span className="d-flex align-items-center p_10">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                        <NavLink
                          to={`/communications/complaindetails/${item.id}`}
                          className="fs-xs fw_500 color_blue d-inline-block ms-5">
                          #{item.complaintId}
                        </NavLink>
                      </span>
                    </td>
                    <td className="px_10 mx_250 mw-250 py-0">
                      <p className="fs-xs fw_500 color_black mb-0">{item.customer.name}</p>
                      <p className="fs-xxs fw_400 black opacity-75 mb-0">
                        ID : {item.customer.uid}
                      </p>
                    </td>
                    <td className="p_10 w-100 mx_xxl_580">
                      <p className="fs-xs fw_500 color_black m-0 mx_580">{item.cause}</p>
                    </td>
                    <td className="p_10 mx_125">
                      <p
                        className={`fs-xs fw_500 color_green ${
                          item.status === "NEW" ? "complain_pending" : "complain_resolved"
                        } m-0`}>
                        {item.status === "NEW"
                          ? "Pending"
                          : item.status === "RESOLVED"
                          ? "Resolved"
                          : "Withdrawal"}
                      </p>
                    </td>
                    <td className="fs-xs fw_500 color_black p_10 w_130 text-end white_space_nowrap">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className=" mx_85 text-center">
                      <div class="dropdown complain_dd">
                        <button
                          class="btn dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton3"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <img src={threeDots} alt="dropdownDots" />
                        </button>
                        <ul
                          class="dropdown-menu categories_dropdown py-2"
                          aria-labelledby="dropdownMenuButton3">
                          <li>
                            <div class="dropdown-item">
                              <NavLink
                                to={`/communications/complaindetails/${item.id}`}
                                className="comm_details_btn fs-xs fw_400 text-white text-center d-inline-block">
                                Details
                              </NavLink>
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
  );
}

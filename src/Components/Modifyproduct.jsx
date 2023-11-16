import React from "react";
import Eye from "../Images/svgs/eye.svg";
import Pencil from "../Images/svgs/pencil.svg";
import Delte from "../Images/svgs/delte.svg";
import Arross from "../Images/svgs/arross.svg";
function Modifyproduct() {
  return (
    <>
      <div className="modify_box border bg_white   p-3 ">
        <div className="d-flex align-items-center  cursor  ">
          <img src={Eye} alt="" className=" me-2" />
          <h3 className="fw-400 fs-sm black  mb-0 ">View Details</h3>
        </div>
        <div className="d-flex align-items-center cursor pt-2  ">
          <img src={Pencil} alt="" className=" me-2" />
          <h3 className="fw-400 fs-sm black  mb-0 ">Edit Category </h3>
        </div>
        <div className="d-flex align-items-center cursor  pt-2 ">
          <img src={Arross} alt="" className=" me-2" />
          <h3 className="fw-400 fs-sm green  mb-0 ">Change to Draft </h3>
        </div>
        <div className="d-flex align-items-center cursor pt-2 ">
          <img src={Delte} alt="" className=" me-2" />
          <h3 className="fw-400 fs-sm red  mb-0 ">Delete </h3>
        </div>
      </div>
    </>
  );
}

export default Modifyproduct;

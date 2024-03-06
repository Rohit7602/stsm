import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
const PrivacyPolicy = () => {
  return (
    <div className="main_panel_wrapper bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500   black fs-lg mb-0">Privacy Policy</h1>
          </div>
          <Link className="addnewproduct_btn black  fs-sm px-sm-3 px-2 py-2 fw-400 ">
            Update
          </Link>
        </div>
        <div className="rich-text-editor mt-5">
          <ReactQuill
            style={{ height: "400px" }}
            className="rounded-lg border w-full mt-[30px] p-[10px] border-[#D9D9D9] border-solid outline-none h-100"
            modules={PrivacyPolicy.modules}
            onChange={(content) => console.log("content", content)}
            formats={PrivacyPolicy.formats}
            placeholder="Write something..."
          />
        </div>
      </div>
    </div>
  );
};

PrivacyPolicy.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: true,
  },
};
PrivacyPolicy.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];


export default PrivacyPolicy;

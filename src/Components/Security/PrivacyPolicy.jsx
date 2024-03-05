import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const PrivacyPolicy = () => {
  return (
    <div >

      <div  className="rich-text-editor">
        <ReactQuill style={{ height: "400px" }}
          className="rounded-lg border w-full mt-[30px] p-[10px] border-[#D9D9D9] border-solid outline-none h-100"
          modules={PrivacyPolicy.modules}
          onChange={(content) =>  console.log("content", content)}
          formats={PrivacyPolicy.formats}
          placeholder="Write something..."
        />
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

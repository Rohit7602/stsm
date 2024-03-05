import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const TermConditions = () => {
  return (
    <div >

      <div  className="rich-text-editor">
        <ReactQuill style={{ height: "400px" }}
          className="rounded-lg border w-full mt-[30px] p-[10px] border-[#D9D9D9] border-solid outline-none h-100"
          modules={TermConditions.modules}
          onChange={(content) =>  console.log("content", content)}
          formats={TermConditions.formats}
          placeholder="Write something..."
        />
      </div>
    </div>
  );
};

TermConditions.modules = {
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
TermConditions.formats = [
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


export default TermConditions;

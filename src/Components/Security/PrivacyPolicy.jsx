import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loader from "../Loader";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';


const PrivacyPolicy = () => {

  const [value, setValue] = useState("");
  const [loading, setloading] = useState(false)


  const handleChange = (content, delta, source, editor) => {
    const deltaOps = editor.getContents().ops;
    const deltaHtml = convertDeltaToHtml(deltaOps);
    setValue(deltaHtml);
  };
  const convertDeltaToHtml = deltaOps => {
    const converter = new QuillDeltaToHtmlConverter(deltaOps, {});
    return converter.convert();
  };



  async function handleUpdateData(e) {
    e.preventDefault()
    setloading(true)
    try {
      await updateDoc(doc(db, 'configs', '1Qh3Rze3zgyimAgyhoNZ'), {
        value,
      });
      setloading(false)
      toast.success('Term and Condition updated !', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("Error in update TermConditions", error);
    }
  }



  if (loading) {
    return (
      <>
        <Loader></Loader>
      </>
    )
  } else {
    return (
      <div >
        <button onClick={handleUpdateData} className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">Update Data </button>
        <div className="rich-text-editor">
          <ReactQuill style={{ height: "400px" }}
            className="rounded-lg border w-full mt-[30px] p-[10px] border-[#D9D9D9] border-solid outline-none h-100"
            modules={PrivacyPolicy.modules}
            value={value}
            onChange={handleChange}
            preserveWhitespace
            formats={PrivacyPolicy.formats}
            placeholder="Write something..."
          />
        </div>
        <ToastContainer></ToastContainer>
      </div>
    );
  };
}



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

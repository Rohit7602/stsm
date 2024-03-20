import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loader from "../Loader";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { updateDoc, getDoc } from "firebase/firestore";
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



  useEffect(() => {
    setloading(true)
    const fetchData = async () => {
      try {
        const docRef = doc(db, "configs", "1Qh3Rze3zgyimAgyhoNZ");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setValue(docSnap.data().value || "");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
      setloading(false);
    };
    fetchData();
  }, []);



  async function handleUpdateData(e) {
    e.preventDefault()
    console.log("first")
    setloading(true)
    try {
      await updateDoc(doc(db, 'configs', '1Qh3Rze3zgyimAgyhoNZ'), {
        value,
      });
      setloading(false)
      toast.success('Privacy Policy updated !', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("Error in Privacy Policy", error);
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
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500 black fs-lg mb-0">Privacy Policy</h1>
            </div>
            <button onClick={(e) => handleUpdateData(e)} className="addnewproduct_btn black  fs-sm px-sm-3 px-2 py-2 fw-400 ">
              Update
            </button>
          </div>
          <div className="rich-text-editor mt-5" >
            <ReactQuill
            
              className="rounded-lg  border outline-none "
              modules={PrivacyPolicy.modules}
              onChange={handleChange}
              formats={PrivacyPolicy.formats}
              value={value}
              placeholder="Write something..."
            />
          </div>
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

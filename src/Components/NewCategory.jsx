import React from "react";
import saveicon from "../Images/svgs/saveicon.svg";
import deleteicon from "../Images/svgs/deleteicon.svg";
import { Col, Row } from "react-bootstrap";
import SearchIcon from "../Images/svgs/search.svg";
import { useState } from "react";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const NewCategory = ({ setOpen, open }) => {
  const [imageupload, setImageupload] = useState("");
  const [status, setStatus] = useState();
  const [name, setName] = useState();
  const [category, setCategory] = useState();
  const [loaderstatus, setLoaderstatus] = useState(false);

  const pubref = useRef();
  const hidref = useRef();

  const [mainCategory, setMainCategory] = useState([]);

  async function handleSave(e) {
    e.preventDefault();

    try {
      if (name == undefined) {
        alert("Please enter the name");
      } else if (status === undefined) {
        alert("Please Set the status");
      } else if (category === undefined) {
        alert("please select category");
      } else if (imageupload.length === 0) {
        alert("Please Set an image for the product");
      } else {
        setLoaderstatus(true);
        const filename = Math.floor(Date.now() / 1000) + "-" + imageupload.name;
        const storageRef = ref(storage, `/Main-category/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, "sub_categories"), {
          title: name,
          status: status,
          image: imageUrl,
          cat_ID: category,
        });
        setLoaderstatus(false);
        toast.success("Product added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleReset();
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error adding document: ", e);
    }
  }

  function handelUpload(e) {
    setImageupload(e.target.files[0]);
  }
  function handleReset() {
    setImageupload();
    setName("");
    pubref.current.checked = false;
    hidref.current.checked = false;
  }

  function handleDelete22(index) {
    setImageupload();
  }

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
        });
        setMainCategory([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  if (loaderstatus) {
    return (
      <>
        <h1>loading...</h1>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100 d-flex flex-column">
        {/* top-bar  */}
        <div className="top_bar px-3  bg-white py-2 ">
          <div className="d-flex align-items-center  justify-content-between">
            <div className="d-flex align-items-center search_bar_wrapper">
              <svg
                onClick={() => setOpen(!open)}
                className="togle cursor   "
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.3999 9.59961C2.3999 9.28135 2.52633 8.97613 2.75137 8.75108C2.97642 8.52604 3.28164 8.39961 3.5999 8.39961H15.9695C16.2878 8.39961 16.593 8.52604 16.818 8.75108C17.0431 8.97613 17.1695 9.28135 17.1695 9.59961C17.1695 9.91787 17.0431 10.2231 16.818 10.4481C16.593 10.6732 16.2878 10.7996 15.9695 10.7996H3.5999C3.28164 10.7996 2.97642 10.6732 2.75137 10.4481C2.52633 10.2231 2.3999 9.91787 2.3999 9.59961ZM2.3999 4.79961C2.3999 4.48135 2.52633 4.17612 2.75137 3.95108C2.97642 3.72604 3.28164 3.59961 3.5999 3.59961H20.3999C20.7182 3.59961 21.0234 3.72604 21.2484 3.95108C21.4735 4.17612 21.5999 4.48135 21.5999 4.79961C21.5999 5.11787 21.4735 5.42309 21.2484 5.64814C21.0234 5.87318 20.7182 5.99961 20.3999 5.99961H3.5999C3.28164 5.99961 2.97642 5.87318 2.75137 5.64814C2.52633 5.42309 2.3999 5.11787 2.3999 4.79961ZM2.3999 14.3996C2.3999 14.0814 2.52633 13.7761 2.75137 13.5511C2.97642 13.326 3.28164 13.1996 3.5999 13.1996H20.3999C20.7182 13.1996 21.0234 13.326 21.2484 13.5511C21.4735 13.7761 21.5999 14.0814 21.5999 14.3996C21.5999 14.7179 21.4735 15.0231 21.2484 15.2481C21.0234 15.4732 20.7182 15.5996 20.3999 15.5996H3.5999C3.28164 15.5996 2.97642 15.4732 2.75137 15.2481C2.52633 15.0231 2.3999 14.7179 2.3999 14.3996ZM2.3999 19.1996C2.3999 18.8814 2.52633 18.5761 2.75137 18.3511C2.97642 18.126 3.28164 17.9996 3.5999 17.9996H15.9695C16.2878 17.9996 16.593 18.126 16.818 18.3511C17.0431 18.5761 17.1695 18.8814 17.1695 19.1996C17.1695 19.5179 17.0431 19.8231 16.818 20.0481C16.593 20.2732 16.2878 20.3996 15.9695 20.3996H3.5999C3.28164 20.3996 2.97642 20.2732 2.75137 20.0481C2.52633 19.8231 2.3999 19.5179 2.3999 19.1996Z"
                  fill="black"
                />
              </svg>
              <form
                className="form_box   mx-2 d-flex p-2 align-items-center"
                action=""
              >
                <div className="d-flex">
                  <img src={SearchIcon} alt=" search icon" />
                </div>
                <input
                  type="text"
                  className="bg-transparent  border-0 px-2 fw-400  outline-none"
                  placeholder="Search in the admin panel"
                />
              </form>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 18H19V11.031C19 7.148 15.866 4 12 4C8.134 4 5 7.148 5 11.031V18ZM12 2C16.97 2 21 6.043 21 11.031V20H3V11.031C3 6.043 7.03 2 12 2ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21Z"
                fill="black"
              />
            </svg>
          </div>
        </div>
        <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
          <div className="container">
            <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
              <div className="d-flex">
                <h1 className="fw-500  mb-0 black fs-lg">New Category</h1>
              </div>
              <div className="d-flex align-itmes-center gap-3">
                <button className="reset_border">
                  <button
                    onClick={handleReset}
                    className="fs-sm reset_btn border-0 fw-400 "
                  >
                    Reset
                  </button>
                </button>
                <button
                  onClick={handleSave}
                  className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black"
                >
                  <img src={saveicon} alt="saveicon" />
                  Save
                </button>
              </div>
            </div>
            {/* NEW PRODUCT DETAILSS  */}

            <Row className="mt-3">
              <Col xxl={8}>
                {/* Basic Information */}
                <div className="product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">
                    Basic Information
                  </h2>
                  <form>
                    {/* ist input */}
                    <label htmlFor="Name" className="fs-xs fw-400 mt-3 black">
                      Name
                    </label>
                    <br />
                    <input
                      type="text"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="Enter product name"
                      id="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />{" "}
                    <br />
                    {/* 2nd input */}
                    <label htmlFor="des" className="fs-xs fw-400 mt-3 black">
                      Category Image
                    </label>{" "}
                    <br />
                    <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                      {!imageupload ? (
                        <input
                          type="file"
                          id="file22"
                          hidden
                          accept="/*"
                          multiple
                          onChange={handelUpload}
                        />
                      ) : (
                        <div className=" d-flex flex-wrap">
                          <div className="position-relative ">
                            <img
                              className="mobile_image object-fit-cover"
                              src={URL.createObjectURL(imageupload)}
                              alt=""
                            />
                            <img
                              className="position-absolute top-0 end-0 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                              onClick={handleDelete22}
                            />
                          </div>
                        </div>
                      )}

                      {!imageupload ? (
                        <label
                          htmlFor="file22"
                          className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Media
                        </label>
                      ) : null}
                    </div>
                    <br />
                  </form>
                </div>
              </Col>
              <Col xxl={4}>
                {/* Status */}
                <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                    {/* <label className="check" htmlFor="check1">
                {" "}
                one
                <input id="check1" checked="checked" type="checkbox" />{" "}
                <h2 className="fw-400 fs-sm black mb-0">Published</h2>
                <span class="checkmark"></span>
              </label> */}
                    <label class="check fw-400 fs-sm black mb-0">
                      Published
                      <input
                        ref={pubref}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatus("published");
                            hidref.current.checked = false;
                          }
                        }}
                        type="checkbox"
                      />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                    <label class="check fw-400 fs-sm black mb-0">
                      Hidden
                      <input
                        ref={hidref}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatus("hidden");
                            pubref.current.checked = false;
                          }
                        }}
                        type="checkbox"
                      />
                      <span class="checkmark"></span>
                    </label>
                    {/* <input id="check" type="checkbox" />
              <label htmlFor="check">
                <h2 className="fw-400 fs-sm black mb-0">Hidden</h2>
              </label> */}
                  </div>
                </div>

                {/* Parent Category */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">Parent Category</h2>
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-3 product_input  black fw-400"
                    id="Discount"
                  >
                    <option className="mt-2 product_input black fw-400">
                      Select category
                    </option>
                    {mainCategory.map((item, index) => {
                      const { id, title } = item;
                      return (
                        <option
                          className="mt-2 product_input black fw-400"
                          value={id}
                        >
                          {title}
                        </option>
                      );
                    })}
                  </select>
                  <p className="black fw-400 fs-xxs mb-0 mt-3">
                    Select a category that will be the parent of the current
                    one.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default NewCategory;

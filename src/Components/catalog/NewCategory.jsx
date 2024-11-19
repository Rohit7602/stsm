import React from "react";
import saveicon from "../../Images/svgs/saveicon.svg";
import savegreenicon from "../../Images/svgs/save_green_icon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import { Col, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import SearchIcon from "../../Images/svgs/search.svg";
import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import minilayoutImgGroup3 from "../../Images/Png/minilayoutImgGroup3.png";
import minilayoutImgGroup4 from "../../Images/Png/minilayoutImgGroup4.png";
import minilayoutImgGroup6 from "../../Images/Png/minilayoutImgGroup6.png";
import minilayoutImgGroup9 from "../../Images/Png/minilayoutImgGroup9.png";
import minilayoutImgGroup8 from "../../Images/Png/minilayoutImgGroup8.png";
import { db } from "../../firebase";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import { NavLink, Link } from "react-router-dom";
import { useImageHandleContext } from "../../context/ImageHandler";
import {
  useSubCategories,
  useMainCategories,
} from "../../context/categoriesGetter";
import { increment } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";

import Loader from "../Loader";

// import { Toast } from 'react-toastify/dist/components';

const NewCategory = () => {
  const [imageupload, setImageupload] = useState("");
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [status, setStatus] = useState();
  const [name, setName] = useState();
  const [category, setCategory] = useState();
  const [searchvalue, setSearchvalue] = useState("");
  const { ImageisValidOrNot } = useImageHandleContext();

  const [selectedLayout, setSelectedLayout] = useState("");

  // ...

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addData, data } = useSubCategories();
  const { categoreis, addDataParent } = useMainCategories();

  const handleSelectCategory = (category) => {
    setSearchvalue("");
    setSelectedCategory(category);
    setCategory(category);
  };

  const pubref = useRef();
  const hidref = useRef();

  // const [mainCategory, setMainCategory] = useState([]);

  async function handleSave(e) {
    e.preventDefault();

    try {
      if (name == undefined) {
        toast.error("Please enter the name");
      } else if (status === undefined) {
        toast.error("Please Set the status");
      } else if (category === undefined) {
        toast.error("please select category");
      } else if (imageupload.length === 0) {
        toast.error("Please Set an image for the product");
      } else {
        setLoaderstatus(true);
        const filename = Math.floor(Date.now() / 1000) + "-" + imageupload.name;
        const storageRef = ref(storage, `/Sub-categories/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, "sub_categories"), {
          title: name,
          status: status,
          image: imageUrl,
          cat_ID: category.id,
          created_at: Date.now(),
          updated_at: Date.now(),
          noOfProducts: 0,
          subcategorynumber: data.length + 1,
        });
        await updateDoc(doc(db, "categories", category.id), {
          noOfSubcateogry: increment(1),
          categorynumber: categoreis.length + 1,
        });

        setLoaderstatus(false);
        toast.success("Category  added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleReset();
        addData(docRef);
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error adding document: ", e);
    }
  }

  const handelUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!ImageisValidOrNot(selectedFile)) {
      toast.error("Please select a valid image file within 1.5 MB.");
      setImageupload(null);
    } else {
      setImageupload(selectedFile);
    }
  };
  function handleReset() {
    setImageupload();
    setName("");
    pubref.current.checked = false;
    hidref.current.checked = false;
  }

  function handleDelete22(index) {
    setImageupload();
  }

  /***********************************************
   * Handle Parent Category code start from here
   * ******************************************************
   *
   */
  const [refreshData, setRefreshData] = useState(false);
  const [addCatPopup, setAddCatPopup] = useState(false);
  const [perName, setPerName] = useState("");
  const [imageupload2, setImageupload2] = useState("");
  const [perStatus, setPerStatus] = useState();

  function handelUpload2(e) {
    const selectedFile = e.target.files[0];
    if (!ImageisValidOrNot(selectedFile)) {
      toast.error("please select an image file ");
      setImageupload2(null);
    } else {
      setImageupload2(selectedFile);
    }
  }

  function handleDelete2(index) {
    setImageupload2();
  }
  function handleDelete22(index) {
    setImageupload();
  }

  function HandleResetFormParentCategory() {
    setPerName("");
    setImageupload2();
    setAddCatPopup(false);
  }

  async function handleSaveParentCategory(e) {
    e.preventDefault();
    try {
      if (perName === undefined || null) {
        toast.error("please enter the name of the category  ");
      } else if (imageupload2.length === 0) {
        toast.error("please upload image of the category");
      } else if (perStatus === undefined || null) {
        toast.error("please Set the status");
      } else {
        setLoaderstatus(true);
        const filename =
          Math.floor(Date.now() / 1000) + "-" + imageupload2.name;
        const storageRef = ref(storage, `/Parent-category/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload2);
        const imageUrl = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, "categories"), {
          title: perName,
          status: perStatus,
          image: imageUrl,
          homepagelayout: selectedLayout,
          created_at: Date.now(),
          updated_at: Date.now(),
          noOfSubcateogry: 0,
          // categorynumber: Number(categorynumber),
        });
        setLoaderstatus(false);
        toast.success("Category added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        HandleResetFormParentCategory();
        setAddCatPopup(false);
        setRefreshData((prevState) => !prevState);
        // context
        addDataParent(docRef);
      }
    } catch (e) {
      setLoaderstatus(false);
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e);
    }
  }

  /*  *******************************
      Add Parent Category end  here 
      *********************************************   **/

  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        {addCatPopup === true ? <div className="bg_black_overlay"></div> : ""}
        <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
          {/* NEW PRODUCT DETAILSS  */}
          <form>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="fw-500  mb-0 black fs-lg">New Category</h1>
              <div className="d-flex justify-content-center">
                <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
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
              </div>
            </div>
            <Row className="mt-3">
              <Col xxl={8}>
                {/* Basic Information */}
                <div className="product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">
                    Basic Information
                  </h2>
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
                  </label>
                  <br />
                  <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                    {!imageupload ? (
                      <input
                        type="file"
                        id="file22"
                        hidden
                        accept=".png, .jpeg, .jpg"
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
                </div>
              </Col>
              <Col xxl={4}>
                {/* Status */}
                <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
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
                  </div>
                </div>

                {/* Parent Category */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Parent Category
                    </h2>
                    <Link
                      to="/catalog/parentcategories"
                      className="fs-2sm fw-400 red"
                    >
                      View All
                    </Link>
                  </div>
                  <Dropdown className="category_dropdown z-1">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dropdown_input_btn"
                    >
                      <div className="product_input">
                        <p className="fade_grey fw-400 w-100 mb-0 text-start">
                          {selectedCategory
                            ? selectedCategory.title
                            : "Select Category"}
                        </p>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center product_input position-sticky top-0">
                          <img src={SearchIcon} alt="SearchIcon" />
                          <input
                            onChange={(e) => setSearchvalue(e.target.value)}
                            placeholder="search for category"
                            className="fade_grey fw-400 border-0 outline_none ms-2 w-100"
                            type="text"
                          />
                        </div>
                        <div>
                          {categoreis
                            .filter((items) => {
                              return (
                                searchvalue.toLowerCase() === "" ||
                                items.title.toLowerCase().includes(searchvalue)
                              );
                            })
                            .map((category) => (
                              <Dropdown.Item key={category.id}>
                                <div
                                  className={`d-flex justify-content-between ${
                                    selectedCategory &&
                                    selectedCategory.id === category.id
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => handleSelectCategory(category)}
                                >
                                  <p className="fs-xs fw-400 black mb-0">
                                    {category.title}
                                  </p>
                                  {selectedCategory &&
                                    selectedCategory.id === category.id && (
                                      <img
                                        src={savegreenicon}
                                        alt="savegreenicon"
                                      />
                                    )}
                                </div>
                              </Dropdown.Item>
                            ))}
                          {searchvalue &&
                            !categoreis.some((category) =>
                              category.title
                                .toLowerCase()
                                .includes(searchvalue.toLowerCase())
                            ) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPerName(searchvalue);
                                  setAddCatPopup(true);
                                }}
                                className="addnew_category_btn fs-xs green"
                              >
                                +Add{" "}
                                <span className="black">"{searchvalue}"</span>{" "}
                                in Parent Category
                              </button>
                            )}
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                  {addCatPopup === true ? (
                    <div className="parent_category_popup">
                      <form action="">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="fs-4 fw-400 black mb-0">
                            New Parent Category
                          </p>
                          <div className="d-flex align-items-center gap-3">
                            <button
                              onClick={() => setAddCatPopup(false)}
                              className="reset_border"
                            >
                              <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                                Cancel
                              </button>
                            </button>
                            <button
                              onClick={(e) => handleSaveParentCategory(e)}
                              type="submit"
                              className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn"
                            >
                              <img src={saveicon} alt="saveicon" />
                              <p className="fs-sm fw-400 black mb-0 ps-1">
                                Save
                              </p>
                            </button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h2 className="fw-400 fs-2sm black mb-0">
                            Basic Information
                          </h2>
                          {/* ist input */}
                          <label
                            htmlFor="Name"
                            className="fs-xs fw-400 mt-3 black"
                          >
                            Name
                          </label>
                          <br />
                          <input
                            type="text"
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="Enter Category name"
                            id="Name"
                            value={perName}
                            onChange={(e) => setPerName(e.target.value)}
                          />{" "}
                          <br />
                          {/* 2nd input */}
                          <label
                            htmlFor="des"
                            className="fs-xs fw-400 mt-3 black"
                          >
                            Category Image
                          </label>{" "}
                          <br />
                          <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                            {!imageupload2 ? (
                              <input
                                type="file"
                                id="file2"
                                hidden
                                accept="/*"
                                multiple
                                onChange={handelUpload2}
                              />
                            ) : (
                              <div className=" d-flex flex-wrap">
                                <div className="position-relative ">
                                  <img
                                    className="mobile_image object-fit-cover"
                                    src={URL.createObjectURL(imageupload2)}
                                    alt=""
                                  />
                                  <img
                                    className="position-absolute top-0 end-0 cursor_pointer"
                                    src={deleteicon}
                                    alt="deleteicon"
                                    onClick={handleDelete2}
                                  />
                                </div>
                              </div>
                            )}

                            {!imageupload2 ? (
                              <label
                                htmlFor="file2"
                                className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center"
                              >
                                + Add Media
                              </label>
                            ) : null}
                          </div>
                        </div>
                        <div className="banner_advertisement mt-4">
                          <Accordion className="w-100 rounded-none bg-white product_input py-0">
                            <Accordion.Header className="bg_grey fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                              <div className="d-flex justify-content-between w-100 py-3">
                                <h3 className="fs-sm fw-400 black mb-0">
                                  Select Homepage Layout
                                </h3>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="py-2 px-0">
                              <div className="d-flex align-items-start gap-4">
                                <div>
                                  <div className="d-flex align-items-center mb-2 pb-1">
                                    <input
                                      id="one"
                                      className="raido-black"
                                      type="radio"
                                      name="minilayout"
                                      onChange={() => handleLayoutChange("1X3")}
                                    />
                                    <label
                                      htmlFor="one"
                                      className="fs-xs fw-400 black mb-0 ms-2"
                                    >
                                      1 x 3
                                    </label>
                                  </div>
                                  <img src={minilayoutImgGroup3} alt="" />
                                </div>
                                <div>
                                  <div className="d-flex align-items-center mb-2 pb-1">
                                    <input
                                      id="two"
                                      className="raido-black"
                                      type="radio"
                                      name="minilayout"
                                      onChange={() => handleLayoutChange("2X2")}
                                    />
                                    <label
                                      htmlFor="two"
                                      className="fs-xs fw-400 black mb-0 ms-2"
                                    >
                                      2 x 2
                                    </label>
                                  </div>
                                  <img src={minilayoutImgGroup4} alt="" />
                                </div>
                                <div>
                                  <div className="d-flex align-items-center mb-2 pb-1">
                                    <input
                                      id="three"
                                      className="raido-black"
                                      type="radio"
                                      name="minilayout"
                                      onChange={() => handleLayoutChange("2X3")}
                                    />
                                    <label
                                      htmlFor="three"
                                      className="fs-xs fw-400 black mb-0 ms-2"
                                    >
                                      2 x 3
                                    </label>
                                  </div>
                                  <img src={minilayoutImgGroup6} alt="" />
                                </div>
                                <div>
                                  <div className="d-flex align-items-center mb-2 pb-1">
                                    <input
                                      id="four"
                                      className="raido-black"
                                      type="radio"
                                      name="minilayout"
                                      onChange={() => handleLayoutChange("3X3")}
                                    />
                                    <label
                                      htmlFor="four"
                                      className="fs-xs fw-400 black mb-0 ms-2"
                                    >
                                      3 x 3
                                    </label>
                                  </div>
                                  <img src={minilayoutImgGroup9} alt="" />
                                </div>
                                <div>
                                  <div className="d-flex align-items-center mb-2 pb-1">
                                    <input
                                      id="five"
                                      className="raido-black"
                                      type="radio"
                                      name="minilayout"
                                      onChange={() =>
                                        handleLayoutChange("2X2 Inline3")
                                      }
                                    />
                                    <label
                                      htmlFor="five"
                                      className="fs-xs fw-400 black mb-0 ms-2"
                                    >
                                      2 x 2 Inline3
                                    </label>
                                  </div>
                                  <img src={minilayoutImgGroup8} alt="" />
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion>
                        </div>
                        <div className="mt-4">
                          <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                          <div className="d-flex align-items-center gap-5">
                            <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                              <label class="check fw-400 fs-sm black mb-0">
                                Published
                                <input
                                  ref={pubref}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPerStatus("published");
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
                                      setPerStatus("hidden");
                                      pubref.current.checked = false;
                                    }
                                  }}
                                  type="checkbox"
                                />
                                <span class="checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
                  <p className="black fw-400 fs-xxs mb-0 mt-3">
                    Select a category that will be the parent of the current
                    one.
                  </p>
                </div>
              </Col>
            </Row>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default NewCategory;

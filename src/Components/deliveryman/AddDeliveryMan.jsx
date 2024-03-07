import React, { useState, useEffect, useContext } from "react";
import saveicon from "../../Images/svgs/saveicon.svg";
import savegreenicon from "../../Images/svgs/save_green_icon.svg";
import SearchIcon from "../../Images/svgs/search.svg";
import whiteSaveicon from "../../Images/svgs/white_saveicon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import closeicon from "../../Images/svgs/closeicon.svg";
import addIcon from "../../Images/svgs/addicon.svg";
import { Col, Row } from "react-bootstrap";
import addicon from "../../Images/svgs/addicon.svg";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Dropdown from "react-bootstrap/Dropdown";
import { storage } from "../../firebase";
import { useRef } from "react";
import { useProductsContext } from "../../context/productgetter";
import { useSubCategories } from "../../context/categoriesGetter";
import { useParams } from "react-router-dom";
const AddDeliveryMan = () => {
  const { productData } = useProductsContext();
  const productId = useParams();
  console.log("product id is ", productId);
  const [name, setName] = useState("");
  const [address, setaddress] = useState("");
  const [bankname, setBankname] = useState("");
  const [routingno, setRoutingno] = useState("");
  const [DOB, setDOB] = useState("");
  const [mobile, setMobile] = useState("");
  const [accountname, setAccountname] = useState("");
  const [accountno, setAccountno] = useState("");
  const [varient, setVarient] = useState(false);

  // context
  const { addData } = useProductsContext();
  const { data } = useSubCategories();

  const [status, setStatus] = useState("published");
  const [Freedelivery, setFreeDelivery] = useState(true);
  const [payment, setPayment] = useState(null);
  const [sku, setSku] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [StockCount, setStockCount] = useState("");
  const [stockPrice, setStockPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [imageUpload22, setImageUpload22] = useState([]);
  // const [categoriesdata, setSubcategoriesData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [stockpopup, setStockpopup] = useState(false);

  //  search functionaltiy in categories and selected categories
  const [searchvalue, setSearchvalue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSearchvalue("");
    setSelectedCategory(category);
  };

  const [variants, setVariants] = useState([]);
  const [discount, setDiscount] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [VarintName, setVariantsNAME] = useState("");
  const [discountType, setDiscountType] = useState("Amount");
 

  // stock popup save functionality

  // get total amount functionality
  function handleTotalQunatity(e) {
    let value = e.target.value;
    return setTotalStock(value);
  }

  function handleSetTotalPrice(e) {
    let value = e.target.value;
    return setStockPrice(value);
  }

  function HandleStockPopUpSave() {
    setStockpopup(false);
  }

  const pubref = useRef();
  const hidref = useRef();

  function handleReset() {
    setName();
    setaddress();
    setBankname();
    setRoutingno();
    setDOB();
    setMobile();
    setAccountname();
    setAccountno();
    setOriginalPrice(0);
    setDiscountType("Amount");
    setDiscount(0);
    setVariants([]);
    setCategories();
    setStatus("published");
    setFreeDelivery(true);
    setPayment(true);
    setSku();
    setTotalStock();
    setImageUpload22([]);
    setSelectedCategory(null);
    setStockPrice("");

    pubref.current.checked = false;
    hidref.current.checked = false;
    // setSearchdata([]);
  }
  async function handlesave(e) {
    e.preventDefault();
  }

  if (loaderstatus) {
    return (
      <>
        <div className="loader">
          <h3 className="heading">Uploading Data... Please Wait</h3>
        </div>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 bg_body pt-3">
          <form onSubmit={handlesave}>
            <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
              <div className="d-flex">
                <h1 className="fw-500  mb-0 black fs-lg">New delivery Man</h1>
              </div>
              <button
                className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                type="submit"
              >
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Save New Delivery Man
              </button>
            </div>
            <Row className="mt-3">
              <Col xxl={8}>
                {/* Basic Information */}
                <div className="  ">
                  <div>
                    {/* Ist-box  */}
                    <div class="product_shadow bg_white p-3 pb-5  ">
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
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="John leo"
                        id="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <br />
                      <div className="row">
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Date of Birth
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="DOB"
                            id="DOB"
                            value={DOB}
                            onChange={(e) => setDOB(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Contact Info
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="mobile"
                            id="mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* 2nd input */}
                      <label
                        htmlFor="short"
                        className="fs-xs fw-400 mt-3  black"
                      >
                        Address
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="street address"
                        id="address"
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                      />
                      <h2 className="fw-400 fs-2sm black mb-0 mt-3">
                        Bank Detail’s
                      </h2>
                      <label className="fs-xs fw-400 mt-3  black">
                        Bank name
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="bank na..."
                        id="bankname"
                        value={bankname}
                        onChange={(e) => setBankname(e.target.value)}
                      />
                      <label className="fs-xs fw-400 mt-3  black">
                        Routing Number ( if Applicable )
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="***000"
                        id="routingno"
                        value={routingno}
                        onChange={(e) => setRoutingno(e.target.value)}
                      />
                      <div className="row align-items-center pb-5">
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Account Holder’s Name
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="name"
                            id="accountname"
                            value={accountname}
                            onChange={(e) => setAccountname(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Account Number
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="xxxxxx/"
                            id="accountno"
                            value={accountno}
                            onChange={(e) => setAccountno(e.target.value)}
                          />
                        </div>
                        <div>
                          <h2 className="fw-400 fs-2sm black mb-0 pt-3">
                            Payment Method
                          </h2>
                          <div className="d-flex align-items-center mt-3">
                            <div className="mt-3 mx-4 py-1 d-flex align-items-center gap-5">
                              <label className="check fw-400 fs-sm black mb-0">
                                Deposite
                                <input
                                  onChange={() => setPayment("deposit")}
                                  type="radio"
                                  checked={payment === "deposit"}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                            <div className="mt-3 mx-4 py-1 d-flex align-items-center gap-5">
                              <label className="check fw-400 fs-sm black mb-0">
                                Direct
                                <input
                                  onChange={() => setPayment("direct")}
                                  type="radio"
                                  checked={payment === "direct"}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                            <div className="mt-3 mx-4 py-1 d-flex align-items-center gap-5">
                              <label className="check fw-400 fs-sm black mb-0">
                                Check
                                <input
                                  onChange={() => setPayment("check")}
                                  type="radio"
                                  checked={payment === "check"}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="product_shadow bg_white p-3 pb-5 mt-3  ">
                      <h2 className="fw-400 fs-2sm black mb-0">
                      Emergency Contact Information
                      </h2>
                      </div>
                  </div>
                </div>
              </Col>

              <Col xxl={4}>
                {/* Status */}
                <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                  <div className="product_borderbottom">
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Status <span className="red ms-1 fs-sm">*</span>
                    </h2>
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                      <label className="check fw-400 fs-sm black mb-0">
                        Published
                        <input
                          onChange={() => setStatus("published")}
                          type="radio"
                          checked={status === "published"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 pb-3">
                      <label className="check fw-400 fs-sm black mb-0">
                        Hidden
                        <input
                          onChange={() => setStatus("hidden")}
                          type="radio"
                          checked={status === "hidden"}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0 pt-3">
                      Free Delivery
                    </h2>
                    <div className="d-flex align-items-center">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 w-50">
                        <label className="check fw-400 fs-sm black mb-0">
                          Yes
                          <input
                            onChange={() => setFreeDelivery(true)}
                            type="radio"
                            checked={Freedelivery === true}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 w-50">
                        <label className="check fw-400 fs-sm black mb-0">
                          No
                          <input
                            onChange={() => setFreeDelivery(false)}
                            type="radio"
                            checked={Freedelivery === false}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* invertory */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">
                    Inventory <span className="red ms-1 fs-sm">*</span>
                  </h2>
                  {/* ist input */}
                  <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                    SKU
                  </label>
                  <br />
                  <div className="d-flex align-items-center justify-content-between product_input mt-2">
                    <input
                      required
                      type="text"
                      className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                      placeholder="6HK3I5"
                      value={sku}
                      id="sku"
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>
                  {/* 2nd input */}
                  <label htmlFor="total" className="fs-xs fw-400 mt-3 black">
                    Total Stock{" "}
                    <span className="fade_grey ms-2">{`Purchase Value : ₹${stockPrice}`}</span>
                  </label>{" "}
                  <br />
                  <div className="position-relative">
                    <div className="product_input d-flex align-items-center justify-content-between mt-2">
                      <input
                        required
                        type="text"
                        className="black fw-400 border-0 outline_none bg-white"
                        placeholder="50"
                        disabled
                        id="total"
                        value={totalStock}
                      />{" "}
                      <img
                        onClick={() => setStockpopup(true)}
                        src={addIcon}
                        alt="addIcon"
                      />
                    </div>
                    {stockpopup === true ? (
                      <div className="stock_popup">
                        <div
                          onClick={() => setStockpopup(false)}
                          className="text-end"
                        >
                          <img src={closeicon} alt="closeicon" />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Date of Purchase
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="date"
                          />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Total Quantity
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            placeholder="0.00"
                            value={totalStock}
                            onChange={handleTotalQunatity}
                          />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Total Purchase Price
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            placeholder="₹ 0.00"
                            value={stockPrice}
                            onChange={handleSetTotalPrice}
                          />
                        </div>
                        <button
                          className="stock_save_btn d-flex align-items-center"
                          onClick={HandleStockPopUpSave}
                        >
                          <img src={whiteSaveicon} alt="whiteSaveicon" />
                          <p className="fs-sm fw-400 white ms-2 mb-0">Save</p>
                        </button>
                      </div>
                    ) : null}
                    <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                      Stock Alert Count
                    </label>
                    <br />
                    <input
                      required
                      type="number"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="2"
                      onChange={(e) => setStockCount(e.target.value)}
                    />{" "}
                  </div>
                  <br />
                </div>
                {/* Categories */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Categories <span className="red ms-1 fs-sm">*</span>
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dropdown_input_btn"
                    >
                      <div className="product_input">
                        <p
                          className="fade_grey fw-400 w-100 mb-0 text-start"
                          required
                        >
                          {selectedCategory
                            ? selectedCategory.title || selectedCategory
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
                          {data
                            .filter((items) => {
                              return searchvalue.toLowerCase() === ""
                                ? items
                                : items.title
                                    .toLowerCase()
                                    .includes(searchvalue);
                            })
                            .map((category) => (
                              <Dropdown.Item>
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
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
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

export default AddDeliveryMan;

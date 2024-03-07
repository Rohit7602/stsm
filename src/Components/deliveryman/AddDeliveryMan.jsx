import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import addicon from "../../Images/svgs/addicon.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import { useProductsContext } from "../../context/productgetter";
import { useSubCategories } from "../../context/categoriesGetter";
import { useParams } from "react-router-dom";
const AddDeliveryMan = () => {
  const [name, setName] = useState("");
  const [address, setaddress] = useState("");
  const [emergencycontact, setEmergencycontact] = useState("");
  const [phnno, setPhnno] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [govt, setGovt] = useState("");
  const [social, setSocial] = useState("");
  const [date, setDate] = useState("");
  const [vechileno, setVechileno] = useState("");
  const [insurance, setInsurance] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bankname, setBankname] = useState("");
  const [routingno, setRoutingno] = useState("");
  const [DOB, setDOB] = useState("");
  const [mobile, setMobile] = useState("");
  const [accountname, setAccountname] = useState("");
  const [accountno, setAccountno] = useState("");
  const [payment, setPayment] = useState(null);
  const [employmentstatus, setEmploymentstatus] = useState(null);
  const [vechiletype, setVechiletype] = useState(null);

  const [loaderstatus, setLoaderstatus] = useState(false);
  const pubref = useRef();
  const hidref = useRef();

 
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
                    <div class="product_shadow bg_white p-4  mt-3  ">
                      <h2 className="fw-400 fs-2sm black mb-0">
                        Emergency Contact Information
                      </h2>
                      <label
                        htmlFor="short"
                        className="fs-xs fw-400 mt-3  black"
                      >
                        Name of Emergency Contact
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="name"
                        id="emergencycontact"
                        value={emergencycontact}
                        onChange={(e) => setEmergencycontact(e.target.value)}
                      />
                      <label
                        htmlFor="short"
                        className="fs-xs fw-400 mt-3  black"
                      >
                        Relationship to Employee
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="cousion, mom,dad & other’s"
                        id="relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                      />
                      <label
                        htmlFor="short"
                        className="fs-xs fw-400 mt-3  black"
                      >
                        Contact Phone Number
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="+92 XXXXXXXXX"
                        id="phnno"
                        value={phnno}
                        onChange={(e) => setPhnno(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Col>

              <Col xxl={4}>
                {/* Status */}
                <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Job Title ( Delivery Man )
                    </h2>
                    <label htmlFor="short" className="fs-xs fw-400 mt-3  black">
                      Start Date
                    </label>
                    <br />
                    <input
                      type="date"
                      required
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="22 /02/24"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0 pt-3 mt-3">
                      Identifaction
                    </h2>
                    <div className="d-flex align-items-center">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-5 w-50">
                        <label className="check fw-400 fs-sm black mb-0">
                          Govt ID
                          <input
                            type="radio"
                            checked={!freeDelivery}
                            onChange={() => setFreeDelivery(false)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-5 w-50">
                        <label className="check fw-400 fs-sm black mb-0">
                          Social Security
                          <input
                            type="radio"
                            checked={freeDelivery}
                            onChange={() => setFreeDelivery(true)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>

                    {freeDelivery ? (
                      <div>
                        <label
                          htmlFor="social"
                          className="fs-xs fw-400 mt-4 black"
                        >
                          Fill your Social Security Identity
                        </label>
                        <br />
                        <input
                          type="text"
                          required
                          className="mt-2 product_input fade_grey fw-400"
                          placeholder="Rashan card ( XXXXXXXXXXX )"
                          id="social"
                          value={social}
                          onChange={(e) => setSocial(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <label
                          htmlFor="govt"
                          className="fs-xs fw-400 mt-4 black"
                        >
                          Fill your any government ID
                        </label>
                        <br />
                        <input
                          type="text"
                          required
                          className="mt-2 product_input fade_grey fw-400"
                          placeholder="XXXXXXXXXXX"
                          id="govt"
                          value={govt}
                          onChange={(e) => setGovt(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0 pt-3">
                      Employment Status
                    </h2>
                    <div className="d-flex align-items-center mt-3">
                      <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          PartTime
                          <input
                            onChange={() => setEmploymentstatus("parttime")}
                            type="radio"
                            checked={employmentstatus === "parttime"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          FullTime
                          <input
                            onChange={() => setEmploymentstatus("fulltime")}
                            type="radio"
                            checked={employmentstatus === "fulltime"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          Contract
                          <input
                            onChange={() => setEmploymentstatus("Contract")}
                            type="radio"
                            checked={employmentstatus === "Contract"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product_shadow bg_white p-3 mt-3 ">
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Vechile Information
                    </h2>
                    <label htmlFor="short" className="fs-xs fw-400 mt-3  black">
                      Vehicle Regerstration Number
                    </label>
                    <br />
                    <input
                      type="text"
                      required
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="xxxxxxxxxxxx"
                      id="vechileno"
                      value={vechileno}
                      onChange={(e) => setVechileno(e.target.value)}
                    />
                    <label htmlFor="short" className="fs-xs fw-400 mt-3  black">
                      Insurance detail
                    </label>
                    <br />
                    <input
                      type="text"
                      required
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="xxxxxxxxxxxx"
                      id="insurance"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                    />
                    <div>
                      <h2 className="fw-400 fs-2sm black mb-0 pt-3 mt-3">
                        Type of Vehicle
                      </h2>
                      <div className="d-flex align-items-center mt-3">
                        <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                          <label className="check fw-400 fs-sm black mb-0">
                            Car
                            <input
                              onChange={() => setVechiletype("Car")}
                              type="radio"
                              checked={vechiletype === "Car"}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                          <label className="check fw-400 fs-sm black mb-0">
                            Motor cycle
                            <input
                              onChange={() => setVechiletype("motorcycle")}
                              type="radio"
                              checked={vechiletype === "motorcycle"}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                          <label className="check fw-400 fs-sm black mb-0">
                            Bicycle
                            <input
                              onChange={() => setVechiletype("Bicycle")}
                              type="radio"
                              checked={vechiletype === "ContraBicyclect"}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
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

import React, { useState, useEffect } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import addicon from "../../Images/svgs/addicon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import { useProductsContext } from "../../context/productgetter";
import { useSubCategories } from "../../context/categoriesGetter";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { useUserAuth } from "../../context/Authcontext";

const AddDeliveryMan = () => {
  const { userData } = useUserAuth()






  function RandomPasswordGenerator() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password
  }


  function RandomDeliveryGenerator() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 6;
    var d_id = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      d_id += chars.substring(randomNumber, randomNumber + 1);
    }
    return `DLVRY-${d_id}`
  }




  const auth = getAuth();


  const [oldUserEmail, setoldUserEmail] = useState('')
  const [oldUserPassword, setoldUserPassword] = useState('')

  useEffect(() => {
    setoldUserEmail(userData.Email)
    setoldUserPassword(userData.Password)

  }, [])








  const [name, setName] = useState("");
  const [address, setaddress] = useState("");
  const [emergencycontact, setEmergencycontact] = useState("");
  const [phnno, setPhnno] = useState("");
  const [kycType, setKycType] = useState("AADHARCARD");
  const [govt, setGovt] = useState("");
  const [social, setSocial] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [vechileno, setVechileno] = useState("");
  const [dl_number, setdl_number] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bankname, setBankname] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [nameaccount, setNameaccount] = useState("");
  const [DOB, setDOB] = useState("");
  const [mobile, setMobile] = useState("");
  const [confirmaccountno, setConfirmaccountno] = useState("");
  const [accountno, setAccountno] = useState("");
  const [employmentstatus, setEmploymentstatus] = useState("FULLTIME");
  const [vechiletype, setVechiletype] = useState("4 WHEELER");
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [email, setEmail] = useState('')
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e) => {

    setSelectedOption(e.target.value);
  };
  async function handlesave(e) {
    setLoaderstatus(true)
    e.preventDefault();
    let DeliveryManData = {
      basic_info: {
        name: name,
        dob: new Date(DOB).toISOString(),
        phone_no: mobile,
        address: address,
        city: city,
        state: state,
        email: email,
        emergency_contact: {
          name: emergencycontact,
          relationship: relationship,
          phone_no: phnno
        }
      },
      bank: {
        account_no: accountno,
        bank_name: bankname,
        ifsc_code: ifsc,
        account_holder_name: nameaccount,
      },
      job_info: {
        joining_date: new Date(date).toISOString(),
        employement_type: selectedOption,
        shift: employmentstatus
      },
      kyc: {
        document_type: kycType,
        document_number: govt
      },
      vehicle: {
        dl_number: dl_number,
        vehicle_number: vechileno,
        vehicle_type: vechiletype
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isVerified: true,
      signInMethod: "email",
      status: "online",
      d_id: RandomDeliveryGenerator()
    }

    // try {
    //   let userUuid


    //   // create delivery man  in authentication 
    //   createUserWithEmailAndPassword(auth, email, RandomPasswordGenerator())
    //     .then((userCredential) => {

    //       const user = userCredential.user;
    //       console.log("user is ", user)
    //       userUuid = user.uid;
    //       // ...
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       console.log("Error in create user ", errorMessage)
    //     });

    //   let deliveryRef = doc(db, 'Delivery', userUuid)
    //   await setDoc(deliveryRef, DeliveryManData);
    //   setLoaderstatus(false)
    //   toast.success("DeliverMan added Successfully !", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });


    // } catch (error) {
    //   setLoaderstatus(false)
    //   console.log("Error in Delivery man added ", error)
    // }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, RandomPasswordGenerator());
      const user = userCredential.user;
      console.log("user is ", user);
      DeliveryManData.uid = user.uid;

      let deliveryRef = doc(db, 'Delivery', user.uid);
      await setDoc(deliveryRef, DeliveryManData);


      setLoaderstatus(false);
      toast.success("DeliveryMan added Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      await signInWithEmailAndPassword(auth, oldUserEmail, oldUserPassword)
    } catch (error) {
      setLoaderstatus(false);
      console.log("Error in Delivery man added ", error);
    }
    handleReset()
  }

  function handleReset() {
    setKycType("AADHARCARD")
    setPhnno("")
    setEmergencycontact("")
    setaddress("")
    setName("")
    setCity("")
    setDate("")
    setSocial("")
    setGovt("")
    setBankname("")
    setRelationship("")
    setdl_number("")
    setVechileno("")
    setState("")
    setMobile("")
    setDOB("")
    setNameaccount("")
    setIfsc("")
    setVechiletype("4 WhEELER")
    setEmploymentstatus("FULLTIME")
    setAccountno("")
    setConfirmaccountno("")
    setMobile("")
    setEmail('')

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
                <div>
                  <div>
                    {/* Ist-box  */}
                    <div class="product_shadow bg_white p-3 pb-0 ">
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
                      <div className="row ">
                        <div className="col-3">
                          <label className="fs-xs fw-400 mt-3 black">
                            Date of Birth
                          </label>
                          <br />
                          <input
                            type="date"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="DOB"
                            id="DOB"
                            value={DOB}
                            onChange={(e) => setDOB(e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <label className="fs-xs fw-400 mt-3 black">
                            Phone
                          </label>
                          <br />
                          <input
                            type="number"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="+91 XXXXXXXXX"
                            id="mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                        <div className="col-5">
                          <label className="fs-xs fw-400 mt-3 black">
                            Email
                          </label>
                          <br />
                          <input
                            type="email"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="email@gmail.com"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                      <div className="row">
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            City
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="Select City"
                            id="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            State
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="Select State"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                          />
                        </div>
                      </div>
                      <h2 className="fw-400 fs-2sm black mb-0 mt-3">
                        Bank Detail’s
                      </h2>
                      <label className="fs-xs fw-400 mt-3  black">
                        Name in Bank Account
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="Enter Account Holder Name "
                        id="nameaccount"
                        value={nameaccount}
                        onChange={(e) => setNameaccount(e.target.value)}
                      />
                      <div className="row">
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3  black">
                            Bank name
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="Enter Bank Name"
                            id="bankname"
                            value={bankname}
                            onChange={(e) => setBankname(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          {" "}
                          <label className="fs-xs fw-400 mt-3  black">
                            IFSC Code
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="Enter IFSC"
                            id="ifsc"
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center pb-4">
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Account Number
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="xxxx xxxx xxxx xxxx"
                            id="accountno"
                            value={accountno}
                            onChange={(e) => setAccountno(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="fs-xs fw-400 mt-3 black">
                            Confirm Account Number
                          </label>
                          <br />
                          <input
                            type="text"
                            required
                            className="mt-2 product_input fade_grey fw-400"
                            placeholder="xxxx xxxx xxxx xxxx"
                            id="confirmaccountno"
                            value={confirmaccountno}
                            onChange={(e) =>
                              setConfirmaccountno(e.target.value)
                            }
                          />
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
                        placeholder="+91 XXXXXXXXX"
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
                      Joining Date
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
                    <h2 className="fw-400 fs-2sm black mb-0 pt-3">
                      Employment Type
                    </h2>

                    <select
                      value={selectedOption}
                      onChange={handleOptionChange}
                      className="mt-2 product_input fade_grey fw-400"
                    >
                      <option className="option-commission" value="COMMISSION">Commission</option>
                      <option className="option-salaried" value="SALARIED">Salaried</option>
                    </select>

                    <div className="d-flex align-items-center mt-3 justify-content-between">
                      <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          PartTime
                          <input
                            onChange={() => setEmploymentstatus("PARTTIME")}
                            type="radio"
                            checked={employmentstatus === "PARTTIME"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          FullTime
                          <input
                            onChange={() => setEmploymentstatus("FULLTIME")}
                            type="radio"
                            checked={employmentstatus === "FULLTIME"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product_shadow bg_white p-3 mt-3 ">
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0">KYC Documents</h2>
                    <div>
                      <div className="d-flex align-items-center">
                        <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-5 w-50">
                          <label className="check fw-400 fs-sm black mb-0">
                            Aadhar Card
                            <input
                              type="radio"
                              checked={kycType === "AADHARCARD"}
                              onChange={() => setKycType("AADHARCARD")}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-5 w-50">
                          <label className="check fw-400 fs-sm black mb-0">
                            Votor Card
                            <input
                              type="radio"
                              checked={kycType === "VOTERIDCARD"}
                              onChange={() => setKycType("VOTERIDCARD")}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>

                      {kycType === "VOTERIDCARD" ? (
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
                            placeholder=" votercard ( XXXXXXXXXXX )"
                            id="social"
                            value={govt}
                            onChange={(e) => setGovt(e.target.value)}
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
                            placeholder="aadhar card ( XXXXXXXXXXX )"
                            id="govt"
                            value={govt}
                            onChange={(e) => setGovt(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="product_shadow bg_white p-3 mt-3 ">
                  <div>
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Vechile Information
                    </h2>

                    <label htmlFor="short" className="fs-xs fw-400 mt-3  black">
                      Driving License Number
                    </label>
                    <br />
                    <input
                      type="text"
                      required
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="xxxxxxxxxxxx"
                      id="insurance"
                      value={dl_number}
                      onChange={(e) => setdl_number(e.target.value)}
                    />
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
                    <div>
                      <h2 className="fw-400 fs-2sm black mb-0 pt-3 mt-3">
                        Type of Vehicle
                      </h2>
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                          <label className="check fw-400 fs-sm black mb-0">
                            4 Wheeler
                            <input
                              onChange={() => setVechiletype("4 WHEELER")}
                              type="radio"
                              checked={vechiletype === "4 WHEELER"}
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                        <div className="mt-3 mx-2 py-1 d-flex align-items-center gap-3">
                          <label className="check fw-400 fs-sm black mb-0">
                            2 Wheeler
                            <input
                              onChange={() => setVechiletype("2 WHEELER")}
                              type="radio"
                              checked={vechiletype === "2 WHEELER"}
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

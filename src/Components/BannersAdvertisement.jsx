import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SearchIcon from "../Images/svgs/search.svg";
import deleteicon from "../Images/svgs/deleteicon.svg";
import uploadIcon from '../Images/svgs/upload.svg'
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const BannersAdvertisement = ({ setOpen, open }) => {

async function imageSet(file){
   try {
    const name=  Math.floor(Date.now() / 1000)+"-" + file.name
    const storageRef = ref(storage, `banner/${file.name}` );
    const uploadTask = await uploadBytesResumable(storageRef, file);
   const url= await getDownloadURL(storageRef)
      console.log(url)
    
    
   } catch (error) {
    console.log(error)
   }
  }


  const [imageUpload1, setImageUpload1] = useState();
  const [imageUploadUrl1, setImageUploadUrl1] = useState();
  function handelUpload1(e) {
    setImageUpload1(e.target.files[0]);
   


  }
  function handeldelete1() {
    setImageUpload1(null);
  }

  function imageSet1(){
    imageSet(imageUpload1)
  }
  // 2
  const [imageUpload2, setImageUpload2] = useState("");
  function handelUpload2(e) {
    setImageUpload2(e.target.files[0]);
  }
  function handeldelete2() {
    setImageUpload2(null);
  }
  // 3
  const [imageUpload3, setImageUpload3] = useState("");
  function handelUpload3(e) {
    setImageUpload3(e.target.files[0]);
  }
  function handeldelete3() {
    setImageUpload3(null);
  }
  // 4
  const [imageUpload4, setImageUpload4] = useState("");
  function handelUpload4(e) {
    setImageUpload4(e.target.files[0]);
  }
  function handeldelete4() {
    setImageUpload4(null);
  }
  // 5
  const [imageUpload5, setImageUpload5] = useState("");
  function handelUpload5(e) {
    setImageUpload5(e.target.files[0]);
  }
  function handeldelete5() {
    setImageUpload5(null);
  }
  // 6
  const [imageUpload6, setImageUpload6] = useState("");
  function handelUpload6(e) {
    setImageUpload6(e.target.files[0]);
  }
  function handeldelete6() {
    setImageUpload6(null);
  }
  // 7
  const [imageUpload7, setImageUpload7] = useState("");
  function handelUpload7(e) {
    setImageUpload7(e.target.files[0]);
  }
  function handeldelete7() {
    setImageUpload7(null);
  }
  // 8
  const [imageUpload8, setImageUpload8] = useState("");
  function handelUpload8(e) {
    setImageUpload8(e.target.files[0]);
  }
  function handeldelete8() {
    setImageUpload8(null);
  }
  // 9
  const [imageUpload9, setImageUpload9] = useState("");
  function handelUpload9(e) {
    setImageUpload9(e.target.files[0]);
  }
  function handeldelete9() {
    setImageUpload9(null);
  }
  // 10
  const [imageUpload10, setImageUpload10] = useState("");
  function handelUpload10(e) {
    setImageUpload10(e.target.files[0]);
  }
  function handeldelete10() {
    setImageUpload10(null);
  }
  // 11
  const [imageUpload11, setImageUpload11] = useState("");
  function handelUpload11(e) {
    setImageUpload11(e.target.files[0]);
  }
  function handeldelete11() {
    setImageUpload11(null);
  }
  // 12
  const [imageUpload12, setImageUpload12] = useState("");
  function handelUpload12(e) {
    setImageUpload12(e.target.files[0]);
  }
  function handeldelete12() {
    setImageUpload12(null);
  }
  // 13
  const [imageUpload13, setImageUpload13] = useState("");
  function handelUpload13(e) {
    setImageUpload13(e.target.files[0]);
  }
  function handeldelete13() {
    setImageUpload13(null);
  }
  // 14
  const [imageUpload14, setImageUpload14] = useState("");
  function handelUpload14(e) {
    setImageUpload14(e.target.files[0]);
  }
  function handeldelete14() {
    setImageUpload14(null);
  }
  // 15
  const [imageUpload15, setImageUpload15] = useState("");
  function handelUpload15(e) {
    setImageUpload15(e.target.files[0]);
  }
  function handeldelete15() {
    setImageUpload15(null);
  }
  // 16
  const [imageUpload16, setImageUpload16] = useState("");
  function handelUpload16(e) {
    setImageUpload16(e.target.files[0]);
  }
  function handeldelete16() {
    setImageUpload16(null);
  }
  // 17
  const [imageUpload17, setImageUpload17] = useState("");
  function handelUpload17(e) {
    setImageUpload17(e.target.files[0]);
  }
  function handeldelete17() {
    setImageUpload17(null);
  }
  // 18
  const [imageUpload18, setImageUpload18] = useState("");
  function handelUpload18(e) {
    setImageUpload18(e.target.files[0]);
  }
  function handeldelete18() {
    setImageUpload18(null);
  }
  // 19
  const [imageUpload19, setImageUpload19] = useState("");
  function handelUpload19(e) {
    setImageUpload19(e.target.files[0]);
  }
  function handeldelete19() {
    setImageUpload19(null);
  }
  // 20
  const [imageUpload20, setImageUpload20] = useState("");
  function handelUpload20(e) {
    setImageUpload20(e.target.files[0]);
  }
  function handeldelete20() {
    setImageUpload20(null);
  }
  // 21
  const [imageUpload21, setImageUpload21] = useState("");
  function handelUpload21(e) {
    setImageUpload21(e.target.files[0]);
  }
  function handeldelete21() {
    setImageUpload21(null);
  }
  return (
    <div className="main_panel_wrapper pb-2  bg_light_grey w-100 d-flex flex-column">
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
          <h1 className="fw-500  mb-0 black fs-lg">Banners / Advertisement</h1>
          {/* NEW PRODUCT DETAILSS  */}

          <Row className="mt-3 pt-1 ">
            {/*Single Medium Banner */}
            <Col lg={6}>
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">
                  Single Medium Banner
                </h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file1"
                    onChange={handelUpload1}
                    hidden
                  />

                  {!imageUpload1 ? (
                    <label
                      htmlFor="file1"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload1 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload1)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete1}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                        <img
                          onClick={imageSet1}
                          className="position-absolute upload_btn mt-2 me-2 cursor_pointer"
                          src={uploadIcon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Single Large Banner */}
            <Col lg={6} className="mt-3 mt-lg-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Large Banner</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file2"
                    onChange={handelUpload2}
                    hidden
                  />

                  {!imageUpload2 ? (
                    <label
                      htmlFor="file2"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload2 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload2)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete2}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Single Small Banner*/}
            <Col lg={12} className="mt-3">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Small Banner</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file3"
                    onChange={handelUpload3}
                    hidden
                  />

                  {!imageUpload3 ? (
                    <label
                      htmlFor="file3"
                      className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload3 && (
                      <div className="position-relative imagesmallmedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload3)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete3}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
          </Row>
          {/* Banner Slider 1 */}
          <h2 className="fw-400 fs-sm black mb-0 mt-3 pt-1">Banner Slider 1</h2>
          <Row className="mt-3  pt-1">
            {/*Banner 1 */}
            <Col lg={6} xxl={4} className="mt-0  mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 1</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file4"
                    onChange={handelUpload4}
                    hidden
                  />

                  {!imageUpload4 ? (
                    <label
                      htmlFor="file4"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload4 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload4)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete4}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 2 */}
            <Col lg={6} xxl={4} className="mt-3 mt-lg-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 2</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file5"
                    onChange={handelUpload5}
                    hidden
                  />

                  {!imageUpload5 ? (
                    <label
                      htmlFor="file5"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload5 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload5)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete5}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 3 */}
            <Col lg={6} xxl={4} className="mt-3 mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 3</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file6"
                    onChange={handelUpload6}
                    hidden
                  />

                  {!imageUpload6 ? (
                    <label
                      htmlFor="file6"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload6 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload6)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete6}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
          </Row>
          {/* Banner Slider 2 */}
          <h2 className="fw-400 fs-sm black mb-0 mt-3 pt-1">Banner Slider 2</h2>
          <Row className="mt-3 pt-1">
            {/*Banner 1 */}
            <Col lg={6} xxl={4} className="mt-0  mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 1</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file7"
                    onChange={handelUpload7}
                    hidden
                  />

                  {!imageUpload7 ? (
                    <label
                      htmlFor="file7"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload7 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload7)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete7}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 2 */}
            <Col lg={6} xxl={4} className="mt-3 mt-lg-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 2</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file8"
                    onChange={handelUpload8}
                    hidden
                  />

                  {!imageUpload8 ? (
                    <label
                      htmlFor="file8"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload8 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload8)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete8}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 3 */}
            <Col lg={6} xxl={4} className="mt-3 mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 3</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file9"
                    onChange={handelUpload9}
                    hidden
                  />

                  {!imageUpload9 ? (
                    <label
                      htmlFor="file9"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload9 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload9)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete9}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Single Small Banner*/}
            <Col lg={12} className="mt-3">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Small Banner</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file10"
                    onChange={handelUpload10}
                    hidden
                  />

                  {!imageUpload10 ? (
                    <label
                      htmlFor="file10"
                      className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload10 && (
                      <div className="position-relative imagesmallmedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload10)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete10}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
          </Row>
          {/* Banner Slider 3 */}
          <h2 className="fw-400 fs-sm black mb-0 mt-3 pt-1">Banner Slider 3</h2>
          <Row className="mt-3 pt-1">
            {/*Banner 1 */}
            <Col lg={6} xxl={4} className="mt-0  mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 1</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file11"
                    onChange={handelUpload11}
                    hidden
                  />

                  {!imageUpload11 ? (
                    <label
                      htmlFor="file11"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload11 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload11)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete11}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 2 */}
            <Col lg={6} xxl={4} className="mt-3 mt-lg-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 2</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file12"
                    onChange={handelUpload12}
                    hidden
                  />

                  {!imageUpload12 ? (
                    <label
                      htmlFor="file12"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload12 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload12)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete12}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 3 */}
            <Col lg={6} xxl={4} className="mt-3 mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 3</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file13"
                    onChange={handelUpload13}
                    hidden
                  />

                  {!imageUpload13 ? (
                    <label
                      htmlFor="file13"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload13 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload13)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete13}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            <h2 className="fw-400 fs-sm black mb-0 mt-3 pt-1">
              Animal Supplements Banners
            </h2>
            {/*Banner 1 */}
            <Col lg={6} xxl={4} className="mt-3  ">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 1</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file14"
                    onChange={handelUpload14}
                    hidden
                  />

                  {!imageUpload14 ? (
                    <label
                      htmlFor="file14"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload14 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload14)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete14}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 2 */}
            <Col lg={6} xxl={4} className="mt-3 ">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 2</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file15"
                    onChange={handelUpload15}
                    hidden
                  />

                  {!imageUpload15 ? (
                    <label
                      htmlFor="file15"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload15 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload15)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete15}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 3 */}
            <Col lg={6} xxl={4} className="mt-3 ">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 3</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file16"
                    onChange={handelUpload16}
                    hidden
                  />

                  {!imageUpload16 ? (
                    <label
                      htmlFor="file16"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload16 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload16)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete16}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/* Single Medium Banner */}
            <Col lg={6} xxl={4} className="mt-3">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">
                  Single Medium Banner
                </h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file17"
                    onChange={handelUpload17}
                    hidden
                  />

                  {!imageUpload17 ? (
                    <label
                      htmlFor="file17"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload17 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload17)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete17}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>{" "}
          </Row>
          {/* Banner Slider 4 */}
          <h2 className="fw-400 fs-sm black mb-0 mt-3 pt-1">Banner Slider 4</h2>
          <Row className="mt-3 pt-1">
            {/*Banner 1 */}
            <Col lg={6} xxl={4} className="mt-0  mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 1</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file18"
                    onChange={handelUpload18}
                    hidden
                  />

                  {!imageUpload18 ? (
                    <label
                      htmlFor="file18"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload18 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload18)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete18}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 2 */}
            <Col lg={6} xxl={4} className="mt-3 mt-lg-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 2</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file19"
                    onChange={handelUpload19}
                    hidden
                  />

                  {!imageUpload19 ? (
                    <label
                      htmlFor="file19"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload19 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload19)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete19}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Banner 3 */}
            <Col lg={6} xxl={4} className="mt-3 mt-xxl-0">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner 3</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file20"
                    onChange={handelUpload20}
                    hidden
                  />

                  {!imageUpload20 ? (
                    <label
                      htmlFor="file20"
                      className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload20 && (
                      <div className="position-relative imagemedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload20)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete20}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
            {/*Single Small Banner*/}
            <Col lg={12} className="mt-3">
              <div className=" rounded bg_white p-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Small Banner</h2>
                <form className="mt-2 pt-1">
                  <input
                    type="file"
                    id="file21"
                    onChange={handelUpload21}
                    hidden
                  />

                  {!imageUpload21 ? (
                    <label
                      htmlFor="file21"
                      className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                    >
                      + Add Media
                    </label>
                  ) : (
                    imageUpload21 && (
                      <div className="position-relative imagesmallmedia_btn">
                        <img
                          className="w-100 h-100 object-fit-cover"
                          src={URL.createObjectURL(imageUpload21)}
                          alt=""
                        />
                        <img
                          onClick={handeldelete21}
                          className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    )
                  )}
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BannersAdvertisement;

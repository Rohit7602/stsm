import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Col, Row } from 'react-bootstrap';
import SearchIcon from '../Images/svgs/search.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import uploadIcon from '../Images/svgs/upload.svg';
import checkBlack from '../Images/svgs/check_black_icon.svg';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const BannersAdvertisement = () => {
  async function imageSet(file) {
    try {
      const name = Math.floor(Date.now() / 1000) + '-' + file.name;
      const storageRef = ref(storage, `banner/${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(url);
    } catch (error) {
      console.log(error);
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

  function imageSet1() {
    imageSet(imageUpload1);
  }
  function handelBannnersImg(e) {
    e.preventDefault();
    console.log(imageUpload1)
  }

  // 2
  const [imageUpload2, setImageUpload2] = useState('');
  function handelUpload2(e) {
    setImageUpload2(e.target.files[0]);
  }
  function handeldelete2() {
    setImageUpload2(null);
  }
  // 3
  const [imageUpload3, setImageUpload3] = useState('');
  function handelUpload3(e) {
    setImageUpload3(e.target.files[0]);
  }
  function handeldelete3() {
    setImageUpload3(null);
  }
  // 4
  const [imageUpload4, setImageUpload4] = useState('');
  function handelUpload4(e) {
    setImageUpload4(e.target.files[0]);
  }
  function handeldelete4() {
    setImageUpload4(null);
  }
  // 5
  const [imageUpload5, setImageUpload5] = useState('');
  function handelUpload5(e) {
    setImageUpload5(e.target.files[0]);
  }
  function handeldelete5() {
    setImageUpload5(null);
  }
  // 6
  const [imageUpload6, setImageUpload6] = useState('');
  function handelUpload6(e) {
    setImageUpload6(e.target.files[0]);
  }
  function handeldelete6() {
    setImageUpload6(null);
  }
  // 7
  const [imageUpload7, setImageUpload7] = useState('');
  function handelUpload7(e) {
    setImageUpload7(e.target.files[0]);
  }
  function handeldelete7() {
    setImageUpload7(null);
  }
  // 8
  const [imageUpload8, setImageUpload8] = useState('');
  function handelUpload8(e) {
    setImageUpload8(e.target.files[0]);
  }
  function handeldelete8() {
    setImageUpload8(null);
  }
  // 9
  const [imageUpload9, setImageUpload9] = useState('');
  function handelUpload9(e) {
    setImageUpload9(e.target.files[0]);
  }
  function handeldelete9() {
    setImageUpload9(null);
  }
  // 10
  const [imageUpload10, setImageUpload10] = useState('');
  function handelUpload10(e) {
    setImageUpload10(e.target.files[0]);
  }
  function handeldelete10() {
    setImageUpload10(null);
  }
  // 11
  const [imageUpload11, setImageUpload11] = useState('');
  function handelUpload11(e) {
    setImageUpload11(e.target.files[0]);
  }
  function handeldelete11() {
    setImageUpload11(null);
  }
  // 12
  const [imageUpload12, setImageUpload12] = useState('');
  function handelUpload12(e) {
    setImageUpload12(e.target.files[0]);
  }
  function handeldelete12() {
    setImageUpload12(null);
  }
  // 13
  const [imageUpload13, setImageUpload13] = useState('');
  function handelUpload13(e) {
    setImageUpload13(e.target.files[0]);
  }
  function handeldelete13() {
    setImageUpload13(null);
  }
  // 14
  const [imageUpload14, setImageUpload14] = useState('');
  function handelUpload14(e) {
    setImageUpload14(e.target.files[0]);
  }
  function handeldelete14() {
    setImageUpload14(null);
  }
  // 15
  const [imageUpload15, setImageUpload15] = useState('');
  function handelUpload15(e) {
    setImageUpload15(e.target.files[0]);
  }
  function handeldelete15() {
    setImageUpload15(null);
  }
  // 16
  const [imageUpload16, setImageUpload16] = useState('');
  function handelUpload16(e) {
    setImageUpload16(e.target.files[0]);
  }
  function handeldelete16() {
    setImageUpload16(null);
  }
  // 17
  const [imageUpload17, setImageUpload17] = useState('');
  function handelUpload17(e) {
    setImageUpload17(e.target.files[0]);
  }
  function handeldelete17() {
    setImageUpload17(null);
  }
  // 18
  const [imageUpload18, setImageUpload18] = useState('');
  function handelUpload18(e) {
    setImageUpload18(e.target.files[0]);
  }
  function handeldelete18() {
    setImageUpload18(null);
  }
  // 19
  const [imageUpload19, setImageUpload19] = useState('');
  function handelUpload19(e) {
    setImageUpload19(e.target.files[0]);
  }
  function handeldelete19() {
    setImageUpload19(null);
  }
  // 20
  const [imageUpload20, setImageUpload20] = useState('');
  function handelUpload20(e) {
    setImageUpload20(e.target.files[0]);
  }
  function handeldelete20() {
    setImageUpload20(null);
  }
  // 21
  const [imageUpload21, setImageUpload21] = useState('');
  function handelUpload21(e) {
    setImageUpload21(e.target.files[0]);
  }
  function handeldelete21() {
    setImageUpload21(null);
  }
  return (
    <div className="main_panel_wrapper pb-2  bg_light_grey w-100">
      <form onSubmit={handelBannnersImg}>
        <div className="banner_advertisement">
          <div className=" d-flex align-items-center justify-content-between  mt-4">
            <h1 className="fw-500  mb-0 black fs-lg">Banners / Advertisement</h1>
            <button className="update_banners_btn d-flex align-items-center">
              <img src={checkBlack} alt="checkBlack" />
              <p className="fs-sm fw-400 black ms-2 mb-0">Update Banners</p>
            </button>
          </div>

          <Accordion className="border-0  w-100 rounded-none">
            <Accordion.Item className="py-1 bg-white" eventKey="0">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Large Banner</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Medium Banner</h2>

                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input type="file" id="file1" onChange={handelUpload1} hidden />

                    {!imageUpload1 ? (
                      <label
                        htmlFor="file1"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                  {/*Single Large Banner */}
                  <div className="mt-3 mt-lg-0">
                    <div className="bg_white ps-2">
                      <input type="file" id="file2" onChange={handelUpload2} hidden />

                      {!imageUpload2 ? (
                        <label
                          htmlFor="file2"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="1">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Sales / Offers</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner Slider 1</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input type="file" id="file4" onChange={handelUpload4} hidden />

                    {!imageUpload4 ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="2">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Small Patti Banner</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Single Small Banner</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2 justify-content-between">
                  {/*Single Medium Banner */}
                  <div className="bg_white">
                    <input type="file" id="file3" onChange={handelUpload3} hidden />

                    {!imageUpload3 ? (
                      <label
                        htmlFor="file3"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
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
                  </div>
                  <div className="bg_white">
                    <input type="file" id="file3" onChange={handelUpload3} hidden />

                    {!imageUpload3 ? (
                      <label
                        htmlFor="file3"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
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
                  </div>
                  <div className="bg_white">
                    <input type="file" id="file3" onChange={handelUpload3} hidden />

                    {!imageUpload3 ? (
                      <label
                        htmlFor="file3"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="3">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Animal Suppliments</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner Slider 1</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                  {/*Single Medium Banner */}
                  <div className="bg_white">
                    <input type="file" id="file4" onChange={handelUpload4} hidden />

                    {!imageUpload4 ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <p className="fs-sm fw-700 black pt-1 mt-3">Categorized Banners</p>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="4">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Slider for Men</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner Slider 1</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                  {/*Single Medium Banner */}
                  <div className="bg_white">
                    <input type="file" id="file4" onChange={handelUpload4} hidden />

                    {!imageUpload4 ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="5">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Slider for Women</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner Slider 1</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                  {/*Single Medium Banner */}
                  <div className="bg_white">
                    <input type="file" id="file4" onChange={handelUpload4} hidden />

                    {!imageUpload4 ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="py-1 bg-white rounded" eventKey="6">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Slider for Electronics</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <h2 className="fw-400 fs-sm black mb-0">Banner Slider 1</h2>
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                  {/*Single Medium Banner */}
                  <div className="bg_white">
                    <input type="file" id="file4" onChange={handelUpload4} hidden />

                    {!imageUpload4 ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
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
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </form>
    </div>
  );
};

export default BannersAdvertisement;

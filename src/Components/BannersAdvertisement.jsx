import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Col, Row } from 'react-bootstrap';
import SearchIcon from '../Images/svgs/search.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import uploadIcon from '../Images/svgs/upload.svg';
import checkBlack from '../Images/svgs/check_black_icon.svg';
import { ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { db, storage } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';


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


  /**  *************************************************
      fecthing categories here 
    *************************************************
   */
  const [MainCategories, SetMainCategories] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        SetMainCategories([...list]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);






  /**  *************************************************
      fecthing categories end  here 
    *************************************************
   */





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

            {/*  Large Banner Accordian  */}

            <Accordion.Item className="py-1 bg-white" eventKey="0">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Large Banner</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">

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

            {/*  Slider and Sales  Banner Accordian  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="1">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Sales / Offers</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
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

            {/* Small Patti   Banner Accordian  */}

            <Accordion.Item className="py-1 bg-white rounded" eventKey="2">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Small Patti Banner</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
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


            {/* Animal Suplliments   Banner Accordian  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="3">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Animal Suppliments</h3>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
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

            {/*  Categories Banner start from here  */}
            <p className="fs-sm fw-700 black pt-1 mt-3">Categorized Banners</p>
          
              {MainCategories.map((value, index) => {
                return (
                  <Accordion.Item className="py-1 bg-white rounded" eventKey={index}>
                    <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                      <h3 className="fs-sm fw-400  black mb-0">{value.title}</h3>
                    </Accordion.Header>
                    <Accordion.Body className="py-2 px-3">
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
                )
              })}
            

          </Accordion>
        </div>
      </form>
    </div>
  );
};

export default BannersAdvertisement;

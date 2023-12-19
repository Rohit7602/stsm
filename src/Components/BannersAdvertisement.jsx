import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import saveicon from '../Images/svgs/saveicon.svg';


import { Col, Row } from 'react-bootstrap';
import SearchIcon from '../Images/svgs/search.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import uploadIcon from '../Images/svgs/upload.svg';
import checkBlack from '../Images/svgs/check_black_icon.svg';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



//  banner advertisement up start from here
// check accordian and save button


const BannersAdvertisement = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordionSelect = (key) => {
    setActiveAccordion(key);
  };

  /** *******************************************************
     Fetching main categoreis 
  */

  const [MainCategories, SetMainCategories] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
        });
        SetMainCategories([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  /** *******************************************************
     Fetching main categoreis  end 
  */







  /*
 *********************************************************
 Large Banner   functionaltiy start from here 
 
 */


  const [selectedImagesLargeBanner, setSelectedImagesLargeBanner] = useState([null, null]);

  const handleUploadLargeBanner = (index, e) => {
    const newImages = [...selectedImagesLargeBanner];
    newImages[index] = e.target.files[0];
    setSelectedImagesLargeBanner(newImages);
  };

  const handleDeleteLargeBanner = (index) => {
    const newImages = [...selectedImagesLargeBanner];
    newImages[index] = null;
    setSelectedImagesLargeBanner(newImages);
  };


  async function handleSaveLargeBanner() {
    try {
      if (selectedImagesLargeBanner.length === 2 && selectedImagesLargeBanner.every(Boolean)) {
        const imagelinks = [];

        for await (const file of selectedImagesLargeBanner) {
          const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
          const storageRef = ref(storage, `banner/${filename}`);
          const upload = await uploadBytesResumable(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          imagelinks.push(imageUrl);
        }

        if (imagelinks.length > 0) {
          try {
            const docRef = await addDoc(collection(db, 'Banner'), {
              title: 'Large banner',
              imgUrl: imagelinks,
            });
            toast.success('Large Banner Added Successfully !', {
              position: toast.POSITION.TOP_RIGHT,
            });
            setSelectedImagesLargeBanner([null, null])

          } catch (error) {
            console.log(error)

          }
        } else {
          console.log("No images uploaded");
        }
      } else {
        console.log("Select both images before uploading");
      }
    } catch (error) {
      console.error(error);
    }
  }



  /*
 *********************************************************
 Large  Banner functionaltiy end  
 
 */




  /*  
  *******************************
  Small Patti Banner Added functionlaity  start from here 
  ************************************
  */
  const [selectedImagesSmallPatii, setselectedImagesSmallPatii] = useState([null, null, null]);

  const handleUploadSmallPatti = (index, e) => {
    const newImages = [...selectedImagesSmallPatii];
    newImages[index] = e.target.files[0];
    setselectedImagesSmallPatii(newImages);
  };

  const handleDeleteSmallPatti = (index) => {
    const newImages = [...selectedImagesSmallPatii];
    newImages[index] = null;
    setselectedImagesSmallPatii(newImages);
  };


  async function handleSaveSmallPattiBanner() {
    try {
      if (selectedImagesSmallPatii.length === 3 && selectedImagesSmallPatii.every(Boolean)) {
        const imagelinks = [];

        for await (const file of selectedImagesSmallPatii) {
          const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
          const storageRef = ref(storage, `banner/${filename}`);
          const upload = await uploadBytesResumable(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          imagelinks.push(imageUrl);
        }

        if (imagelinks.length > 0) {
          try {
            const docRef = await addDoc(collection(db, 'Banner'), {
              title: 'Small_Patti banner',
              imgUrl: imagelinks,
            });
            toast.success('SmallPatti Banner  Added Successfully !', {
              position: toast.POSITION.TOP_RIGHT,
            });
            setselectedImagesSmallPatii([null, null, null])

          } catch (error) {
            console.log(error)

          }
        } else {
          console.log("No images uploaded");
        }
      } else {
        console.log("Select all  images before uploading");
      }
    } catch (error) {
      console.error(error);
    }
  }



  /*
  *******************************
  Small Patti Banner Added functionlaity  end here 
  ************************************
  */




  /*
 *********************************************************
 Sales and offer   Banner functionaltiy start from here 
 
 */

  const [BannerSaleImg, SetBannerSaleImg] = useState('');
  function handelSaleBannerImg(e) {
    SetBannerSaleImg(e.target.files[0]);
  }
  function handeldeleteSaleBannerImg() {
    SetBannerSaleImg(null);
  }

  async function handleSaveBannerSliderSale() {
    try {
      if (BannerSaleImg) {
        const name = Math.floor(Date.now() / 1000) + '-' + BannerSaleImg.name;
        const storageRef = ref(storage, `banner/${name}`);
        const uploadTask = await uploadBytesResumable(storageRef, BannerSaleImg);
        const url = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, 'Banner'), {
          title: 'Sales/Offers',
          imgUrl: [url],
        });
        toast.success('Sale/Offer Banner Added   Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        SetBannerSaleImg(null)
      } else {
        console.warn('No image selected for upload');
      }
    } catch (error) {
      console.error('Error uploading image or adding document:', error);
    }
  }



  /*
 *********************************************************
 Sales and offer   Banner functionaltiy end   here 
 
 */




  /*  
  *********************************************************
  Animal And it's suplliments Banner functionaltiy start from here 
  
  */

  const [AnimalSuplimentsImages, SetAnimalSuplimentsImages] = useState('');
  function handelAnimalSuplimentImg(e) {

    SetAnimalSuplimentsImages(e.target.files[0]);
  }
  function handeldeleteAnimalSupliment() {
    SetAnimalSuplimentsImages(null);
  }


  async function HandleSaveAnimalSuppliments() {
    try {
      if (AnimalSuplimentsImages) {
        const name = Math.floor(Date.now() / 1000) + '-' + AnimalSuplimentsImages.name;
        const storageRef = ref(storage, `banner/${name}`);
        const uploadTask = await uploadBytesResumable(storageRef, AnimalSuplimentsImages);
        const url = await getDownloadURL(storageRef);
        try {
          const docRef = await addDoc(collection(db, 'Banner'), {
            title: 'AnimalSupliments ',
            imgUrl: [url],
          });
          toast.success('Animal Supliments  Banner Added   Successfully !', {
            position: toast.POSITION.TOP_RIGHT,
          });
          SetAnimalSuplimentsImages(null)

        } catch (error) {
          console.log("Error Adding Image To The Database", error);

        }
      } else {
        console.warn('No image selected for upload');
      }
    } catch (error) {
      console.error('Error uploading image or adding document:', error);
    }
  }


  /*
 *********************************************************
  Animal And it's suplliments Banner functionaltiy end from here 
 
 */

  /*
*********************************************************
 Categoroies  Banner functionaltiy start 
*/

  const [CategoryImage, SetCategoryImage] = useState(Array(MainCategories.length).fill(''));

  function handleCategoryImages(e, index) {
    const newCategoryImages = [...CategoryImage];
    newCategoryImages[index] = e.target.files[0];
    SetCategoryImage(newCategoryImages);
  }
  function handleCategoryImagesDelete(index) {
    const newCategoryImages = [...CategoryImage];
    newCategoryImages[index] = ''; // Set the image for the specified index to an empty string
    SetCategoryImage(newCategoryImages);
  }



  /*
*********************************************************
 Categoroies  Banner functionaltiy end 
 
*/



  return (
    <div className="main_panel_wrapper pb-2  bg_light_grey w-100">
      <form >
        <div className="banner_advertisement">
          <div className=" d-flex align-items-center justify-content-between  mt-4">
            <h1 className="fw-500  mb-0 black fs-lg">Banners / Advertisement</h1>
          </div>

          <Accordion
            className="border-0 w-100 rounded-none"
            activeKey={activeAccordion}
            onSelect={handleAccordionSelect}>
            <Accordion.Item className="py-1 bg-white" eventKey="0">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400 black mb-0">Large Banner</h3>
                  {activeAccordion === '0' ? (
                    <button onClick={handleSaveLargeBanner}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input type="file" id="largeBanner1" onChange={(e) => handleUploadLargeBanner(0, e)} hidden />

                    {!selectedImagesLargeBanner[0] ? (
                      <label
                        htmlFor="largeBanner1"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesLargeBanner[0] && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(selectedImagesLargeBanner[0])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteLargeBanner(0)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-3 mt-lg-0">
                    <div className="bg_white ps-2">
                      <input type="file" id="largeBanner2" onChange={(e) => handleUploadLargeBanner(1, e)} hidden />

                      {!selectedImagesLargeBanner[1] ? (
                        <label
                          htmlFor="largeBanner2"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        selectedImagesLargeBanner[1] && (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={URL.createObjectURL(selectedImagesLargeBanner[1])}
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteLargeBanner(1)}
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


            {/* Banner Slider for sales / offers  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="1">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Sales / Offers</h3>
                  {activeAccordion === '1' ? (
                    <button onClick={handleSaveBannerSliderSale}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input type="file" id="file4" onChange={handelSaleBannerImg} hidden />

                    {!BannerSaleImg ? (
                      <label
                        htmlFor="file4"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      BannerSaleImg && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(BannerSaleImg)}
                            alt=""
                          />
                          <img
                            onClick={handeldeleteSaleBannerImg}
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


            {/* small patti banners  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="2">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Small Patti Banner</h3>
                  {activeAccordion === '2' ? (
                    <button onClick={handleSaveSmallPattiBanner}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2 justify-content-between">
                  <div className="bg_white w-100">
                    <input type="file" id="smallPatti1" onChange={(e) => handleUploadSmallPatti(0, e)} hidden />

                    {!selectedImagesSmallPatii[0] ? (
                      <label
                        htmlFor="smallPatti1"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[0] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(selectedImagesSmallPatii[0])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(0)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg_white w-100">
                    <input type="file" id="smallPatti2" onChange={(e) => handleUploadSmallPatti(1, e)} hidden />

                    {!selectedImagesSmallPatii[1] ? (
                      <label
                        htmlFor="smallPatti2"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[1] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(selectedImagesSmallPatii[1])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(1)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg_white w-100">
                    <input type="file" id="smallPatti3" onChange={(e) => handleUploadSmallPatti(2, e)} hidden />

                    {!selectedImagesSmallPatii[2] ? (
                      <label
                        htmlFor="smallPatti3"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[2] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(selectedImagesSmallPatii[2])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(2)}
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
            {/* banner slider for animal suppliments */}

            <Accordion.Item className="py-1 bg-white rounded" eventKey="3">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Animal Suppliments</h3>
                  {activeAccordion === '3' ? (
                    <button onClick={HandleSaveAnimalSuppliments}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">

                  <div className="bg_white">
                    <input type="file" id="animal_suppliments" onChange={handelAnimalSuplimentImg} hidden />

                    {!AnimalSuplimentsImages ? (
                      <label
                        htmlFor="animal_suppliments"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      AnimalSuplimentsImages && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={URL.createObjectURL(AnimalSuplimentsImages)}
                            alt=""
                          />
                          <img
                            onClick={handeldeleteAnimalSupliment}
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
            {MainCategories.map((data, index) => {
              return (
                <Accordion.Item className="py-1 bg-white rounded" eventKey={index}>
                  <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                    <div className="d-flex justify-content-between w-100">
                      <h3 className="fs-sm fw-400  black mb-0">{data.title}</h3>
                      {activeAccordion === index ? (
                        <button
                          className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                          type="submit">
                          <img src={saveicon} alt="saveicon" />
                          Save
                        </button>
                      ) : null}
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="py-2 px-3">
                    <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                      <div className="bg_white">
                        <input type="file" id={`categoreis_${index}`} onChange={(e) => handleCategoryImages(e, index)} hidden />

                        {!CategoryImage[index] ? (
                          <label
                            htmlFor={`categoreis_${index}`}
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                            + Add Media
                          </label>
                        ) : (
                          CategoryImage[index] && (
                            <div className="position-relative imagemedia_btn">
                              <img
                                className="w-100 h-100 object-fit-cover"
                                src={URL.createObjectURL(CategoryImage[index])}
                                alt=""
                              />
                              <img
                                onClick={() => handleCategoryImagesDelete(index)}
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
            })
            }
          </Accordion>
        </div>
      </form>

      <ToastContainer />
    </div>


  );
};

export default BannersAdvertisement;
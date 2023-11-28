import React from 'react';
import saveicon from '../Images/svgs/saveicon.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import { Col, Row } from 'react-bootstrap';
import SearchIcon from '../Images/svgs/search.svg';
import { useState } from 'react';
import { collection, doc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const NewCategory = () => {
  const [imageupload, setImageupload] = useState('');
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
        alert('Please enter the name');
      } else if (status === undefined) {
        alert('Please Set the status');
      } else if (category === undefined) {
        alert('please select category');
      } else if (imageupload.length === 0) {
        alert('Please Set an image for the product');
      } else {
        setLoaderstatus(true);
        const filename = Math.floor(Date.now() / 1000) + '-' + imageupload.name;
        const storageRef = ref(storage, `/Main-category/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, 'sub_categories'), {
          title: name,
          status: status,
          image: imageUrl,
          cat_ID: category,
        });
        setLoaderstatus(false);
        toast.success('Product added Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleReset();
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error('Error adding document: ', e);
    }
  }

  function handelUpload(e) {
    setImageupload(e.target.files[0]);
  }
  function handleReset() {
    setImageupload();
    setName('');
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
        const querySnapshot = await getDocs(collection(db, 'categories'));
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
        <div className="loader">
          <h3 className="heading">Uploading Data... Please Wait</h3>
        </div>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
          <div className="container">
            {/* NEW PRODUCT DETAILSS  */}
            <form>
              {' '}
              <div className="d-flex">
                <Col>
                  {' '}
                  <h1 className="fw-500  mb-0 black fs-lg">New Category</h1>
                </Col>
                <Col className="d-flex justify-content-center">
                  {' '}
                  <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
                    <div className="d-flex align-itmes-center gap-3">
                      <button className="reset_border">
                        <button onClick={handleReset} className="fs-sm reset_btn border-0 fw-400 ">
                          Reset
                        </button>
                      </button>
                      <button
                        onClick={handleSave}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black">
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    </div>
                  </div>
                </Col>
              </div>
              <Row className="mt-3">
                <Col xxl={8}>
                  {/* Basic Information */}
                  <div className="product_shadow bg_white p-3">
                    <h2 className="fw-400 fs-2sm black mb-0">Basic Information</h2>
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
                    />{' '}
                    <br />
                    {/* 2nd input */}
                    <label htmlFor="des" className="fs-xs fw-400 mt-3 black">
                      Category Image
                    </label>{' '}
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
                          className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center">
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
                              setStatus('published');
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
                              setStatus('hidden');
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
                    <h2 className="fw-400 fs-2sm black mb-0">Parent Category</h2>
                    <select
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-3 product_input  black fw-400"
                      id="Discount">
                      <option className="mt-2 product_input black fw-400">Select category</option>
                      {mainCategory.map((item, index) => {
                        const { id, title } = item;
                        return (
                          <option className="mt-2 product_input black fw-400" value={id}>
                            {title}
                          </option>
                        );
                      })}
                    </select>
                    <p className="black fw-400 fs-xxs mb-0 mt-3">
                      Select a category that will be the parent of the current one.
                    </p>
                  </div>
                </Col>
              </Row>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default NewCategory;

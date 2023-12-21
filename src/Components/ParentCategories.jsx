import React, { useState } from 'react';
import addicon from '../Images/svgs/addicon.svg';
import search from '../Images/svgs/search.svg';
import dropdownDots from '../Images/svgs/dots2.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import updown_icon from '../Images/svgs/arross.svg';
import categoryImg from '../Images/Png/mobile_icon_40.png';
import saveicon from '../Images/svgs/saveicon.svg';
import Modifyproduct from './Modifyproduct';
import { useRef } from 'react';
import { collection, doc, getDocs, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryItems } from '../Common/Helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useImageHandleContext } from '../context/ImageHandler';
import { useMainCategories, useSubCategories } from '../context/categoriesGetter';
const Categories = () => {
  // const [data, setData] = useState([]);
  // const [mainCategory, setMainCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState();
  const [imageupload, setImageupload] = useState('');
  const [addCatPopup, setAddCatPopup] = useState(false);
  const [status, setStatus] = useState();
  const [searchvalue, setSearchvalue] = useState('')
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [initialRender, setInitialRender] = useState(true);




  // context 
  const { ImageisValidOrNot } = useImageHandleContext()
  const { categoreis, updateData, addData } = useMainCategories()
  const { data } = useSubCategories()



  const pubref = useRef();
  const hidref = useRef();
  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };

  // handle image upload functionality start from here 
  function handelUpload(e) {
    const selectedFile = e.target.files[0];
    if (!ImageisValidOrNot(selectedFile)) {
      toast.error("Invalid file type. Please select a valid image file.");
      setImageupload(null);
    } else {
      setImageupload(selectedFile);
    }

  }

  //   handle image upload functionality end  here

  /*  *******************************
          Add Parent Category start from here 
     *********************************************   **/

  async function handleSaveParentCategory(e) {

    e.preventDefault()
    try {
      if (name === undefined || null) {
        alert('please enter the name of the category ')
      } else if (imageupload.length === 0) {
        alert('please upload image of the category ')
      }
      else if (status === undefined || null) {
        alert('please Set the status ')
      } else {
        setLoaderstatus(true);
        const filename = Math.floor(Date.now() / 1000) + '-' + imageupload.name;
        const storageRef = ref(storage, `/Parent-category/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, 'categories'), {
          title: name,
          status: status,
          image: imageUrl,
        });
        setLoaderstatus(false);
        toast.success('Category added Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        HandleResetForm()
        setAddCatPopup(false)
        setRefreshData(prevState => !prevState)
        // context 
        addData(docRef)
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e)
    }

  }

  function HandleResetForm() {
    setName("");
    setImageupload('')
    setStatus("")
  }

  /*  *******************************
      Add Parent Category end  here 
   *********************************************   **/


  function handleDelete22(index) {
    setImageupload();
  }
  // useEffect(() => {
  //   const fetchDataSubCategories = async () => {
  //     let list = [];
  //     try {
  //       const querySnapshot = await getDocs(collection(db, 'sub_categories'));
  //       querySnapshot.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         list.push({ id: doc.id, ...doc.data() });
  //       });
  //       setData([...list]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchDataSubCategories();
  // }, []);

  // useEffect(() => {
  //   const fetchDataCategories = async () => {
  //     let list = [];
  //     try {
  //       const querySnapshot = await getDocs(collection(db, 'categories'));
  //       querySnapshot.forEach((doc) => {
  //         list.push({ id: doc.id, ...doc.data() });
  //       });
  //       setMainCategory([...list]);
  //     } catch (error) {
  //       console.log('Error fetching data:', error);
  //     }
  //   };

  //   // Call fetchDataCategories when refreshData changes
  //   if (initialRender || refreshData) {
  //     fetchDataCategories();

  //     // Reset the state variables after running fetchDataCategories
  //     setInitialRender(false);
  //     setRefreshData(false);
  //   }
  // }, [initialRender, refreshData]);





  /*  *******************************
    checkbox functionality start 
  *********************************************   **/
  const [selectAll, setSelectAll] = useState(false);


  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = categoreis.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [categoreis]);

  // Main checkbox functionality start from here 

  const handleMainCheckboxChange = () => {
    const updatedData = categoreis.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    setMainCategory(updatedData);
    setSelectAll(!selectAll);
  };

  // Datacheckboxes functionality strat from here 
  const handleCheckboxChange = (index) => {
    const updatedData = [...categoreis];
    updatedData[index].checked = !categoreis[index].checked;
    setData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };



  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/



  /*  *******************************
      get count of items in maincategory   functionality start 
   *********************************************   **/

  const getSubcategoriesCount = (ID) => {
    const subCategory = data.filter((category) => category.cat_ID === ID);
    return subCategory.length

  }


  /*  *******************************
      get count of items in maincategory    functionality end 
   *********************************************   **/

  /*  *******************************
     Change status functionality start 
   *********************************************   **/

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === 'hidden' ? 'published' : 'hidden';
      await updateDoc(doc(db, 'categories', id), {
        status: newStatus,
      });
      alert("status Change succesffuly ")
      // let list = [];
      // const querySnapshot = await getDocs(collection(db, 'categories'));
      // querySnapshot.forEach((doc) => {
      //   list.push({ id: doc.id, ...doc.data() });
      // });
      // setMainCategory([...list]);
      updateData({ id, status: newStatus })
    } catch (error) {
      console.log(error);
    }
  }

  /*  *******************************
      Change status functionality end 
    *********************************************   **/


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
        {addCatPopup === true ? <div className="bg_black_overlay"></div> : ''}
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">Parent Categories</h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search for categories..."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <div>
                <button
                  onClick={() => setAddCatPopup(true)}
                  className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                  <img className="me-1" width={20} src={addicon} alt="add-icon" />
                  Add New Category
                </button>
                {addCatPopup === true ? (
                  <div className="parent_category_popup">
                    <form action="" onSubmit={(e) => handleSaveParentCategory(e)} >
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="fs-4 fw-400 black mb-0">New Parent Category</p>
                        <div className="d-flex align-items-center gap-3">
                          <button onClick={() => setAddCatPopup(false)} className="reset_border">
                            <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                              Cancel
                            </button>
                          </button>
                          <button
                            type="submit"
                            className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn">
                            <img src={saveicon} alt="saveicon" />
                            <p className="fs-sm fw-400 black mb-0 ps-1">Save</p>
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h2 className="fw-400 fs-2sm black mb-0">Basic Information</h2>
                        {/* ist input */}
                        <label htmlFor="Name" className="fs-xs fw-400 mt-3 black">
                          Name
                        </label>
                        <br />
                        <input
                          type="text"
                          className="mt-2 product_input fade_grey fw-400"
                          placeholder="Enter Category name"
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
                      </div>
                    </form>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 mt-3 bg-white product_shadow">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X">
                <table className="w-100">
                  <tr className="product_borderbottom">
                    <th className="py-3 ps-3">
                      <div className="d-flex align-items-center gap-3">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          Name
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th className="mx_160 ps-4">
                      <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                    </th>
                    <th className="mx_160">
                      <h3 className="fs-sm fw-400 black mb-0">Visibility</h3>
                    </th>
                    <th className="mw-90 p-3 me-1">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                  {categoreis.filter((data) => {
                    return search.toLowerCase() === '' ? data : (data.title.toLowerCase().includes(searchvalue))
                  }).map((value, index) => {
                    return (
                      <tr key={index} className="product_borderbottom">
                        <td className="py-3 ps-3">
                          <div className="d-flex align-items-center gap-3">
                            <label className="check1 fw-400 fs-sm black mb-0">
                              <div className="d-flex align-items-center">
                                <div className="w_40">
                                  <img src={value.image} alt="categoryImg" />
                                </div>
                                <div className="ps-3 ms-1">
                                  <p className="fw-400 fs-sm black mb-0">{value.title}</p>
                                </div>
                              </div>
                              <input type="checkbox" checked={value.checked || false}
                                onChange={() => handleCheckboxChange(index)} />
                              <span className="checkmark me-5"></span>
                            </label>
                          </div>
                        </td>
                        <td className="ps-4">
                          <h3 className="fs-sm fw-400 black mb-0 width_10">{getSubcategoriesCount(value.id)}</h3>
                        </td>
                        <td>
                          <h3 className="fs-sm fw-400 black mb-0 width_10 color_green">
                            {value.status}
                          </h3>
                        </td>
                        <td className="text-center">
                          <div class="dropdown">
                            <button
                              class="btn dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <img
                                // onClick={() => {
                                //   handleDelete(value.id);
                                // }}
                                src={dropdownDots}
                                alt="dropdownDots"
                              />
                            </button>
                            <ul
                              class="dropdown-menu categories_dropdown"
                              aria-labelledby="dropdownMenuButton1">
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div className="d-flex align-items-center categorie_dropdown_options">
                                    <img src={eye_icon} alt="" />
                                    <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div className="d-flex align-items-center categorie_dropdown_options">
                                    <img src={pencil_icon} alt="" />
                                    <p className="fs-sm fw-400 black mb-0 ms-2">Edit Category</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div className="d-flex align-items-center categorie_dropdown_options" onClick={() => { handleChangeStatus(value.id, value.status) }}>
                                    <img src={updown_icon} alt="" />
                                    <p className="fs-sm fw-400 green  mb-0 ms-2">{value.status === 'hidden' ? 'change to  publish' : 'Change to hidden'}</p>
                                  </div>
                                </div>
                              </li>

                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Categories;

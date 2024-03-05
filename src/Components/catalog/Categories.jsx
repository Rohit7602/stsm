import React, { useState } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import saveicon from '../../Images/svgs/saveicon.svg';
import SearchIcon from '../../Images/svgs/search.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
import Dropdown from 'react-bootstrap/Dropdown';
import savegreenicon from '../../Images/svgs/save_green_icon.svg';
import shortIcon from '../../Images/svgs/short-icon.svg';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage, db } from '../../firebase';
import { useSubCategories, useMainCategories } from '../../context/categoriesGetter';
import Deletepopup from '../popups/Deletepopup';
import Updatepopup from '../popups/Updatepopup';
import Loader from '../Loader';
import { increment } from 'firebase/firestore';


const Categories = () => {
  const { categoreis, addDataParent } = useMainCategories();
  const [loading, setloading] = useState(false);
  const { data, updateSubData, deleteData } = useSubCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState();
  const [perName, setPerName] = useState('');
  const [searchvalue, setSearchvalue] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedSubcategoryparentId, setselectedSubcategoryparentId] = useState(null);
  const [selectedSubcategoryImage, setSelectedSubcategoryImage] = useState(null);
  const [selectedSubcategoryStatus, setSelectedSubcategoryStatus] = useState(null);
  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };
  const [deletepopup, setDeletePopup] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  const [editCatPopup, setEditCatPopup] = useState(false);
  const [editsearchvalue, setEditSearchvalue] = useState('');

  const [editCatName, setEditCatName] = useState('');
  const [editCatImg, setEditCatImg] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const [order, setorder] = useState('ASC');

  const handleSelectCategory = (category) => {
    setEditSearchvalue('');
    setSelectedCategory(category);
    setCategory(category);
  };

  //

  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...data];

    if (order === 'ASC') {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateSubData(sortedData);
  };

  /*  *******************************
      Delete functionality start 
   *********************************************   **/

  async function handleDeleteCategory(id, image, parentId) {
    try {
      await deleteDoc(doc(db, 'sub_categories', id)).then(() => {
        if (image.length !== 0) {
          var st = getStorage();
          var reference = ref(st, image);
          deleteObject(reference);
        }
        deleteData(id);
      });

      await updateDoc(doc(db, 'categories', parentId), {
        'noOfSubcateogry': increment(-1)
      });

    } catch (error) {
      console.log(error);
    }
  }

  /*  *******************************
      Delete functionality end 
    *********************************************   **/

  /*  *******************************
      Change status functionality start 
   *********************************************   **/

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === 'hidden' ? 'published' : 'hidden';

      await updateDoc(doc(db, 'sub_categories', id), {
        status: newStatus,
      });
      updateSubData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  }

  /*  *******************************
      Change status functionality end 
    *********************************************   **/

  /*  *******************************
     Edit  Image  functionality start 
   *********************************************   **/

  function handleDeleteEditImge() {
    setloading(true)
    setEditCatImg('');
    if (typeof editCatImg === 'string' && editCatImg.startsWith('http')) {
      setloading(true)
      try {
        if (editCatImg.length !== 0) {
          var st = getStorage();
          var reference = ref(st, editCatImg);
          deleteObject(reference);

        }
        setloading(false)
      } catch (Error) {
        console.log(Error);
      }
      setloading(false)
    }
    setloading(false)
  }

  /*  *******************************
      Edit  Image  functionality end 
   *********************************************   **/



  /*  *******************************
      Edit  Category   functionality start 
   *********************************************   **/
  async function HandleEditCategory(e) {
    e.preventDefault();
    setEditCatPopup(false);
    setloading(true)
    try {
      console.log("try is working");
      let imageUrl = null;
      if (editCatImg instanceof File) {
        // Handle the case where editCatImg is a File
        const filename = Math.floor(Date.now() / 1000) + '-' + editCatImg.name;
        const storageRef = ref(storage, `/Sub-categories/${filename}`);
        await uploadBytes(storageRef, editCatImg);
        imageUrl = await getDownloadURL(storageRef);
      } else if (typeof editCatImg === 'string' && editCatImg.startsWith('http')) {
        // Handle the case where editCatImg is a URL
        imageUrl = editCatImg;
      }

      const updateData = {
        title: editCatName,
        status: editStatus,
        image: imageUrl,
        updated_at: Date.now()
      };

      // Update the category ID only if a new category is selected
      if (selectedCategory && selectedCategory.id) {
        updateData.cat_ID = selectedCategory.id;
      }

      await updateDoc(doc(db, 'sub_categories', selectedSubcategoryId), updateData);

      updateSubData({
        selectedSubcategoryId,
        ...updateData
      });

      setloading(false)

      toast.success('Category updated Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }


  /*  *******************************
      Edit  Category  functionality end 
   *********************************************   **/

  /*  *******************************
      checkbox functionality start 
    *********************************************   **/
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = data.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [data]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = data.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateSubData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...data];
    updatedData[index].checked = !data[index].checked;
    updateSubData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  //  get parent category  function  start from here

  const getParentCategoryName = (catID) => {
    const mainCategory = categoreis.find((category) => category.id === catID);
    return mainCategory ? mainCategory.title : '';
  };

  //  get parent category  function  end  from here
  if (loading) {
    return (
      <Loader></Loader>
    )
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        {deletepopup || statusPopup || editCatPopup ? <div className="bg_black_overlay"></div> : null}
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">Categories</h1>
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
              <Link
                to="newcategory"
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Category
              </Link>
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 bg-white product_shadow mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th onClick={() => sorting('title')} className="py-3 ps-3 w-100 cursor_pointer">
                        <div className="d-flex align-items-center gap-3 min_width_300">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleMainCheckboxChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                          <p className="fw-400 fs-sm black mb-0 ms-2">
                            Name{' '}
                            <span>
                              <img
                                className="ms-2 cursor_pointer"
                                width={20}
                                src={shortIcon}
                                alt="short-icon"
                              />
                            </span>
                          </p>
                        </div>
                      </th>
                      <th onClick={() => sorting('cat_ID')} className="mw-250 px-2">
                        <p className="fw-400 fs-sm black mb-0 cursor_pointer">
                          Parent Category
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </p>
                      </th>
                      <th className="mx_160 ps-4">
                        <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                      </th>
                      <th onClick={() => sorting('status')} className="mx_160 cursor_pointer">
                        <p className="fw-400 fs-sm black mb-0">
                          Visibility{' '}
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </p>
                      </th>
                      <th className="mw-90 p-3 me-1 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {data
                      .filter((item) => {
                        const mainCategory = categoreis.find(
                          (category) => category.id === item.cat_ID
                        );
                        return search.toLowerCase() === ''
                          ? item
                          : item.title.toLowerCase().includes(searchvalue);
                      })
                      .map((value, index) => {
                        const subcategoryId = value.id;
                        const subcategoryImage = value.image;
                        return (
                          <tr key={index} className="product_borderbottom">
                            <td className="py-3 ps-3 w-100">
                              <div className="d-flex align-items-center gap-3 min_width_300">
                                <label class="check1 fw-400 fs-sm black mb-0">
                                  <input
                                    type="checkbox"
                                    checked={value.checked || false}
                                    onChange={() => handleCheckboxChange(index)}
                                  />
                                  <span class="checkmark"></span>
                                </label>
                                <div className="d-flex align-items-center ms-2">
                                  <div className="w_40">
                                    <img c src={value.image} alt="categoryImg" />
                                  </div>
                                  <div className="ps-3 ms-1">
                                    <p className="fw-400 fs-sm black mb-0">{value.title}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 mw-250 ">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {getParentCategoryName(value.cat_ID)}
                              </h3>
                            </td>
                            <td className="ps-4 mw_160">
                              <h3 className="fs-sm fw-400 black mb-0 width_10 ">10</h3>
                            </td>
                            <td className="mx_160">
                              <h3 className="fs-sm fw-400 black mb-0 color_green">{value.status}</h3>
                            </td>
                            <td className="text-center mw-90">
                              <div class="dropdown">
                                <button
                                  class="btn dropdown-toggle"
                                  type="button"
                                  id="dropdownMenuButton1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <img src={dropdownDots} alt="dropdownDots" />
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
                                      <div
                                        onClick={() => {
                                          setEditCatPopup(true);
                                          setSelectedSubcategoryId(value.id);
                                          setEditCatName(value.title);
                                          setEditCatImg(value.image);
                                          setSelectedCategory(getParentCategoryName(value.cat_ID));
                                          setEditStatus(value.status);
                                        }}
                                        className="d-flex align-items-center categorie_dropdown_options">
                                        <img src={pencil_icon} alt="" />
                                        <p className="fs-sm fw-400 black mb-0 ms-2">Edit Category</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="dropdown-item" href="#">
                                      <div
                                        className="d-flex align-items-center categorie_dropdown_options"
                                        onClick={() => {

                                          setSelectedSubcategoryId(value.id);
                                          setSelectedSubcategoryStatus(value.status);
                                          setStatusPopup(true);
                                        }}>
                                        <img src={updown_icon} alt="" />
                                        <p className="fs-sm fw-400 green mb-0 ms-2">
                                          {value.status === 'hidden'
                                            ? 'change to  publish'
                                            : 'Change to hidden'}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="dropdown-item" href="#">
                                      <div
                                        className="d-flex align-items-center categorie_dropdown_options"
                                        onClick={() => {
                                          setselectedSubcategoryparentId(value.cat_ID)
                                          setSelectedSubcategoryId(value.id);
                                          setSelectedSubcategoryImage(value.image);
                                          setDeletePopup(true);
                                        }}>
                                        <img src={delete_icon} alt="" />
                                        <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {/* <div className=""></div> */}
              </div>
            </div>
          </div>
          {deletepopup ? (
            <Deletepopup
              showPopup={setDeletePopup}
              handleDelete={() =>
                handleDeleteCategory(selectedSubcategoryId, selectedSubcategoryImage, selectedSubcategoryparentId)
              }
              itemName="SubCategory"
            />
          ) : null}
          {statusPopup ? (
            <Updatepopup
              statusPopup={setStatusPopup}
              handelStatus={() =>
                handleChangeStatus(selectedSubcategoryId, selectedSubcategoryStatus)
              }
              itemName="SubCategory"
            />
          ) : null}
          {editCatPopup ? (
            <div className="new_cat_popup">
              <form action="">
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fs-4 fw-500 black mb-0">Edit SubCatagory</p>
                  <img
                    onClick={() => setEditCatPopup(false)}
                    className="cursor_pointer"
                    width={35}
                    src={closeIcon}
                    alt=""
                  />
                </div>
                <p className="fs-2sm fw-400 black">Basic Information</p>
                <label className="fs-sm fw-400 black mb-1" htmlFor="">
                  Name
                </label>
                <br />
                <input
                  onChange={(e) => setEditCatName(e.target.value)}
                  value={editCatName}
                  className="product_input fade_grey fw-400"
                  type="text"
                />
                <div className="mt-3">
                  <p className="fs-sm fw-400 black mb-3">Category Image</p>
                  <input
                    onChange={(e) => setEditCatImg(e.target.files[0])}
                    type="file"
                    id="catImg"
                    accept=".png, .jpeg, .jpg"
                    hidden
                  />
                  <div className=" d-flex flex-wrap">
                    {editCatImg ? (
                      <div className="position-relative ">
                        <img
                          className="mobile_image object-fit-cover"
                          src={
                            editCatImg &&
                              typeof editCatImg === 'string' &&
                              editCatImg.startsWith('http')
                              ? editCatImg
                              : URL.createObjectURL(editCatImg)
                          }
                          alt=""
                        />
                        {/* <img className="mobile_image object-fit-cover" src={editCatImg} alt="" /> */}
                        <img
                          onClick={() => handleDeleteEditImge()}
                          className="position-absolute top-0 end-0 cursor_pointer"
                          src={deleteicon}
                          alt="deleteicon"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="catImg"
                        className="color_green cursor_pointer fs-sm addmedia_btn">
                        + Add Media
                      </label>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="d-flex align-items-center">
                    <div className="mt-3 py-1 d-flex align-items-center gap-3">
                      <label class="check fw-400 fs-sm black mb-0">
                        Published
                        <input
                          onChange={() =>
                            setEditStatus(editStatus === 'hidden' ? 'published' : 'hidden')
                          }
                          checked={editStatus === 'published'}
                          type="checkbox"
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                    <div className="mt-3 py-1 d-flex align-items-center gap-3 ms-5">
                      <label class="check fw-400 fs-sm black mb-0">
                        Hidden
                        <input
                          onChange={() =>
                            setEditStatus(editStatus === 'published' ? 'hidden' : 'published')
                          }
                          checked={editStatus === 'hidden'}
                          type="checkbox"
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-3 bg_white">
                    <div className="d-flex align-items-center justify-content-between">
                      <h2 className="fw-400 fs-2sm black mb-0">Parent Category</h2>
                      {/* <Link to="/catalog/parentcategories" className="fs-2sm fw-400 red">
                      View All
                    </Link> */}
                    </div>
                    <Dropdown className="category_dropdown z-1">
                      <Dropdown.Toggle id="dropdown-basic" className="dropdown_input_btn">
                        <div className="product_input">
                          <p className="fade_grey fw-400 w-100 mb-0 text-start">
                            {selectedCategory
                              ? selectedCategory.title || selectedCategory
                              : 'Select Category'}
                          </p>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center product_input position-sticky top-0">
                            <img src={SearchIcon} alt="SearchIcon" />
                            <input
                              onChange={(e) => setEditSearchvalue(e.target.value)}
                              placeholder="search for category"
                              className="fade_grey fw-400 border-0 outline_none ms-2 w-100"
                              type="text"
                            />
                          </div>
                          <div>
                            {categoreis
                              .filter((items) => {
                                return (
                                  editsearchvalue.toLowerCase() === '' ||
                                  items.title.toLowerCase().includes(editsearchvalue)
                                );
                              })
                              .map((category) => (
                                <Dropdown.Item key={category.id}>
                                  <div
                                    className={`d-flex justify-content-between ${selectedCategory && selectedCategory.id === category.id
                                      ? 'selected'
                                      : ''
                                      }`}
                                    onClick={() => handleSelectCategory(category)}>
                                    <p className="fs-xs fw-400 black mb-0">{category.title}</p>
                                    {selectedCategory && selectedCategory.id === category.id && (
                                      <img src={savegreenicon} alt="savegreenicon" />
                                    )}
                                  </div>
                                </Dropdown.Item>
                              ))}
                            {/* {editsearchvalue &&
                            !categoreis.some((category) =>
                              category.title.toLowerCase().includes(editsearchvalue.toLowerCase())
                            ) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPerName(editsearchvalue);
                                }}
                                className="addnew_category_btn fs-xs green">
                                +Add <span className="black">"{editsearchvalue}"</span> in Parent
                                Category
                              </button>
                            )} */}
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                    <p className="black fw-400 fs-xxs mb-0 mt-3">
                      Select a category that will be the parent of the current one.
                    </p>
                    <div className="d-flex justify-content-end">
                      <button onClick={HandleEditCategory}
                        type="submit"
                        className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn">
                        <img src={saveicon} alt="saveicon" />
                        <p className="fs-sm fw-400 black mb-0 ps-1">Save</p>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
        <ToastContainer />
      </div>
    );
  }


};

export default Categories;

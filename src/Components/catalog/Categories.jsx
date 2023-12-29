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
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

import { ref, getStorage, deleteObject } from 'firebase/storage';
import { useSubCategories, useMainCategories } from '../../context/categoriesGetter';
import Deletepopup from '../popups/Deletepopup';
import Updatepopup from '../popups/Updatepopup';

const Categories = () => {
  const { categoreis } = useMainCategories();
  const { data, updateData, deleteData } = useSubCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchvalue, setSearchvalue] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedSubcategoryImage, setSelectedSubcategoryImage] = useState(null);
  const [selectedSubcategoryStatus, setSelectedSubcategoryStatus] = useState(null);
  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };
  const [deletepopup, setDeletePopup] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  // const [editCatPopup, setEditCatPopup] = useState(true);
  const [order, setorder] = useState("ASC")
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...data];

    if (order === "ASC") {
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
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateData(sortedData);
  };

  


















  /*  *******************************
     Delete functionality start 
   *********************************************   **/

  async function handleDeleteCategory(id, image) {
    try {
      await deleteDoc(doc(db, 'sub_categories', id)).then(() => {
        if (image.length !== 0) {
          var st = getStorage();
          var reference = ref(st, image);
          deleteObject(reference);
        }
        deleteData(id);
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
      updateData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  }

  /*  *******************************
      Change status functionality end 
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
    updateData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...data];
    updatedData[index].checked = !data[index].checked;
    updateData(updatedData);

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

  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      {deletepopup || statusPopup ? <div className="bg_black_overlay"></div> : ''}
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
        <div className="p-3 mt-3 bg-white product_shadow mt-4">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X ">
              <table className="w-100">
                <thead className="w-100 table_head">
                  <tr className="product_borderbottom">
                    <th onClick={() => sorting("title") } className="py-3 ps-3 w-100">
                      <div className="d-flex align-items-center gap-3 min_width_300">
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
                    <th onClick={() => sorting("cat_ID")} className="mw-250 px-2">
                      <h3 className="fs-sm fw-400 black mb-0">Parent Category</h3>
                    </th>
                    <th  className="mx_160 ps-4">
                      <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                    </th>
                    <th onClick={() => sorting("status")} className="mx_160">
                      <h3 className="fs-sm fw-400 black mb-0">Visibility</h3>
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
                        : item.title.toLowerCase().includes(searchvalue) ||
                            mainCategory.title.toLowerCase().includes(searchvalue);
                    })
                    .map((value, index) => {
                      const subcategoryId = value.id;
                      const subcategoryImage = value.image;
                      return (
                        <tr key={index} className="product_borderbottom">
                          <td className="py-3 ps-3 w-100">
                            <div className="d-flex align-items-center gap-3 min_width_300">
                              <label class="check1 fw-400 fs-sm black mb-0">
                                <div className="d-flex align-items-center">
                                  <div className="w_40">
                                    <img c src={value.image} alt="categoryImg" />
                                  </div>
                                  <div className="ps-3 ms-1">
                                    <p className="fw-400 fs-sm black mb-0">{value.title}</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={value.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span class="checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td className="px-2 mw-250">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {getParentCategoryName(value.cat_ID)}
                            </h3>
                          </td>
                          <td className="ps-4 mw_160">
                            <h3 className="fs-sm fw-400 black mb-0 width_10">10</h3>
                          </td>
                          <td className="mx_160">
                            <h3 className="fs-sm fw-400 black mb-0 width_10 color_green">
                              {value.status}
                            </h3>
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
                                    <div className="d-flex align-items-center categorie_dropdown_options">
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
              handleDeleteCategory(selectedSubcategoryId, selectedSubcategoryImage)
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
        {/* <div className="new_cat_popup">
          <form action="">
            <p className="fs-4 fw-500">Edit SubCatagory</p>
            <p className="fs-2sm fw-400">Basic Information</p>
            <label htmlFor="">Name</label>
            <br />
            <input className='' type="text" />
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default Categories;

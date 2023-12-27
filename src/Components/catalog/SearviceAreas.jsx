import React, { useState } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdown from '../../Images/svgs/dropdown_icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import closeicon from '../../Images/svgs/closeicon.svg';
import saveicon from '../../Images/svgs/saveicon.svg';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

import { ref, getStorage, deleteObject } from 'firebase/storage';
import { useSubCategories, useMainCategories } from '../../context/categoriesGetter';

const Categories = () => {
  const { categoreis } = useMainCategories();
  const { data, updateData, deleteData } = useSubCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchvalue, setSearchvalue] = useState('');
  const [addsServicePopup, setAddsServicePopup] = useState(false);

  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };

  /*  *******************************
     Delete functionality start 
   *********************************************   **/

  async function handleDelete(id, image) {
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
      alert('status Change succesffuly ');
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
      {addsServicePopup === true ? <div className="bg_black_overlay"></div> : ''}
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500   black fs-lg mb-0">Service Areas</h1>
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
              onClick={() => setAddsServicePopup(!addsServicePopup)}
              className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={20} src={addicon} alt="add-icon" />
              Add New Area
            </Link>
            {addsServicePopup ? (
              <div className="add_service_area_popup">
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fs-sm fw-400 black mb-0">Add Service Area</p>
                  <img
                    onClick={() => setAddsServicePopup(!addsServicePopup)}
                    src={closeicon}
                    alt="closeicon"
                  />
                </div>
                <div className="d-flex align-items-start flex-column border_top_gray pt-3 mt-3">
                  <label htmlFor="">Name / Title</label>
                  <input
                    className="popup_input w-100 fs-xs fw-400 black"
                    type="text"
                    placeholder="Enter Area Name"
                  />
                </div>
                <div className="d-flex align-items-start flex-column pt-3 mt-1">
                  <label htmlFor="">Pin Code</label>
                  <input
                    className="popup_input w-100 fs-xs fw-400 black"
                    type="text"
                    placeholder="Enter Pin Code"
                  />
                </div>
                <div className="d-flex align-items-start flex-column pt-3 mt-1">
                  <label htmlFor="">Expected Delivery</label>
                  <div class="dropdown w-100 mt-2">
                    <button
                      class="btn btn-secondary fs_xs fw-400 dropdown-toggle w-100 text-start popup_input py-2 dropdown_btn_text rounded-0
                     mt-0 bg-white"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      1 Day
                      <img className="float-end" src={dropdown} alt="" />
                    </button>
                    <ul class="dropdown-menu w-100">
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">1 Day</li>
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">2 Day</li>
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">3 Day</li>
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">4 Day</li>
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">5 Day</li>
                      <li class="dropdown-item fs-xs fw-400 dropdown_btn_text">6 Day</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="d-flex align-items-center gap-5">
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                      <label class="check fw-400 fs-sm black mb-0">
                        Published
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                      <label class="check fw-400 fs-sm black mb-0">
                        Hidden
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 justify-content-end pt-3 mt-3 border_top_gray">
                  <button className="reset_border">
                    <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                      Reset
                    </button>
                  </button>
                  <button className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black">
                    <img src={saveicon} alt="saveicon" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        {/* categories details  */}
        <div className="p-3 mt-3 bg-white product_shadow mt-4">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X ">
              <table className="w-100">
                <thead className="w-100 table_head">
                  <tr className="product_borderbottom">
                    <th className="py-3 ps-3 w-100">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          Name / Title
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th className="mx_160 px-2">
                      <h3 className="fs-sm fw-400 black mb-0">Pin / Postal Code</h3>
                    </th>
                    <th className="mw-200 ps-3">
                      <h3 className="fs-sm fw-400 black mb-0">Expected Delivery</h3>
                    </th>
                    <th className="mx_140">
                      <h3 className="fs-sm fw-400 black mb-0">Service Status</h3>
                    </th>
                    <th className="mw-90 p-3 me-1 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  <tr className="product_borderbottom">
                    <td className="py-3 ps-3 w-100">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          <div className="d-flex align-items-center">
                            <p className="fw-400 fs-sm black mb-0">Barwala S.O.</p>
                          </div>
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </td>
                    <td className="px-2 mx_160">
                      <h3 className="fs-sm fw-400 black mb-0">125121</h3>
                    </td>
                    <td className="ps-4 mw-200">
                      <h3 className="fs-sm fw-400 black mb-0">1 Day</h3>
                    </td>
                    <td className="mx_140">
                      <h3 className="fs-sm fw-400 black mb-0 color_green">Live</h3>
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
                              <div className="d-flex align-items-center categorie_dropdown_options">
                                <img src={updown_icon} alt="" />
                                {/* <p className="fs-sm fw-400 green mb-0 ms-2">
                                  {value.status === 'hidden'
                                    ? 'change to  publish'
                                    : 'Change to hidden'}
                                </p> */}
                              </div>
                            </div>
                          </li>
                          <li>
                            <div class="dropdown-item" href="#">
                              <div className="d-flex align-items-center categorie_dropdown_options">
                                <img src={delete_icon} alt="" />
                                <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* <div className=""></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

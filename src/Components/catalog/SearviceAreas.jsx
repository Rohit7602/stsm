import React, { useState, useEffect } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdown from '../../Images/svgs/dropdown_icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import shortIcon from '../../Images/svgs/short-icon.svg';
import closeicon from '../../Images/svgs/closeicon.svg';
import saveicon from '../../Images/svgs/saveicon.svg';
import { doc, deleteDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UseServiceContext } from '../../context/ServiceAreasGetter';
import Deletepopup from '../popups/Deletepopup';
import Updatepopup from '../popups/Updatepopup';

const Categories = () => {
  const { ServiceData, addServiceData, deleteServiceData, updateServiceData } = UseServiceContext();
  const [addsServicePopup, setAddsServicePopup] = useState(false);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [AreaName, SetAreaName] = useState('');
  const [postalCode, SetPostalCode] = useState();
  const [status, setStatus] = useState();
  const pubref = useRef();
  const hideref = useRef();

  const [selectedValue, setSelectedValue] = useState('1 Day');
  const [searchvalue, setSearchvalue] = useState('');

  const [deletepopup, setDeletePopup] = useState(false);
  const [ServiceAreaId, setServiceAreaId] = useState(null);
  const [ServiceStatus, setServiceStatus] = useState(null);
  const [statusPopup, setStatusPopup] = useState(false);

  //  edit popup states //
  const [editServicePopup, setEditServicePopup] = useState(false);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceDay, setEditServiceDay] = useState('');
  const [editServiceStatus, setEditServiceStatus] = useState('');
  const [editPinCode, setEditPinCode] = useState('');

  // 



  const [order, setorder] = useState('ASC');
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...ServiceData];

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
    updateServiceData(sortedData);
  };

  // Function to handle the selection of an item
  const handleSelectItem = (value) => {
    // Update the selected value in the state
    setSelectedValue(value);
  };

  // handle reset function start from here

  function handleResetServiceArea() {
    setSelectedValue('1 Day');
    SetPostalCode('');
    SetAreaName('');
    pubref.current.checked = false;
    hideref.current.checked = false;
  }

  /*  *******************************
    Add New Service  functionality start 
  *********************************************   **/

  async function HandleSaveServiceAreas(e) {
    e.preventDefault();
    if (!AreaName && !postalCode && !status) {
      alert('Please Fill All Field');
    } else {
      setLoaderstatus(true);
      try {
        const docRef = await addDoc(collection(db, 'ServiceAreas'), {
          AreaName: AreaName,
          PostalCode: postalCode,
          ServiceStatus: status,
          ExpectedDelivery: selectedValue,
        });

        addServiceData(docRef);
        setLoaderstatus(false);
        toast.success('Category  added Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleResetServiceArea();
        setAddsServicePopup(false);
      } catch (error) {
        toast.error('Error in Adding Service Areas', {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error('error is adding service areas ', error);
      }
    }
  }

  /*  *******************************
    Add New Service functionality end here  
  *********************************************   **/

  /*  *******************************
      Delete functionality start 
   *********************************************   **/

  async function handleDeleteServiceArea(id) {
    try {
      await deleteDoc(doc(db, 'ServiceAreas', id)).then(() => {
        deleteServiceData(id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*  *******************************
      Delete functionality end 
    *********************************************   **/

  /*  *******************************
      Change service  status functionality start 
   *********************************************   **/

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === 'live' ? 'draft' : 'live';
      await updateDoc(doc(db, 'ServiceAreas', id), {
        ServiceStatus: newStatus,
      });
      updateServiceData({ id, ServiceStatus: newStatus });
      toast.success('Status Changed Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }

  /*  *******************************
      Change service  status functionality end 
    *********************************************   **/

  /*  *******************************
      checkbox functionality start 
    *********************************************   **/
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = ServiceData.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [ServiceData]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = ServiceData.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateServiceData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...ServiceData];
    updatedData[index].checked = !ServiceData[index].checked;
    updateServiceData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  /*  *******************************
      Checbox  functionality end 
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
        {addsServicePopup || editServicePopup ? <div className="bg_black_overlay"></div> : ''}
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
                  placeholder="Search for ServiceAreas..."
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
                      className="cursor_pointer"
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
                      value={AreaName}
                      onChange={(e) => SetAreaName(e.target.value)}
                      placeholder="Enter Area Name"
                    />
                  </div>
                  <div className="d-flex align-items-start flex-column pt-3 mt-1">
                    <label htmlFor="">Pin Code</label>
                    <input
                      className="popup_input w-100 fs-xs fw-400 black"
                      type="number"
                      minLength="6"
                      maxLength="6"
                      value={postalCode}
                      onInput={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        SetPostalCode(value.slice(0, 6));
                      }}
                      placeholder="Enter Pin Code "
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
                        {selectedValue}
                        <img className="float-end" src={dropdown} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('1 Day')}>
                          1 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('2 Day')}>
                          2 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('3 Day')}>
                          3 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('4 Day')}>
                          4 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('5 Day')}>
                          5 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('6 Day')}>
                          6 Day
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                    <div className="d-flex align-items-center gap-5">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                        <label class="check fw-400 fs-sm black mb-0">
                          Live
                          <input
                            type="checkbox"
                            ref={pubref}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStatus('live');
                                hideref.current.checked = false;
                              }
                            }}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                        <label class="check fw-400 fs-sm black mb-0">
                          Draft
                          <input
                            type="checkbox"
                            ref={hideref}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStatus('draft');
                                pubref.current.checked = false;
                              }
                            }}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 justify-content-end pt-3 mt-3 border_top_gray">
                    <button className="reset_border" onClick={handleResetServiceArea}>
                      <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                        Reset
                      </button>
                    </button>
                    <button
                      onClick={HandleSaveServiceAreas}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  </div>
                </div>
              ) : null}
              {editServicePopup ? (
                <div className="add_service_area_popup">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fs-sm fw-400 black mb-0">Edit Service Area</p>
                    <img
                      className="cursor_pointer"
                      onClick={() => setEditServicePopup(false)}
                      src={closeicon}
                      alt="closeicon"
                    />
                  </div>
                  <div className="d-flex align-items-start flex-column border_top_gray pt-3 mt-3">
                    <label htmlFor="">Name / Title</label>
                    <input
                      className="popup_input w-100 fs-xs fw-400 black"
                      type="text"
                      value={editServiceName}
                      onChange={(e) => setEditServiceName(e.target.value)}
                      placeholder="Enter Area Name"
                    />
                  </div>
                  <div className="d-flex align-items-start flex-column pt-3 mt-1">
                    <label htmlFor="">Pin Code</label>
                    <input
                      className="popup_input w-100 fs-xs fw-400 black"
                      type="number"
                      minLength="6"
                      maxLength="6"
                      value={editPinCode}
                      onInput={(e) => {
                        setEditPinCode(e.target.value);
                      }}
                      placeholder="Enter Pin Code "
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
                        {editServiceDay}
                        <img className="float-end" src={dropdown} alt="" />
                      </button>
                      <ul class="dropdown-menu w-100">
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('1 Day')}>
                          1 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('2 Day')}>
                          2 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('3 Day')}>
                          3 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('4 Day')}>
                          4 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('5 Day')}>
                          5 Day
                        </li>
                        <li
                          class="dropdown-item fs-xs fw-400 dropdown_btn_text"
                          onClick={() => handleSelectItem('6 Day')}>
                          6 Day
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                    <div className="d-flex align-items-center gap-5">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                        <label class="check fw-400 fs-sm black mb-0">
                          Live
                          <input
                            type="checkbox"
                            onChange={() => {
                              setEditServiceStatus('live');
                            }}
                            checked={editServiceStatus === 'live'}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                        <label class="check fw-400 fs-sm black mb-0">
                          Draft
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              setEditServiceStatus('draft');
                            }}
                            checked={editServiceStatus === 'draft'}
                          />
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 justify-content-end pt-3 mt-3 border_top_gray">
                    <button className="reset_border" onClick={handleResetServiceArea}>
                      <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                        Reset
                      </button>
                    </button>
                    <button
                      onClick={HandleSaveServiceAreas}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2  save_btn fw-400 black">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 mt-3 bg-white product_shadow mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th onClick={() => sorting('AreaName')} className="py-3 ps-3 w-100">
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
                            Name / Title{' '}
                            <span>
                              <img className="ms-2" width={20} src={shortIcon} alt="short-icon" />
                            </span>
                          </p>
                        </div>
                      </th>
                      <th className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Pin / Postal Code</h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Expected Delivery</h3>
                      </th>
                      <th onClick={() => sorting('ServiceStatus')} className="mx_140">
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Service Status{' '}
                          <span>
                            <img className="ms-2" width={20} src={shortIcon} alt="short-icon" />
                          </span>
                        </p>
                      </th>
                      <th className="mw-90 p-3 me-1 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {ServiceData.filter((data) => {
                      return searchvalue.toLowerCase() === ''
                        ? data
                        : data.AreaName.toLowerCase().includes(searchvalue);
                    }).map((data, index) => {
                      return (
                        <tr className="product_borderbottom">
                          <td className="py-3 ps-3 w-100">
                            <div className="d-flex align-items-center gap-3 min_width_300">
                              <label class="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={data.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span class="checkmark"></span>
                              </label>
                              <div className="d-flex align-items-center ms-1">
                                <p className="fw-400 fs-sm black mb-0 ms-2">{data.AreaName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 mx_160">
                            <h3 className="fs-sm fw-400 black mb-0">{data.PostalCode}</h3>
                          </td>
                          <td className="ps-4 mw-200">
                            <h3 className="fs-sm fw-400 black mb-0">{data.ExpectedDelivery}</h3>
                          </td>
                          <td className="mx_140">
                            <h3 className="fs-sm fw-400 black mb-0 color_green ms-5">
                              {data.ServiceStatus}
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
                                    <div
                                      onClick={() => {
                                        setEditServicePopup(true);
                                        setEditServiceName(data.AreaName);
                                        setEditServiceDay(data.ExpectedDelivery);
                                        setEditPinCode(data.PostalCode);
                                        setEditServiceStatus(data.ServiceStatus);
                                      }}
                                      className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={pencil_icon} alt="" />
                                      <p className="fs-sm fw-400 black mb-0 ms-2">
                                        Edit ServiceArea
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div
                                      onClick={() =>
                                        handleChangeStatus(data.id, data.ServiceStatus)
                                      }
                                      className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={updown_icon} alt="" />
                                      {
                                        <p className="fs-sm fw-400 green mb-0 ms-2">
                                          {data.ServiceStatus === 'live'
                                            ? 'change to  draft'
                                            : 'Change to live'}
                                        </p>
                                      }
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div
                                      onClick={() => {
                                        setServiceAreaId(data.id);
                                        setDeletePopup(true);
                                      }}
                                      className="d-flex align-items-center categorie_dropdown_options">
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
                <ToastContainer />
                {/* <div className=""></div> */}
              </div>
              {deletepopup ? (
                <Deletepopup
                  showPopup={setDeletePopup}
                  handleDelete={() => handleDeleteServiceArea(ServiceAreaId)}
                  itemName="ServiceArea"
                />
              ) : null}
              {statusPopup ? (
                <Updatepopup
                  statusPopup={setStatusPopup}
                  handelStatus={() => handleChangeStatus(ServiceAreaId, ServiceStatus)}
                  itemName="ServiceArea"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Categories;

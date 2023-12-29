import React, { useEffect, useState } from 'react';
import filtericon from '../../Images/svgs/filtericon.svg';
import addicon from '../../Images/svgs/addicon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { db } from '../../firebase';
import { Link, NavLink } from 'react-router-dom';
import { useProductsContext } from '../../context/productgetter';
import Updatepopup from '../popups/Updatepopup';
import Deletepopup from '../popups/Deletepopup';

const ProductListComponent = () => {
  const { data, updateData, deleteData } = useProductsContext();

  // states

  const [ProductId, setProductId] = useState(null);
  const [productStatus, setProductStatus] = useState(null)
  const [ProductImage, setProductImage] = useState(null);
  const [deletepopup, setDeletePopup] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);


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

  /**
   ******************************************************
      Change Status  functionality start from here 
  *************************************************
     */

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === 'hidden' ? 'published' : 'hidden';
      await updateDoc(doc(db, 'products', id), {
        status: newStatus,
      });

      updateData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   ******************************************************
      Change Status  functionality end  here 
  *************************************************
     */

  /**
   ******************************************************
      Handle Delete functionality start from here 
  *************************************************
     */

  async function handleDeleteProduct(id, image) {
    try {
      var st = getStorage();
      await deleteDoc(doc(db, 'products', id)).then(() => {
        for (const images of image) {
          if (image.length !== 0) {
            var reference = ref(st, images);
            deleteObject(reference);
          }
        }
        deleteData(id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   ******************************************************
      Handle Delete functionality end  here 
  *************************************************
     */

  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      {deletepopup === true || statusPopup==true  ? <div className="bg_black_overlay"></div> : ''}
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Products</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={24} src={filtericon} alt="filtericon" />
              Filter
            </button>
            <Link
              to="/catalog/addproduct"
              className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={20} src={addicon} alt="add-icon" />
              Add New Product
            </Link>
          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-3 bg-white product_shadow mt-4">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1350">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th onClick={() => sorting("name")} className="mw_300 p-3">
                      <div className="d-flex align-items-center">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          Product
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th className="mw_300 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Short Discription </h3>
                    </th>
                    <th  className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Category</h3>
                    </th>
                    <th className="mw_130 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Stock</h3>
                    </th>
                    <th onClick={() => sorting("status")} className="mw_130 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Status</h3>
                    </th>
                    <th className="mx_100 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Price</h3>
                    </th>
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {data.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td className="p-3 mw_300">
                          <label className="check1 fw-400 fs-sm black mb-0">
                            <div className="d-flex align-items-center">
                              <div className="w_40">
                                <img src={value.productImages} alt="" />
                              </div>
                              <div className="ps-3 ms-1">
                                <p className="fw-400 fs-sm black mb-0">{value.name}</p>
                                <div className="d-flex align-items-center">
                                  <p className="mb-0 fs-xxs fw-400 fade_grey d-flex flex-column">
                                    <span className="pe-1"> ID : {value.id} </span>
                                    <span>SKU : {value.sku}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={value.checked || false}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <span className="checkmark me-5"></span>
                          </label>
                        </td>
                        <td className="p-3 mw_300">
                          <h3 className="fs-xs fw-400 black mb-0">{value.shortDescription}</h3>
                        </td>
                        <td className="p-3 mw_160">
                          <h3 className="fs-sm fw-400 black mb-0">{value.categories.name}</h3>
                        </td>
                        <td className="p-3 mw_130">
                          <h3 className="fs-sm fw-400 black mb-0 stock_bg white_space_nowrap">
                            {value.totalStock}
                          </h3>
                        </td>
                        <td className="p-3 mw_130">
                          <h3 className="fs-sm fw-400 black mb-0">{value.status}</h3>
                        </td>
                        <td className="p-3 mx_100">
                          <h3 className="fs-sm fw-400 black mb-0">
                            {value.varients[0].originalPrice}
                          </h3>
                        </td>
                        <td className="text-center mx_100">
                          <div class="dropdown">
                            <button
                              class="btn dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton3"
                              data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <img
                                // onClick={() => {
                                //  ;
                                // }}
                                src={dropdownDots}
                                alt="dropdownDots"
                              />
                            </button>
                            <ul
                              class="dropdown-menu categories_dropdown"
                              aria-labelledby="dropdownMenuButton3">
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
                                    <p className="fs-sm fw-400 black mb-0 ms-2">Edit Product</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div
                                  class="dropdown-item"
                                  href="#"
                                  onClick={() => {
                                    setProductId(value.id);
                                    setProductStatus(value.status);
                                    setStatusPopup(true);
                                  }}>
                                  <div className="d-flex align-items-center categorie_dropdown_options">
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
                                    onClick={() => {
                                      setProductId(value.id);
                                      setProductImage(value.image);
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
            </div>
            {deletepopup ? (
              <Deletepopup
                showPopup={setDeletePopup}
                handleDelete={() =>
                  handleDeleteProduct(ProductId, ProductImage)
                }
                itemName="Product"
              />
            ) : null}
            {statusPopup ? (
              <Updatepopup
                statusPopup={setStatusPopup}
                handelStatus={() =>
                  handleChangeStatus(ProductId, productStatus)
                }
                itemName="Product"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListComponent;

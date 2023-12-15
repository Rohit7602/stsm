import React, { useEffect, useState } from 'react';
import filtericon from '../Images/svgs/filtericon.svg';
import addicon from '../Images/svgs/addicon.svg';
import dropdownDots from '../Images/svgs/dots2.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import updown_icon from '../Images/svgs/arross.svg';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, NavLink } from 'react-router-dom';
import Modifyproduct from './Modifyproduct';

const ProductListComponent = () => {
  const [selectedProduct, setselectedProduct] = useState(null);
  const [data, setData] = useState([]);


  // checkbox all functionlatiy start from here
  const [selectAll, setSelectAll] = useState(false);
  const [individualCheckboxes, setIndividualCheckboxes] = useState(
    Array.from({ length: data.length }, () => false)
  );

  const handleMainCheckboxChange = () => {
    setSelectAll(!selectAll);
    setIndividualCheckboxes(Array.from({ length: data.length }, () => !selectAll));
  };

  const handleIndividualCheckboxChange = (index) => {
    const newCheckboxes = [...individualCheckboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setIndividualCheckboxes(newCheckboxes);
    if (newCheckboxes.every((checkbox) => checkbox)) {
      setSelectAll(true);
    } else if (newCheckboxes.some((checkbox) => !checkbox)) {
      setSelectAll(false);
    }
    console.log(setSelectAll);
  };

  // checbox all functionality end  here

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
        });
        setData([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'products', id)).then(() => {
        setData(data.filter((item) => item.id !== id));
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
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
              to="/addproduct"
              className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={20} src={addicon} alt="add-icon" />
              Add New Product
            </Link>
          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-3 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1350">
              <table className="w-100">
                <tr className="product_borderbottom">
                  <th className="mw_300 p-3">
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
                  <th className="mw-200 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Category</h3>
                  </th>
                  <th className="mw_130 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Stock</h3>
                  </th>
                  <th className="mw_130 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Status</h3>
                  </th>
                  <th className="mw_160 p-3">
                    <h3 className="fs-sm fw-400 black mb-0">Price</h3>
                  </th>
                  <th className="mx_100 p-3 pe-4 text-center">
                    <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                  </th>
                </tr>
                {data.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="p-3">
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
                            checked={individualCheckboxes[index]}
                            onChange={() => handleIndividualCheckboxChange(index)}
                          />
                          <span className="checkmark me-5"></span>
                        </label>
                      </td>
                      <td className="p-3">
                        <h3 className="fs-xs fw-400 black mb-0">{value.shortDescription}</h3>
                      </td>
                      <td className="p-3">
                        <h3 className="fs-sm fw-400 black mb-0">{value.categories.name}</h3>
                      </td>
                      <td className="p-3">
                        <h3 className="fs-sm fw-400 black mb-0 stock_bg white_space_nowrap">
                          50 in Stock
                        </h3>
                      </td>
                      <td className="p-3">
                        <h3 className="fs-sm fw-400 black mb-0">{value.status}</h3>
                      </td>
                      <td className="p-3">
                        <h3 className="fs-sm fw-400 black mb-0">{value.originalPrice}</h3>
                      </td>
                      <td className="text-center">
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
                              <div class="dropdown-item" href="#">
                                <div className="d-flex align-items-center categorie_dropdown_options">
                                  <img src={updown_icon} alt="" />
                                  <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="dropdown-item" href="#">
                                <div
                                  onClick={() => handleDelete(value.id)}
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
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListComponent;

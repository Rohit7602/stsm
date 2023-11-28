import React, { useState } from 'react';
import addicon from '../Images/svgs/addicon.svg';
import search from '../Images/svgs/search.svg';
import dropdownDots from '../Images/svgs/dots2.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import updown_icon from '../Images/svgs/arross.svg';
import Modifyproduct from './Modifyproduct';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryItems } from '../Common/Helper';
const Categories = () => {
  const [data, setData] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'sub_categories'));
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

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'sub_categories', id)).then(() => {
        setData(data.filter((item) => item.id !== id));
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
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
              />
            </div>
            <Link
              to="/newcategory"
              className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={20} src={addicon} alt="add-icon" />
              Add New Category
            </Link>
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
                          onChange={() => setSelectAll(!selectAll)}
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </th>
                  <th className="mw-250 px-2">
                    <h3 className="fs-sm fw-400 black mb-0">Parent Category</h3>
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
                {data.map((value, index) => {
                  return (
                    <tr key={index} className="product_borderbottom">
                      <td className="py-3 ps-3">
                        <div className="d-flex align-items-center gap-3 w-25 w-md-50">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            {value.title}
                            <input type="checkbox" checked={selectAll} />
                            <span class="checkmark"></span>
                          </label>
                        </div>
                      </td>
                      <td className="px-2">
                        <h3 className="fs-sm fw-400 black mb-0">{value.cat_ID}</h3>
                      </td>
                      <td className="ps-4">
                        <h3 className="fs-sm fw-400 black mb-0 width_10">10</h3>
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
                  );
                })}
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

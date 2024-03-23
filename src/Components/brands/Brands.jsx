import React, { useState } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/delte.svg';
import addImage from '../../Images/svgs/image-add.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
import deleteicon2 from '../../Images/svgs/deleteicon.svg';
import Loader from '../Loader';
const Brands = () => {
  const [selectAll, setSelectAll] = useState([]);
  const [addBrand, setAddBrand] = useState(false);
  const [brandImg, setaBrandImg] = useState(null);
  const brandData = [
    {
      id: '1',
      brandName: 'Brand Name',
      totalProducts: 120,
    },
    {
      id: '2',
      brandName: 'Brand Name',
      totalProducts: 120,
    },
    {
      id: '3',
      brandName: 'Brand Name',
      totalProducts: 120,
    },
    {
      id: '4',
      brandName: 'Brand Name',
      totalProducts: 120,
    },
    {
      id: '5',
      brandName: 'Brand Name',
      totalProducts: 120,
    },
  ];
  function handleMainCheckboxChange() {
    if (brandData.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = brandData.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }
  function handleCheckboxChange(e) {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectAll([...selectAll, value]);
    } else {
      setSelectAll((prev) =>
        prev.filter((id) => {
          return id != value;
        })
      );
    }
  }
  function handleUploadImage(e) {
    setaBrandImg(e.target.files[0]);
  }

  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      {addBrand ? <div className="bg_black_overlay"></div> : null}
      {addBrand ? (
        <div className="add_brand">
          <form action="">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="fs-2sm fw-400 black m-0">Add New Brand</p>
              <img
                onClick={() => setAddBrand(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <div className="d-flex align-items-center">
              <label className="fs-sm fw-400 black white_space_nowrap me-2" htmlFor="brandName">
                Brand Name
              </label>
              <input
                className="brand_name outline_none"
                type="text"
                id="brandName"
                placeholder="name of Brand"
              />
            </div>
            <div className="d-flex align-items-star mt-3 pt-1">
              <p className="fs-sm fw-400 black white_space_nowrap me-5 pe-1">Image</p>
              <input type="file" id="image" hidden onChange={handleUploadImage} />
              {!brandImg ? (
                <label
                  htmlFor="image"
                  className="brand_image_upload d-flex align-items-center justify-content-center text-center flex-column">
                  <img src={addImage} alt="addImage" />
                  <p className="fs-sm fw-500 black my-2">
                    drop your image here or <span className="fw-400 color_blue">browse</span>
                  </p>
                  <p className="fs-xxs fw-400 black opacity-75 m-0">Support JPG JP779890, PNG</p>
                </label>
              ) : (
                <div className="position-relative w-100">
                  {brandImg && (
                    <img
                      height={157}
                      className="w-100 object-fit-cover"
                      src={URL.createObjectURL(brandImg)}
                      alt="brandImg"
                    />
                  )}
                  <img
                    onClick={() => setaBrandImg(null)}
                    className="position-absolute end-0 top-0 cursor_pointer"
                    src={deleteicon2}
                    alt="deleteicon2"
                  />
                </div>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
              <button className="fs-sm fw-400 black brand_rest_btn">Reset</button>
              <button className="fs-sm fw-400 black brand_upload_btn">Upload</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="w-100 px-sm-3 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500   black fs-lg mb-0">Brands</h1>
          </div>
          <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
            <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                className="fw-400 categorie_input  "
                placeholder="Search for Brands..."
              />
            </div>
            <div>
              <button
                onClick={() => setAddBrand(true)}
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Brand
              </button>
            </div>
          </div>
        </div>
        {/* categories details  */}
        <div className="p-3 mt-3 bg-white product_shadow ">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom w-100">
                    <th className="py-3 ps-3">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={brandData.length === selectAll.length}
                            onChange={handleMainCheckboxChange}
                          />
                          <span class="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0">Brand Name / Title</p>
                      </div>
                    </th>
                    <th className="mx_160 text-center pe-4">
                      <h3 className="fs-sm fw-400 black mb-0">Total Products</h3>
                    </th>
                    <th className="mw-90 p-3 me-1">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {brandData.map((value, index) => {
                    return (
                      <tr key={index} className="product_borderbottom">
                        <td className="py-3 ps-3 w-100">
                          <div className="d-flex align-items-center gap-3 min_width_300">
                            <label className="check1 fw-400 fs-sm black mb-0">
                              <input
                                type="checkbox"
                                value={value.id}
                                checked={selectAll.includes(value.id)}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmark me-5"></span>
                            </label>
                            <div>
                              <p className="fw-400 fs-sm black mb-0">{value.brandName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="mx_160 text-center pe-4">
                          <h3 className="fs-sm fw-400 black mb-0 color_green text-center">
                            {value.totalProducts}
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
                                    <img src={pencil_icon} alt="" />
                                    <p className="fs-sm fw-400 black mb-0 ms-2">Edit</p>
                                  </div>
                                </div>
                              </li>
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
                                    <img src={deleteicon} alt="" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;

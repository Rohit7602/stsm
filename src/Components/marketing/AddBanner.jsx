import React, { useState } from 'react';
import { useMainCategories, useSubCategories, } from "../../context/categoriesGetter";
import saveicon from "../../Images/svgs/saveicon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import searchIcon from "../../Images/svgs/search.svg";
import editIcon from "../../Images/svgs/pencil.svg";


const AddBanner = (props) => {
    let showdelPopup = props.onExit;
    function handehidePopup() {
        showdelPopup(false);
    }

    const [bannerPopupImg, setBannerPopupImg] = useState("");
    // const [uploadBannerPopup, setUploadBannerPopup] = useState(false);
    const [searchvalue, setSearchvalue] = useState("");
    const [relatdCat, setRelatedCat] = useState("");
    const [priority, setPriority] = useState('')

    let subcategories = useSubCategories().data
    let maincategories = useMainCategories().categoreis
    let AllCategory = [...maincategories, ...subcategories];


    let AllImageData = {
        image: bannerPopupImg,
        category: relatdCat,
        priority: priority
    }

    function handelBnnerPopup(e) {
        const updloadImg = e.target.files[0];
        setBannerPopupImg(updloadImg);
    }
    function handelBannerDelete() {
        setBannerPopupImg("");
    }




    return (
      <div className="bg_black_overlay">
        <div className="large_banner">
          <input
            onChange={handelBnnerPopup}
            hidden
            id="bannerPopup"
            type="file"
          />
          {!bannerPopupImg ? (
            <label
              htmlFor="bannerPopup"
              className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
            >
              + Add Banner
            </label>
          ) : (
            <div className="imagemedia_btn">
              {bannerPopupImg && (
                <img
                  className="w-100 h-100 object-fit-cover"
                  src={URL.createObjectURL(bannerPopupImg)}
                  alt="bannerPopupImg"
                />
              )}
              <img
                onClick={handelBannerDelete}
                className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                src={deleteicon}
                alt="deleteicon"
              />
              <img src={editIcon} alt="editIcon" />
            </div>
          )}
          <p className="fs-sm fw-400 black mt-2 pt-1">Related Category</p>

          <div>
            <div class="dropdown">
              <button
                className="btn dropdown-toggle w-100 p-0"
                type="button"
                id="dropdownMenuButton3"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="banner_search_input d-flex align-items-center justify-content-between">
                  <input
                    value={relatdCat.title}
                    className="w-100 fs-xxs fw-400"
                    placeholder="Select Category"
                    type="text"
                  />
                  <img src={searchIcon} alt="searchIcon" />
                </div>
              </button>
              <ul
                class="dropdown-menu categories_dropdown"
                aria-labelledby="dropdownMenuButton3"
              >
                <li>
                  {AllCategory.map((items) => {
                    return (
                      <div class="dropdown-item" href="#">
                        <div className="categorie_dropdown_options">
                          <p
                            onClick={() => setRelatedCat(items)}
                            className="fs-xxs fw-400 black mb-0 ms-2 w-100"
                          >
                            {items.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <p className="fs-sm fw-400 black mb-0">Priority</p>
              <input
                className="fs-xxs fw-400 priority ms-3 mb-0"
                placeholder="1"
                onWheel={(e) => {
                  e.target.blur();
                }}
                type="number"
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center gap-3 justify-content-end">
              <button
                onClick={() => handehidePopup()}
                className="exit_baner_popup"
              >
                Exit
              </button>
              <button
                onClick={() => props.onSave(AllImageData)}
                className="save_baner_popup"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AddBanner;



import React, { useState } from 'react';
import { useMainCategories, useSubCategories, } from "../../context/categoriesGetter";
import saveicon from "../../Images/svgs/saveicon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import searchIcon from "../../Images/svgs/search.svg";
import editIcon from "../../Images/svgs/pencil.svg";



const AddSmallPattiBanner = (props) => {
    let showdelPopup = props.onExit;
    function handehidePopup() {
        showdelPopup(false);
    }
        const [samllPattiBannerImg, setsamllPattiBannerImg] = useState(null);
        // const [uploadBannerPopup, setUploadBannerPopup] = useState(false);
        const [searchvalue, setSearchvalue] = useState("");
        const [relatdCat, setRelatedCat] = useState("");
        const [priority, setPriority] = useState('')

        let subcategories = useSubCategories().data
        let maincategories = useMainCategories().categoreis
        let AllCategory = [...maincategories, ...subcategories];


        let AllImageData = {
            image: samllPattiBannerImg,
            category: relatdCat,
            priority: priority
        }

        function handelAddSmallPAttiBanner(e) {
            const updloadImg = e.target.files[0];
            setsamllPattiBannerImg(updloadImg);
        }
    function handelsamllPattiBannerDelete() {
            setsamllPattiBannerImg("");
    }
    
        return (
          <div>
            <div className="bg_black_overlay">
              <div className="samll_patti_banner">
                <input
                  onChange={handelAddSmallPAttiBanner}
                  hidden
                  id="samllpattibannerPopup"
                  type="file"
                />
                {!samllPattiBannerImg ? (
                  <label
                    htmlFor="samllpattibannerPopup"
                    className="color_green cursor_pointer fs-sm imagesmallmedia_btn_popup d-flex justify-content-center align-items-center"
                  >
                    + Add Banner
                  </label>
                ) : (
                  <div className="position-relative imagesmallmedia_btn_popup w-100">
                    {samllPattiBannerImg && (
                      <img
                        className="w-100 h-100 object-fit-cover"
                        src={URL.createObjectURL(samllPattiBannerImg)}
                        alt="samllPattiBannerImg"
                      />
                    )}
                    <img
                      onClick={handelsamllPattiBannerDelete}
                      className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                      src={deleteicon}
                      alt="deleteicon"
                    />
                    <img
                      className="p-1 bg-white top-0 end-0 mt-2 me-5 cursor_pointer position-absolute brs_50"
                      src={editIcon}
                      alt="editIcon"
                    />
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
                      placeholder="0"
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
                      onClick={() => {
                        handehidePopup();
                        props.onSave(AllImageData);
                      }}
                      className="save_baner_popup"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }



export default AddSmallPattiBanner;

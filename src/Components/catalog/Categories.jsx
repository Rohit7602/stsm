import React, { useState } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import search from "../../Images/svgs/search.svg";
import dropdownDots from "../../Images/svgs/dots2.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import pencil_icon from "../../Images/svgs/pencil.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import delete_icon from "../../Images/svgs/delte.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import saveicon from "../../Images/svgs/saveicon.svg";
import SearchIcon from "../../Images/svgs/search.svg";
import closeIcon from "../../Images/svgs/closeicon.svg";
import Dropdown from "react-bootstrap/Dropdown";
import savegreenicon from "../../Images/svgs/save_green_icon.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import Accordion from "react-bootstrap/Accordion";
import dubbleArrow from "../../Images/svgs/dubble-arrow.svg";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import minilayoutImgGroup3 from "../../Images/Png/minilayoutImgGroup3.png";
import minilayoutImgGroup4 from "../../Images/Png/minilayoutImgGroup4.png";
import minilayoutImgGroup6 from "../../Images/Png/minilayoutImgGroup6.png";
import minilayoutImgGroup9 from "../../Images/Png/minilayoutImgGroup9.png";
import minilayoutImgGroup8 from "../../Images/Png/minilayoutImgGroup8.png";
import default_img from "../../Images/Png/default_img.png";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Deletepopup from "../popups/Deletepopup";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { storage, db } from "../../firebase";
import {
  useSubCategories,
  useMainCategories,
} from "../../context/categoriesGetter";

import Updatepopup from "../popups/Updatepopup";
import Loader from "../Loader";
import { increment } from "firebase/firestore";
import { useImageHandleContext } from "../../context/ImageHandler";

const Categories = () => {
  // =========={main categroy}

  const { categoreis, addDataParent } = useMainCategories();
  const [loading, setloading] = useState(false);
  const { data, updateSubData, deleteData } = useSubCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState();
  const [perName, setPerName] = useState("");
  const [searchvalue, setSearchvalue] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [selectedSubcategoryparentId, setselectedSubcategoryparentId] =
    useState(null);
  const [selectedSubcategoryImage, setSelectedSubcategoryImage] =
    useState(null);
  const [selectedSubcategoryStatus, setSelectedSubcategoryStatus] =
    useState(null);
  const [deletepopup, setDeletePopup] = useState(false);
  const [cat_id, setCat_ID] = useState("");

  // console.log(data, 'Sub Categories data');

  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };
  const [statusPopup, setStatusPopup] = useState(false);
  const [editCatPopup, setEditCatPopup] = useState(false);
  const [editsearchvalue, setEditSearchvalue] = useState("");

  const [editCatName, setEditCatName] = useState("");
  const [editCatImg, setEditCatImg] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [order, setorder] = useState("ASC");

  const handleSelectCategory = (category) => {
    setEditSearchvalue("");
    setSelectedCategory(category);
    setCategory(category);
  };

  //

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
    updateSubData(sortedData);
  };

  /*  *******************************
      Change status functionality start 
   *********************************************   **/

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === "hidden" ? "published" : "hidden";

      await updateDoc(doc(db, "sub_categories", id), {
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
    setloading(true);
    setEditCatImg("");
    if (typeof editCatImg === "string" && editCatImg.startsWith("http")) {
      setloading(true);
      try {
        if (editCatImg.length !== 0) {
          var st = getStorage();
          var reference = ref(st, editCatImg);
          deleteObject(reference);
        }
        setloading(false);
      } catch (Error) {
        console.log(Error);
      }
      setloading(false);
    }
    setloading(false);
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
    setloading(true);
    try {
      console.log("try is working");
      let imageUrl = null;

      // Handle image upload if it is a file
      if (editCatImg instanceof File) {
        const filename = Math.floor(Date.now() / 1000) + "-" + editCatImg.name;
        const storageRef = ref(storage, `/Sub-categories/${filename}`);
        await uploadBytes(storageRef, editCatImg);
        imageUrl = await getDownloadURL(storageRef);
      } else if (
        typeof editCatImg === "string" &&
        editCatImg.startsWith("http")
      ) {
        imageUrl = editCatImg;
      }
      const matchedCategory = data.find(
        (value) => value.subcategorynumber === Number(categorynumber)
      );

      if (matchedCategory) {
        const matchedCategoryRef = doc(
          db,
          "sub_categories",
          matchedCategory.id
        );
        const currentCategoryRef = doc(
          db,
          "sub_categories",
          selectedSubcategoryId
        );

        const matchedCategorySubcategoryNumber =
          matchedCategory.subcategorynumber;
        const currentCategorySubcategoryNumber = data.find(
          (item) => item.id === selectedSubcategoryId
        ).subcategorynumber;

        const batch = writeBatch(db);
        batch.update(matchedCategoryRef, {
          subcategorynumber: currentCategorySubcategoryNumber,
        });

        batch.update(currentCategoryRef, {
          subcategorynumber: matchedCategorySubcategoryNumber,
        });
        await batch.commit();

        console.log("Swapped subcategorynumbers:", {
          matchedCategory: matchedCategory.subcategorynumber,
          currentCategory: Number(categorynumber),
        });
      }
      const updateData = {
        title: editCatName,
        status: editStatus,
        image: imageUrl,
        updated_at: Date.now(),
        cat_ID: cat_id,
        subcategorynumber: Number(categorynumber),
      };

      if (selectedCategory && selectedCategory.id) {
        updateData.cat_ID = selectedCategory.id;
        let afterchange = selectedCategory.id;

        await updateDoc(doc(db, "categories", cat_id), {
          noOfSubcateogry: increment(-1),
        });

        await updateDoc(doc(db, "categories", afterchange), {
          noOfSubcateogry: increment(1),
        });
      }

      await updateDoc(
        doc(db, "sub_categories", selectedSubcategoryId),
        updateData
      );

      updateSubData({
        selectedSubcategoryId,
        ...updateData,
      });

      setloading(false);

      toast.success("Category updated Successfully", {
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
  const [selectAll, setSelectAll] = useState([]);

  function handleCheckboxs(e) {
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
  function hanelCheckAll() {
    if (data.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = data.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  //  get parent category  function  start from here

  const getParentCategoryName = (catID) => {
    const mainCategory = categoreis.find((category) => category.id === catID);
    return mainCategory ? mainCategory.title : "";
  };

  //  get parent category  function  end  from here

  // =================parent Category

  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [name, setName] = useState();
  const [imageupload, setImageupload] = useState("");
  const [addCatPopup, setAddCatPopup] = useState(false);
  const [editPerCatPopup, setEditPerCatPopup] = useState(false);
  const [editPerentCatStatus, seteditPerentCatStatus] = useState("");
  const [editName, setEditName] = useState("");
  const [editImg, setEditImg] = useState("");
  const [EditCatId, SetEditCatId] = useState("");
  const [EditSelectedLayout, setEditSelectedLayout] = useState("");
  const [status, setStatus] = useState();
  // const [searchvalue, setSearchvalue] = useState('');
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [categorynumber, setCategoryNumber] = useState("");
  // context
  const { ImageisValidOrNot } = useImageHandleContext();
  const { updateData } = useMainCategories();
  //  const { data } = useSubCategories();

  const pubref = useRef();
  const hidref = useRef();
  //  const handleModifyClicked = (index) => {
  //    setSelectedParentCategory(index === selectedParentCategory ? null : index);
  //  };

  // handle image upload functionality start from here
  function handelUpload(e) {
    const selectedFile = e.target.files[0];
    if (!ImageisValidOrNot(selectedFile)) {
      toast.error("Please select a valid image file within 1.5 MB.");
      setImageupload(null);
    } else {
      setImageupload(selectedFile);
    }
  }

  const [selectedLayout, setSelectedLayout] = useState("oneByThree");

  // console.log(data.map((value, index, array) => value.subcategorynumber));

  // ...

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
  };
  const handleEditLayoutChange = (layout) => {
    setEditSelectedLayout(layout);
  };

  //   handle image upload functionality end  here

  /*  *******************************
         Add Parent Category start from here 
    *********************************************   **/

  async function handleSaveParentCategory(e) {
    e.preventDefault();
    try {
      if (name === undefined || null) {
        toast.error("please enter the name of the category ");
      } else if (imageupload.length === 0) {
        toast.error("please upload image of the category ");
      } else if (status === undefined || null) {
        toast.error("please Set the status");
      } else {
        setloading(true);
        const filename = Math.floor(Date.now() / 1000) + "-" + imageupload.name;
        const storageRef = ref(storage, `/Parent-category/${filename}`);
        const upload = await uploadBytes(storageRef, imageupload);
        const imageUrl = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, "categories"), {
          title: name,
          status: status,
          image: imageUrl,
          homepagelayout: selectedLayout,
          created_at: Date.now(),
          updated_at: Date.now(),
          noOfSubcateogry: 0,
          categorynumber: categoreis.length + 1,
        });
        setloading(false);
        toast.success("Category added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        HandleResetForm();
        setAddCatPopup(false);
        setRefreshData((prevState) => !prevState);
        // context
        addDataParent(docRef);
      }
    } catch (e) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(e);
    }
  }

  function HandleResetForm() {
    setName("");
    setImageupload("");
    setStatus("");
  }

  /*  *******************************
     Add Parent Category end  here 
  *********************************************   **/

  function handleDelete22(index) {
    setImageupload();
  }

  /*  *******************************
   checkbox functionality start 
 *********************************************   **/
  const [selectAllPer, setselectAllPerPer] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = categoreis.every((item) => item.checked);
    setselectAllPerPer(allChecked);
  }, [categoreis]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = categoreis.map((item) => ({
      ...item,
      checked: !selectAllPer,
    }));
    updateData(updatedData);
    setselectAllPerPer(!selectAllPer);
  };

  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...categoreis];
    updatedData[index].checked = !categoreis[index].checked;
    updateData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setselectAllPerPer(allChecked);
  };

  /*  *******************************
     Checbox  functionality end 
   *********************************************   **/

  /*  *******************************
     get count of items in maincategory   functionality start 
  *********************************************   **/

  const getSubcategoriesCount = (ID) => {
    const subCategory = data.filter((category) => category.cat_ID === ID);
    return subCategory.length;
  };

  /*  *******************************
      get count of items in maincategory    functionality end 
  *********************************************   **/

  /*  *******************************

      Change status functionality start 
  *********************************************   **/

  async function handleChangeStatus(id, status) {
    try {
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = status === "hidden" ? "published" : "hidden";
      await updateDoc(doc(db, "categories", id), {
        status: newStatus,
      });
      toast.success("Status  Changed Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      updateData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  }

  async function HandleChangeToDraft(e) {
    e.preventDefault();
    try {
      setloading(true);
      const newStatus = "hidden";
      for (let ids of selectAll) {
        await updateDoc(doc(db, "sub_categories", ids), {
          status: newStatus,
        });

        updateData({ ids, status: newStatus });
      }
      setloading(false);
      toast.success("Status  Changed Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectAll([]);
    } catch (error) {
      setloading(false);
      console.log("Error in change status", error);
    }
  }

  async function HandleChangeToLive(e) {
    e.preventDefault();
    try {
      setloading(true);
      const newStatus = "published";
      for (let ids of selectAll) {
        await updateDoc(doc(db, "sub_categories", ids), {
          status: newStatus,
        });

        updateData({ ids, status: newStatus });
      }
      setloading(false);
      toast.success("Status  Changed Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectAll([]);
    } catch (error) {
      setloading(false);
      console.log("Error in change status", error);
    }
  }

  /*  *******************************
        Change status functionality end 
   *********************************************   **/

  /*  *******************************
      Edit  Image Upload   functionality start 
 *********************************************   **/

  function HanleEditImgUpload(e) {
    const selectedFile = e.target.files[0];
    if (!ImageisValidOrNot(selectedFile)) {
      toast.error("Please select a valid image file within 1.5 MB. ");
      setEditImg(null);
    } else {
      setEditImg(selectedFile);
    }
  }

  /*  *******************************
     Edit  Image  upload  functionality start 
 *********************************************   **/

  /*  *******************************
   Edit  Image  functionality start 
 *********************************************   **/

  function HandleDeleteEditImg() {
    setLoaderstatus(true);
    setEditImg("");
    if (typeof editImg === "string" && editImg.startsWith("http")) {
      try {
        if (editImg.length !== 0) {
          var st = getStorage();
          var reference = ref(st, editImg);
          deleteObject(reference);
        }
        setLoaderstatus(false);
      } catch (Error) {
        setLoaderstatus(false);
        console.log(Error);
      }
    }
  }

  /*  *******************************
     Edit  Image  functionality end 
  *********************************************   **/

  /*  *******************************
    Edit Parent  Category   functionality start 
 *********************************************   **/
  // async function HandleSaveEditCategory(e) {
  //   e.preventDefault();
  //   setEditPerCatPopup(false);
  //   setLoaderstatus(true);
  //   try {
  //     let imageUrl = null;
  //     if (editImg instanceof File) {
  //       // Handle the case where editCatImg is a File
  //       const filename = Math.floor(Date.now() / 1000) + "-" + editImg.name;
  //       const storageRef = ref(storage, `/Parent-category/${filename}`);
  //       await uploadBytes(storageRef, editImg);
  //       imageUrl = await getDownloadURL(storageRef);
  //     } else if (typeof editImg === "string" && editImg.startsWith("http")) {
  //       // Handle the case where editCatImg is a URL
  //       imageUrl = editImg;
  //     }

  //     await updateDoc(doc(db, "categories", EditCatId), {
  //       title: editName,
  //       status: editPerentCatStatus,
  //       image: imageUrl,
  //       homepagelayout: EditSelectedLayout,
  //       updated_at: Date.now(),
  //     });

  //     updateData({
  //       EditCatId,
  //       title: editName,
  //       status: editPerentCatStatus,
  //       image: imageUrl,
  //       homepagelayout: EditSelectedLayout,
  //       updated_at: Date.now(),
  //     });

  //     setLoaderstatus(false);
  //     toast.success("Parent Category updated Successfully", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   } catch (error) {
  //     setLoaderstatus(false);
  //     toast.error(error, {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  // }

async function HandleSaveEditCategory(e) {
  e.preventDefault();
  setEditPerCatPopup(false);
  setLoaderstatus(true);
  try {
    let imageUrl = null;
    // Handle image upload if it's a File
    if (editImg instanceof File) {
      const filename = Math.floor(Date.now() / 1000) + "-" + editImg.name;
      const storageRef = ref(storage, `/Parent-category/${filename}`);
      await uploadBytes(storageRef, editImg);
      imageUrl = await getDownloadURL(storageRef);
    } else if (typeof editImg === "string" && editImg.startsWith("http")) {
      // Handle image URL
      imageUrl = editImg;
    }
    const matchedCategory = categoreis.find(
      (value) => value.categorynumber === Number(categorynumber)
    );
    if (matchedCategory && matchedCategory.id !== EditCatId) {
      const matchedCategoryRef = doc(db, "categories", matchedCategory.id);
      const currentCategoryRef = doc(db, "categories", EditCatId);
      const currentCategory = categoreis.find((item) => item.id === EditCatId);
      if (matchedCategory && currentCategory) {
        const matchedCategoryCategoryNumber = matchedCategory.categorynumber;
        const currentCategoryCategoryNumber = currentCategory.categorynumber;
        const batch = writeBatch(db); 
        batch.update(matchedCategoryRef, {
          categorynumber: currentCategoryCategoryNumber,
        });
        batch.update(currentCategoryRef, {
          categorynumber: matchedCategoryCategoryNumber,
        });
        await batch.commit();
        console.log("Swapped categorynumbers:", {
          matchedCategory: matchedCategoryCategoryNumber,
          currentCategory: currentCategoryCategoryNumber,
        });
      }
    } else {
      console.log("No matching category found or trying to swap with itself.");
    }
    // Update the current category details
    const updateData = {
      title: editName,
      status: editPerentCatStatus,
      image: imageUrl,
      homepagelayout: EditSelectedLayout,
      updated_at: Date.now(),
      categorynumber: Number(categorynumber),
    };
    // Update the current category in Firestore
    await updateDoc(doc(db, "categories", EditCatId), updateData);
    // Update the local state after category update
    updateData({
      EditCatId,
      title: editName,
      status: editPerentCatStatus,
      image: imageUrl,
      categorynumber: Number(categorynumber),
      homepagelayout: EditSelectedLayout,
      updated_at: Date.now(),
    });
    setLoaderstatus(false);
    toast.success("Parent Category updated Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    setLoaderstatus(false);
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
}



  /*   *******************************
      Edit  Parent  Category  functionality end 
   *********************************************   **/

  if (loading) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        {deletepopup ||
        statusPopup ||
        editCatPopup ||
        editPerCatPopup ||
        addCatPopup ? (
          <div className="bg_black_overlay"></div>
        ) : null}
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
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              >
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Category
              </Link>
            </div>
          </div>
          {/* categories details  */}
          {selectAll.length > 1 ? (
            <div className="d-flex align-items-center gap-3 mt-3 pt-1">
              <button
                className="change_to_draft fs-sm fw-400 black"
                onClick={HandleChangeToDraft}
              >
                Change To Draft
              </button>
              <button
                className="change_to_live fs-sm fw-400 black"
                onClick={HandleChangeToLive}
              >
                Change To Live
              </button>
            </div>
          ) : null}
          <div className="p-3 mt-4">
            <div className="">
              <div className="d-flex flex-nowrap">
                <div className="product_shadow bg-white overflow_xl_scroll line_scroll  transition_04">
                  <div style={{ minWidth: "845px" }}>
                    <table className="w-100">
                      <thead className="w-100 table_head">
                        <tr className="product_borderbottom">
                          <th
                            onClick={() => sorting("title")}
                            className="py-3 ps-3 mx_220 cursor_pointer"
                          >
                            <div className="d-flex align-items-center gap-3 min_width_230">
                              <label class="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={data.length === selectAll.length}
                                  onChange={hanelCheckAll}
                                />
                                <span class="checkmark"></span>
                              </label>
                              <p className="fw-400 fs-sm black mb-0 ms-2">
                                Name{" "}
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
                          <th
                            onClick={() => sorting("cat_ID")}
                            className="mx_170 px-2"
                          >
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
                          <th className=" mx_100 ps-2">
                            <h3 className="fs-sm fw-400 black mb-0 text-center">
                              Items
                            </h3>
                          </th>
                          <th
                            onClick={() => sorting("status")}
                            className="mx_160 cursor_pointer"
                          >
                            <p className="fw-400 fs-sm black mb-0 text-center">
                              Visibility{" "}
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
                      <tbody
                        className={`${
                          selectAll.length > 1 ? "table_body2" : "table_body"
                        }`}
                      >
                        {data
                          .filter((item) => {
                            // const mainCategory = categoreis.find(
                            //   (category) => category.id === item.cat_ID
                            // );
                            return search.toLowerCase() === ""
                              ? item
                              : item.title.toLowerCase().includes(searchvalue);
                          })
                          .sort((a, b) => {
                            const priority = ["published", "other", "hidden"];
                            const priorityA = priority.indexOf(
                              a.status.toLowerCase()
                            );
                            const priorityB = priority.indexOf(
                              b.status.toLowerCase()
                            );
                            return priorityA - priorityB;
                          })

                          .map((value, index) => {
                            const subcategoryId = value.id;
                            const subcategoryImage = value.image;
                            return (
                              <tr
                                key={index}
                                className={`product_borderbottom ${
                                  value.status === "hidden" ? "bg_layer" : ""
                                }`}
                              >
                                <td className="py-3 ps-3 mx_220">
                                  <div className="d-flex align-items-center gap-3 min_width_230">
                                    <label class="check1 fw-400 fs-sm black mb-0">
                                      <input
                                        value={value.id}
                                        type="checkbox"
                                        checked={selectAll.includes(value.id)}
                                        onChange={handleCheckboxs}
                                      />
                                      <span class="checkmark"></span>
                                    </label>
                                    <div className="d-flex align-items-center ms-2">
                                      <div className="w_40">
                                        <img
                                          src={
                                            value.image
                                              ? value.image
                                              : default_img
                                          }
                                          alt="categoryImg"
                                        />
                                      </div>
                                      <div className="ps-3 ms-1">
                                        <p className="fw-400 fs-sm black mb-0">
                                          {value.title}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-2 mx_170">
                                  <h3 className="fs-sm fw-400 black mb-0">
                                    {getParentCategoryName(value.cat_ID)}
                                  </h3>
                                </td>
                                <td className="ps-2 mx_100">
                                  <h3 className="fs-sm fw-400 black mb-0  text-center">
                                    {value.noOfProducts}
                                  </h3>
                                </td>
                                <td className="mx_160 text-center">
                                  <h3 className="fs-sm fw-400 black mb-0 color_green">
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
                                      aria-expanded="false"
                                    >
                                      <abbr title="View">
                                        <img
                                          src={dropdownDots}
                                          alt="dropdownDots"
                                        />
                                      </abbr>
                                    </button>
                                    <ul
                                      class="dropdown-menu categories_dropdown"
                                      aria-labelledby="dropdownMenuButton1"
                                    >
                                      <li>
                                        <div class="dropdown-item" href="#">
                                          <div className="d-flex align-items-center categorie_dropdown_options">
                                            <img src={eye_icon} alt="" />
                                            <p className="fs-sm fw-400 black mb-0 ms-2">
                                              View Details
                                            </p>
                                          </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div class="dropdown-item" href="#">
                                          <div
                                            onClick={() => {
                                              setEditCatPopup(true);
                                              setSelectedSubcategoryId(
                                                value.id
                                              );
                                              setEditCatName(value.title);
                                              setEditCatImg(value.image);
                                              setSelectedCategory(
                                                getParentCategoryName(
                                                  value.cat_ID
                                                )
                                              );
                                              setEditStatus(value.status);
                                              setCat_ID(value.cat_ID);
                                              setCategoryNumber(
                                                value.subcategorynumber
                                              );
                                            }}
                                            className="d-flex align-items-center categorie_dropdown_options"
                                          >
                                            <img src={pencil_icon} alt="" />
                                            <p className="fs-sm fw-400 black mb-0 ms-2">
                                              Edit Category
                                            </p>
                                          </div>
                                        </div>
                                      </li>
                                      <li>
                                        <div class="dropdown-item" href="#">
                                          <div
                                            className="d-flex align-items-center categorie_dropdown_options"
                                            onClick={() => {
                                              setSelectedSubcategoryId(
                                                value.id
                                              );
                                              setSelectedSubcategoryStatus(
                                                value.status
                                              );
                                              setStatusPopup(true);
                                            }}
                                          >
                                            <img src={updown_icon} alt="" />
                                            <p className="fs-sm fw-400 green mb-0 ms-2">
                                              {value.status === "hidden"
                                                ? "change to  publish"
                                                : "Change to hidden"}
                                            </p>
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
                <div className="p-0">
                  <div className="w-100 ps-sm-3 bg_body">
                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between position-relative">
                      <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
                        <div>
                          {addCatPopup === true ? (
                            <div className="parent_category_popup">
                              <form
                                action=""
                                onSubmit={(e) => handleSaveParentCategory(e)}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="fs-4 fw-400 black mb-0">
                                    New Parent Category
                                  </p>
                                  <div className="d-flex align-items-center gap-3">
                                    <button
                                      onClick={() => setAddCatPopup(false)}
                                      className="reset_border"
                                    >
                                      <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                                        Cancel
                                      </button>
                                    </button>
                                    <button
                                      type="submit"
                                      className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn"
                                    >
                                      <img src={saveicon} alt="saveicon" />
                                      <p className="fs-sm fw-400 black mb-0 ps-1">
                                        Save
                                      </p>
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <h2 className="fw-400 fs-2sm black mb-0">
                                    Basic Information
                                  </h2>
                                  {/* ist input */}
                                  <label
                                    htmlFor="Name"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Name
                                  </label>
                                  <br />
                                  <input
                                    type="text"
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="Enter Category name"
                                    id="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                  />{" "}
                                  <br />
                                  {/* 2nd input */}
                                  <label
                                    htmlFor="des"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Category Image
                                  </label>{" "}
                                  <br />
                                  <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                                    {!imageupload ? (
                                      <input
                                        type="file"
                                        id="file22"
                                        hidden
                                        accept="/*"
                                        multiple
                                        onChange={handelUpload}
                                      />
                                    ) : (
                                      <div className=" d-flex flex-wrap">
                                        <div className="position-relative ">
                                          <img
                                            className="mobile_image object-fit-cover"
                                            src={URL.createObjectURL(
                                              imageupload
                                            )}
                                            alt=""
                                          />
                                          <img
                                            className="position-absolute top-0 end-0 cursor_pointer"
                                            src={deleteicon}
                                            alt="deleteicon"
                                            onClick={handleDelete22}
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {!imageupload ? (
                                      <label
                                        htmlFor="file22"
                                        className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center"
                                      >
                                        + Add Media
                                      </label>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="banner_advertisement mt-4">
                                  <Accordion className="w-100 rounded-none bg-white product_input py-0">
                                    <Accordion.Header className="bg_grey fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                                      <div className="d-flex justify-content-between w-100 py-3">
                                        <h3 className="fs-sm fw-400 black mb-0">
                                          Select Homepage Layout
                                        </h3>
                                      </div>
                                    </Accordion.Header>
                                    <Accordion.Body className="py-2 px-0">
                                      <div className="d-flex align-items-start gap-4">
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1">
                                            <input
                                              id="one"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleLayoutChange("oneByThree")
                                              }
                                              checked={
                                                selectedLayout === "oneByThree"
                                              }
                                            />
                                            <label
                                              htmlFor="one"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              1 x 3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup3}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1">
                                            <input
                                              id="two"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleLayoutChange("twoByTwo")
                                              }
                                              checked={
                                                selectedLayout === "twoByTwo"
                                              }
                                            />
                                            <label
                                              htmlFor="two"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              2 x 2
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup4}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1">
                                            <input
                                              id="three"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleLayoutChange("threeByTwo")
                                              }
                                              checked={
                                                selectedLayout === "threeByTwo"
                                              }
                                            />
                                            <label
                                              htmlFor="three"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              3 x 2
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup6}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1">
                                            <input
                                              id="four"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleLayoutChange(
                                                  "threeByThree"
                                                )
                                              }
                                              checked={
                                                selectedLayout ===
                                                "threeByThree"
                                              }
                                            />
                                            <label
                                              htmlFor="four"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              3 x 3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup9}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1">
                                            <input
                                              id="five"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleLayoutChange(
                                                  "twoByTwoWithList"
                                                )
                                              }
                                              checked={
                                                selectedLayout ===
                                                "twoByTwoWithList"
                                              }
                                            />
                                            <label
                                              htmlFor="five"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              2 x 2 Inline3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup8}
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                    </Accordion.Body>
                                  </Accordion>
                                </div>
                                <div className="mt-4">
                                  <h2 className="fw-400 fs-2sm black mb-0">
                                    Status
                                  </h2>
                                  <div className="d-flex align-items-center gap-5">
                                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                                      <label class="check fw-400 fs-sm black mb-0">
                                        Published
                                        <input
                                          ref={pubref}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setStatus("published");
                                              hidref.current.checked = false;
                                            }
                                          }}
                                          type="checkbox"
                                        />
                                        <span class="checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                                      <label class="check fw-400 fs-sm black mb-0">
                                        Hidden
                                        <input
                                          ref={hidref}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setStatus("hidden");
                                              pubref.current.checked = false;
                                            }
                                          }}
                                          type="checkbox"
                                        />
                                        <span class="checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          ) : null}
                          {editPerCatPopup === true ? (
                            <div className="parent_category_popup">
                              <form action="">
                                <div className="d-flex align-items-center justify-content-between">
                                  <p className="fs-4 fw-400 black mb-0">
                                    Edit Parent Category
                                  </p>
                                  <div className="d-flex align-items-center gap-3">
                                    <button
                                      onClick={() => {
                                        setEditPerCatPopup(false);
                                        setSelectedLayout("oneByThree");
                                      }}
                                      className="reset_border"
                                    >
                                      <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                                        Cancel
                                      </button>
                                    </button>
                                    <button
                                      onClick={HandleSaveEditCategory}
                                      type="submit"
                                      className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn"
                                    >
                                      <img src={saveicon} alt="saveicon" />
                                      <p className="fs-sm fw-400 black mb-0 ps-1">
                                        Save
                                      </p>
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <h2 className="fw-400 fs-2sm black mb-0">
                                    Basic Information
                                  </h2>
                                  {/* ist input */}
                                  <label
                                    htmlFor="Name"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Name
                                  </label>
                                  <br />
                                  <input
                                    type="text"
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="Enter Category name"
                                    id="Name"
                                    value={editName}
                                    onChange={(e) =>
                                      setEditName(e.target.value)
                                    }
                                  />{" "}
                                  <br />
                                  {/* 2nd input */}
                                  <label
                                    htmlFor="des"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Category Image
                                  </label>{" "}
                                  <br />
                                  <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                                    {!editImg ? (
                                      <input
                                        type="file"
                                        id="file23"
                                        hidden
                                        accept="/*"
                                        multiple
                                        onChange={HanleEditImgUpload}
                                      />
                                    ) : (
                                      <div className=" d-flex flex-wrap">
                                        <div className="position-relative ">
                                          <img
                                            className="mobile_image object-fit-cover"
                                            // src={URL.createObjectURL(editImg)}
                                            src={
                                              editImg &&
                                              typeof editImg === "string" &&
                                              editImg.startsWith("http")
                                                ? editImg
                                                : URL.createObjectURL(editImg)
                                            }
                                            alt=""
                                          />
                                          <abbr title="Delete">
                                            <img
                                              className="position-absolute top-0 end-0 cursor_pointer"
                                              src={deleteicon}
                                              alt="deleteicon"
                                              onClick={() =>
                                                HandleDeleteEditImg()
                                              }
                                            />
                                          </abbr>
                                        </div>
                                      </div>
                                    )}

                                    {!editImg ? (
                                      <label
                                        htmlFor="file23"
                                        className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center"
                                      >
                                        + Add Media
                                      </label>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="banner_advertisement mt-4">
                                  <Accordion className="w-100 rounded-none bg-white product_input py-0">
                                    <Accordion.Header className="bg_grey fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                                      <div className="d-flex justify-content-between w-100 py-3">
                                        <h3 className="fs-sm fw-400 black mb-0">
                                          Select Homepage Layout
                                        </h3>
                                      </div>
                                    </Accordion.Header>
                                    <Accordion.Body className="py-2 px-0">
                                      <div className="d-flex align-items-start gap-4">
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1 cursor_pointer">
                                            <input
                                              id="one"
                                              className="raido-black"
                                              type="radio"
                                              onChange={() =>
                                                handleEditLayoutChange(
                                                  "oneByThree"
                                                )
                                              }
                                              checked={
                                                EditSelectedLayout ===
                                                "oneByThree"
                                              }
                                            />
                                            <label
                                              htmlFor="one"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              1 x 3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup3}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1 cursor_pointer">
                                            <input
                                              id="two"
                                              className="raido-black"
                                              type="radio"
                                              onChange={() =>
                                                handleEditLayoutChange(
                                                  "twoByTwo"
                                                )
                                              }
                                              checked={
                                                EditSelectedLayout ===
                                                "twoByTwo"
                                              }
                                            />
                                            <label
                                              htmlFor="two"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              2 x 2
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup4}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1 cursor_pointer">
                                            <input
                                              id="three"
                                              className="raido-black"
                                              type="radio"
                                              onChange={() =>
                                                handleEditLayoutChange(
                                                  "threeByTwo"
                                                )
                                              }
                                              checked={
                                                EditSelectedLayout ===
                                                "threeByTwo"
                                              }
                                            />
                                            <label
                                              htmlFor="three"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              3 x 2
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup6}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1 cursor_pointer">
                                            <input
                                              id="four"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleEditLayoutChange(
                                                  "threeByThree"
                                                )
                                              }
                                              checked={
                                                EditSelectedLayout ===
                                                "threeByThree"
                                              }
                                            />
                                            <label
                                              htmlFor="four"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              3 x 3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup9}
                                            alt=""
                                          />
                                        </div>
                                        <div>
                                          <div className="d-flex align-items-center mb-2 pb-1 cursor_pointer">
                                            <input
                                              id="five"
                                              className="raido-black"
                                              type="radio"
                                              name="minilayout"
                                              onChange={() =>
                                                handleEditLayoutChange(
                                                  "twoByTwoWithList"
                                                )
                                              }
                                              checked={
                                                EditSelectedLayout ===
                                                "twoByTwoWithList"
                                              }
                                            />
                                            <label
                                              htmlFor="five"
                                              className="fs-xs fw-400 black mb-0 ms-2 cursor_pointer"
                                            >
                                              2 x 2 Inline3
                                            </label>
                                          </div>
                                          <img
                                            src={minilayoutImgGroup8}
                                            alt=""
                                          />
                                        </div>
                                      </div>
                                    </Accordion.Body>
                                  </Accordion>
                                </div>
                                <div>
                                  <label
                                    htmlFor="Name"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Category Number
                                  </label>
                                  <br />
                                  <input
                                    type="text"
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="Enter Category Number"
                                    id="Name"
                                    value={categorynumber}
                                    onChange={(e) =>
                                      setCategoryNumber(e.target.value)
                                    }
                                  />{" "}
                                </div>
                                <div className="mt-4">
                                  <h2 className="fw-400 fs-2sm black mb-0">
                                    Status
                                  </h2>
                                  <div className="d-flex align-items-center gap-5">
                                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                                      <label class="check fw-400 fs-sm black mb-0">
                                        Published
                                        <input
                                          ref={pubref}
                                          onChange={(e) =>
                                            seteditPerentCatStatus("published")
                                          }
                                          checked={
                                            editPerentCatStatus === "published"
                                          }
                                          type="checkbox"
                                        />
                                        <span class="checkmark"></span>
                                      </label>
                                    </div>
                                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                                      <label class="check fw-400 fs-sm black mb-0">
                                        Hidden
                                        <input
                                          ref={hidref}
                                          onChange={(e) =>
                                            seteditPerentCatStatus("hidden")
                                          }
                                          checked={
                                            editPerentCatStatus == "hidden"
                                          }
                                          type="checkbox"
                                        />
                                        <span class="checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {/* categories details  */}
                    <div className="bg-white product_shadow position-relative">
                      <p
                        className="fs-sm fw-500 position-absolute start-0 white_space_nowrap"
                        style={{ top: "-30px" }}
                      >
                        Parent Categories
                      </p>
                      <div className="">
                        <div style={{ width: "350px" }}>
                          <table className="w-100">
                            <thead className="table_head w-100">
                              <tr className="product_borderbottom w-100">
                                <th className="py-3 ps-3">
                                  <div className="d-flex align-items-center gap-3">
                                    <p className="fw-400 fs-sm black mb-0">
                                      Name
                                      <span>
                                        <img
                                          className="ms-2"
                                          width={20}
                                          src={shortIcon}
                                          alt="short-icon"
                                        />
                                      </span>
                                    </p>
                                  </div>
                                </th>
                                <th
                                  onClick={() => {
                                    setAddCatPopup(true);
                                    setSelectedLayout("oneByThree");
                                  }}
                                  className="text-end fs-2 fw-400 pe-3 cursor_pointer"
                                >
                                  <abbr title="Add"> +</abbr>
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              className={`${
                                selectAll.length > 1
                                  ? "table_body2"
                                  : "table_body"
                              }`}
                            >
                              {categoreis.map((value, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className="product_borderbottom"
                                  >
                                    <td className="py-3 ps-3">
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center">
                                          <div className="w_40">
                                            <img
                                              src={
                                                value.image
                                                  ? value.image
                                                  : default_img
                                              }
                                              alt="categoryImg"
                                            />
                                          </div>
                                          <div className="ps-3 ms-1">
                                            <p className="fw-400 fs-sm black mb-0">
                                              {value.title}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      <div className="d-flex align-items-center gap-2 pe-2 justify-content-end">
                                        <abbr title="status">
                                          <img
                                            className="cursor_pointer"
                                            onClick={() => {
                                              handleChangeStatus(
                                                value.id,
                                                value.status
                                              );
                                            }}
                                            src={updown_icon}
                                            alt="updown_icon"
                                          />
                                        </abbr>
                                        <abbr title="Edit">
                                          <img
                                            onClick={() => {
                                              setEditPerCatPopup(true);
                                              setEditName(value.title);
                                              SetEditCatId(value.id);
                                              seteditPerentCatStatus(
                                                value.status
                                              );
                                              setEditImg(value.image);
                                              setEditSelectedLayout(
                                                value.homepagelayout
                                              );
                                              setCategoryNumber(value.categorynumber)
                                            }}
                                            className="cursor_pointer"
                                            src={pencil_icon}
                                            alt="pencil_icon"
                                          />
                                        </abbr>
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
              </div>
            </div>
          </div>
          {statusPopup ? (
            <Updatepopup
              statusPopup={setStatusPopup}
              handelStatus={() =>
                handleChangeStatus(
                  selectedSubcategoryId,
                  selectedSubcategoryStatus
                )
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
                            typeof editCatImg === "string" &&
                            editCatImg.startsWith("http")
                              ? editCatImg
                              : URL.createObjectURL(editCatImg)
                          }
                          alt=""
                        />
                        {/* <img className="mobile_image object-fit-cover" src={editCatImg} alt="" /> */}
                        <abbr title="Delete">
                          <img
                            onClick={() => handleDeleteEditImge()}
                            className="position-absolute top-0 end-0 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </abbr>
                      </div>
                    ) : (
                      <label
                        htmlFor="catImg"
                        className="color_green cursor_pointer fs-sm addmedia_btn"
                      >
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
                            setEditStatus(
                              editStatus === "hidden" ? "published" : "hidden"
                            )
                          }
                          checked={editStatus === "published"}
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
                            setEditStatus(
                              editStatus === "published"
                                ? "hidden"
                                : "published"
                            )
                          }
                          checked={editStatus === "hidden"}
                          type="checkbox"
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <label htmlFor="Name" className="fs-xs fw-400 mt-3 black">
                      Category Number
                    </label>
                    <br />
                    <input
                      type="text"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="Enter Category Number"
                      id="Name"
                      value={categorynumber}
                      onChange={(e) => setCategoryNumber(e.target.value)}
                    />{" "}
                  </div>
                  <div className="mt-3 bg_white">
                    <div className="d-flex align-items-center justify-content-between">
                      <h2 className="fw-400 fs-2sm black mb-0">
                        Parent Category
                      </h2>
                      {/* <Link to="/catalog/parentcategories" className="fs-2sm fw-400 red">
                      View All
                    </Link> */}
                    </div>
                    <Dropdown className="category_dropdown z-1">
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        className="dropdown_input_btn"
                      >
                        <div className="product_input">
                          <p className="fade_grey fw-400 w-100 mb-0 text-start">
                            {selectedCategory
                              ? selectedCategory.title || selectedCategory
                              : "Select Category"}
                          </p>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center product_input position-sticky top-0">
                            <img src={SearchIcon} alt="SearchIcon" />
                            <input
                              onChange={(e) =>
                                setEditSearchvalue(e.target.value)
                              }
                              placeholder="search for category"
                              className="fade_grey fw-400 border-0 outline_none ms-2 w-100"
                              type="text"
                            />
                          </div>
                          <div>
                            {categoreis
                              .filter((items) => {
                                return (
                                  editsearchvalue.toLowerCase() === "" ||
                                  items.title
                                    .toLowerCase()
                                    .includes(editsearchvalue)
                                );
                              })
                              .map((category) => (
                                <Dropdown.Item key={category.id}>
                                  <div
                                    className={`d-flex justify-content-between ${
                                      selectedCategory &&
                                      selectedCategory.id === category.id
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectCategory(category)
                                    }
                                  >
                                    <p className="fs-xs fw-400 black mb-0">
                                      {category.title}
                                    </p>
                                    {selectedCategory &&
                                      selectedCategory.id === category.id && (
                                        <img
                                          src={savegreenicon}
                                          alt="savegreenicon"
                                        />
                                      )}
                                  </div>
                                </Dropdown.Item>
                              ))}
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                    <p className="black fw-400 fs-xxs mb-0 mt-3">
                      Select a category that will be the parent of the current
                      one.
                    </p>
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={HandleEditCategory}
                        type="submit"
                        className="d-flex align-items-center px-sm-3 px-2 py-2 save_btn"
                      >
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

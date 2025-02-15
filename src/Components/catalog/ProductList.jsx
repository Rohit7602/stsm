import React, { createContext, useEffect, useState } from "react";
import filtericon from "../../Images/svgs/filtericon.svg";
import addicon from "../../Images/svgs/addicon.svg";
import dropdownDots from "../../Images/svgs/dots2.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import search from "../../Images/svgs/search.svg";
import pencil_icon from "../../Images/svgs/pencil.svg";
import delete_icon from "../../Images/svgs/delte.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import brandImg from "../../Images/svgs/brand-icon.svg";
import { doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { db } from "../../firebase";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useProductsContext } from "../../context/productgetter";
import Updatepopup from "../popups/Updatepopup";
import Deletepopup from "../popups/Deletepopup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";

const EditProductData = createContext();

const ProductList = () => {
  const { productData, updateProductData, deleteData } = useProductsContext();
  const location = useLocation();

  // states
  const [ProductId, setProductId] = useState(null);
  const [productStatus, setProductStatus] = useState(null);
  const [ProductImage, setProductImage] = useState(null);
  const [deletepopup, setDeletePopup] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  const [filtervalue, setFilterValue] = useState("");
  const [loading, setloading] = useState(false);
  console.log(1000 / 20);
  const [order, setorder] = useState("ASC");
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...productData];

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
    updateProductData(sortedData);
  };

  /*  *******************************
    checkbox functionality start 
 *********************************************   **/
  const [selectAll, setSelectAll] = useState([]);

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

  function handleMainCheckboxChange() {
    if (productData.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = productData.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }

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
      const newStatus = status === "hidden" ? "published" : "hidden";
      await updateDoc(doc(db, "products", id), {
        status: newStatus,
      });

      updateProductData({ id, status: newStatus });
    } catch (error) {
      console.log(error);
    }
  }

  async function HandleChangeToLiveBluck(e) {
    e.preventDefault();
    try {
      setloading(true);
      // Toggle the status between 'publish' and 'hidden'
      const newStatus = "published";
      for (let id of selectAll) {
        await updateDoc(doc(db, "products", id), {
          status: newStatus,
        });
        updateProductData({ id, status: newStatus });
      }
      setloading(false);
      toast.success("Status updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function HandleChangeToDraftBluck(e) {
    e.preventDefault();
    try {
      setloading(true);
      let newStatus = "hidden";
      for (let id of selectAll) {
        await updateDoc(doc(db, "products", id), {
          status: newStatus,
        });
        updateProductData({ id, status: newStatus });
      }
      setloading(false);
      toast.success("Status updated Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
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
      setloading(true);
      var st = getStorage();
      await deleteDoc(doc(db, "products", id)).then(() => {
        for (const images of image) {
          if (image.length !== 0) {
            var reference = ref(st, images);
            deleteObject(reference);
          }
        }
        deleteData(id);
      });
      setloading(false);
      toast.success("Product Deleted Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }

  async function handleDeleteSelectedProducts() {
    try {
      setloading(true);
      var st = getStorage();
      for (const id of selectAll) {
        const productRef = doc(db, "products", id);
        const productDoc = await getDoc(productRef);
        const productData = productDoc.data();
        if (productData && productData.productImages) {
          for (const imageUrl of productData.productImages) {
            const reference = ref(st, imageUrl);
            await deleteObject(reference);
            // console.log(`Image ${imageUrl} deleted from Storage`);
          }
        }
        await deleteDoc(productRef);
        // console.log(`Product with ID ${id} deleted from Firestore`);
        deleteData(id);
      }
      setloading(false);
    } catch (error) {
      console.error(
        "Error deleting selected products and their images:",
        error
      );
      setloading(false);
    }
  }

  /**
   ******************************************************
      Handle Delete functionality end  here 
  *************************************************
 
     */

  const filterlowstockproducts =
    location.state === null ? productData : location.state;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      {deletepopup === true || statusPopup === true ? (
        <div className="bg_black_overlay"></div>
      ) : null}

      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Products</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                onChange={(e) => setFilterValue(e.target.value)}
                value={filtervalue}
                className="fw-400 categorie_input  "
                placeholder="Search for Product..."
              />
            </div>
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img
                className="me-1"
                width={24}
                src={filtericon}
                alt="filtericon"
              />
              Filter
            </button>
            <Link
              to="/catalog/addproduct"
              className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
            >
              <img className="me-1" width={20} src={addicon} alt="add-icon" />
              Add New Product
            </Link>
          </div>
        </div>
        {selectAll.length >= 2 ? (
          <div className="d-flex align-items-center gap-3 mt-3 pt-1">
            <button
              className="change_to_draft fs-sm fw-400 black"
              onClick={HandleChangeToDraftBluck}
            >
              Change To Draft
            </button>
            <button
              className="change_to_live fs-sm fw-400 black"
              onClick={HandleChangeToLiveBluck}
            >
              Change To Live
            </button>
            <button
              className="delete_area fs-sm fw-400 text-white"
              onClick={handleDeleteSelectedProducts}
            >
              Delete Product
            </button>
          </div>
        ) : null}
        {/* product details  */}
        <div className="p-3 mt-3 bg-white product_shadow mt-4">
          <div className="overflow-x-scroll line_scroll">
            <div className="min_width_1350">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th
                      onClick={() => sorting("name")}
                      className="p-3 cursor_pointer"
                    >
                      <div className="d-flex align-items-center">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={selectAll.length === productData.length}
                            onChange={handleMainCheckboxChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Product{" "}
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

                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Category</h3>
                    </th>
                    <th className="mx_180 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Unit Purchase Price
                      </h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Unit Sale Price
                      </h3>
                    </th>
                    {/* <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Brand</h3>
                    </th> */}
                    <th className="mx_180 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Stock</h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0 ms-3">Total Value</h3>
                    </th>
                    <th className=" mx_170 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">
                        Stock Updated On
                      </h3>
                    </th>
                    <th
                      onClick={() => sorting("status")}
                      className="mw_130 p-3 cursor_pointer"
                    >
                      <p className="fw-400 fs-sm black mb-0 ms-2">
                        Status
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
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    selectAll.length >= 2 ? "table_body2" : "table_body"
                  }`}
                >
                  {filterlowstockproducts
                    .filter((v) =>
                      v.name.toLowerCase().includes(filtervalue.toLowerCase())
                    )
                    .map((value, index) => {
                      return (
                        <tr key={index}>
                          <td className="p-3 d-flex align-items-center">
                            <label className="check1 fw-400 fs-sm black mb-0">
                              <input
                                className="position-relative"
                                type="checkbox"
                                value={value.id}
                                checked={selectAll.includes(
                                  value.id,
                                  value.productImages
                                )}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmark me-5"></span>
                            </label>
                            <div className="d-flex align-items-center ms-2">
                              <div className="w_40">
                                <img src={value.productImages} alt="" />
                              </div>
                              <div className="ps-3 ms-1">
                                <p className="fw-400 fs-sm black mb-0">
                                  {value.name}
                                </p>
                                <div className="d-flex align-items-center">
                                  <p className="mb-0 fs-xxs fw-400 fade_grey d-flex flex-column">
                                    <span className="pe-1">
                                      {" "}
                                      ID : {value.id}{" "}
                                    </span>
                                    <span>SKU : {value.sku}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 mw_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {value.categories.name}
                            </h3>
                          </td>
                          <td className="p-3 mx_180">
                            <h3 className="fs-sm fw-400 black mb-0">
                              ₹ {value.perUnitPrice}
                            </h3>
                          </td>
                          <td className="p-3 mw_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              ₹{" "}
                              {/* {value.varients.map((item) => {
                              const data =
                                item.discountType === "Amount"
                                  ? item.unitPrice - item.discountvalue
                                  : item.unitPrice -
                                    (item.unitPrice * item.discountvalue) / 100;

                              const truncatedNumber = parseFloat(
                                data.toFixed(3)
                              );

                              return truncatedNumber;
                            })} */}
                              {value.salesprice}
                            </h3>
                          </td>
                          <td className="p-3 mx_180">
                            <h3
                              className={`fs-sm fw-400 black mb-0  white_space_nowrap  ${
                                Number(value.totalStock)  === 0
                                  ? "stock_bg_red text-white"
                                  : parseInt(
                                      Number(value.totalStock).toFixed(3)
                                    ) <= parseInt(value.stockAlert)
                                  ? "stock_bg_orange"
                                  : "px-2 stock_bg"
                              } `}
                            >
                              {Number(value.totalStock) === 0
                                ? `Out of Stock`
                                : parseInt(
                                    Number(value.totalStock).toFixed(3)
                                  ) >= parseInt(value.stockAlert)
                                ? `${Number(value.totalStock).toFixed(3)} ${
                                    value.stockUnitType
                                  }  ${" "} in Stock`
                                : `${Number(value.totalStock).toFixed(3)}  ${
                                    value.stockUnitType
                                  } ${" "}  Left`}
                            </h3>
                          </td>

                          <td className="p-3 mw_160 ">
                            <h3 className="fs-sm fw-400 black mb-0 ms-4">
                              ₹{" "}
                              {/* {value.varients.map(
                              (item) =>
                                (item.discountType === "Amount"
                                  ? item.unitPrice - item.discountvalue
                                  : item.unitPrice -
                                    (item.unitPrice * item.discountvalue) /
                                      100) * value.totalStock
                            )} */}
                              {Math.round(value.salesprice * value.totalStock)}
                            </h3>
                          </td>
                          <td className="p-3 mx_170">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {new Date(value.updated_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </h3>
                          </td>
                          <td className="p-3 mw_130">
                            <h3
                              className={`fs-sm fw-400 black mb-0 ms-2 ${
                                value.status === "hidden" ? "text-danger" : null
                              } `}
                            >
                              {value.status}
                            </h3>
                          </td>
                          <td className="text-center mx_100">
                            <div class="dropdown">
                              <button
                                class="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton3"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <abbr title="View">
                                  <img
                                    // onClick={() => {
                                    //  ;
                                    // }}
                                    src={dropdownDots}
                                    alt="dropdownDots"
                                  />
                                </abbr>
                              </button>
                              <ul
                                class="dropdown-menu categories_dropdown"
                                aria-labelledby="dropdownMenuButton3"
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
                                    <NavLink
                                      to={`/catalog/addproduct/${value.id}`}
                                    >
                                      <div
                                        onClick={() => {
                                          setProductId(value.id);
                                        }}
                                        className="d-flex align-items-center categorie_dropdown_options"
                                      >
                                        <img src={pencil_icon} alt="" />
                                        <p className="fs-sm fw-400 black mb-0 ms-2">
                                          Edit Product
                                        </p>
                                      </div>
                                    </NavLink>
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
                                    }}
                                  >
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={updown_icon} alt="" />
                                      <p className="fs-sm fw-400 green mb-0 ms-2">
                                        {value.status === "hidden"
                                          ? "change to  publish"
                                          : "Change to hidden"}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div
                                      onClick={() => {
                                        setProductId(value.id);
                                        setProductImage(value.productImages);
                                        setDeletePopup(true);
                                      }}
                                      className="d-flex align-items-center categorie_dropdown_options"
                                    >
                                      <img src={delete_icon} alt="" />
                                      <p className="fs-sm fw-400 red mb-0 ms-2">
                                        Delete
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

        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
};

export default ProductList;
export { EditProductData };

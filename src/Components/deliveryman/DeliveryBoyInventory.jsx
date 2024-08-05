import React, { useState, useEffect } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import profile_image from "../../Images/Png/customer_profile.png";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import Deletepopup from "../popups/Deletepopup";
import Updatepopup from "../popups/Updatepopup";
import Loader from "../Loader";
import { useParams } from "react-router-dom";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import { getDocs, query, setDoc } from "firebase/firestore";
import { useProductsContext } from "../../context/productgetter";

const DeliveryBoyInventory = () => {
  const { DeliveryManData, deleteDeliveryManData, updateDeliveryManData } =
    UseDeliveryManContext();
  const { id } = useParams();
  // console.log(id)
  const { productData } = useProductsContext();
  const product_names = productData.map((product) => product.name);
  // console.log("product name is ", product_names)
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [productname, setproductname] = useState("");
  const [varient, setVarient] = useState("");
  const [quantity, setquantity] = useState("");
  const [selectedproduct, setselectedProduct] = useState([]);
  const [AllItems, setAllItems] = useState([]);
  const [delivryMan, setDeliveryMan] = useState([]);
  const [color, setColor] = useState("");

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.id === id);
    setDeliveryMan(DeliveryManDatas);
  }, [id, delivryMan.length !== 0]);
  // useEffect(() => {
  //   console.log("vairent is", selectedproduct.length > 0 && selectedproduct.map((data) => data.varients))
  // }, [varient])

  // Function to handle the selection of an item
  const handleSelectItem = (value) => {
    // Update the selected value in the state
    setSelectedValue(value);
  };

  useEffect(() => {
    let filterData = productData.filter(
      (product) => product.name === productname
    );
    // console.log("filter data si ", filterData)
    setselectedProduct(filterData);
  }, [productname]);

  useEffect(() => {
    const Data = DeliveryManData.find((item) => item.id === id);
    if (Data) {
      const fetchVan = async () => {
        const q = query(collection(db, `Delivery/${Data.id}/Van`));
        const querySnapshot = await getDocs(q);
        setAllItems(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      };
      fetchVan();
    }
  }, [id, DeliveryManData]);

  // console.log("selected product is ", selectedproduct)

  function HandleAddToVan(e) {
    if (
      selectedproduct.length > 0 &&
      varient &&
      quantity &&
      selectedproduct[0].totalStock >= quantity
    ) {
      e.preventDefault();
      let allvarients =
        selectedproduct.length > 0 &&
        selectedproduct.map((data) => data.varients);
      console.log("added");
      console.log("function working here ");
      // console.log("all vairents ", allvarients)
      let currentvairent = allvarients
        .flat()
        .filter((data) => data.VarientName === varient);
      // console.log("currentvairent valie ", currentvairent[0])
      setAllItems((prevVariants) => [
        ...prevVariants,
        {
          name: productname,
          productImage:
            selectedproduct.length > 0 && selectedproduct[0].productImages[0],
          productid: selectedproduct.length > 0 && selectedproduct[0].id,
          quantity: selectedproduct.length > 0 && quantity,
          sku: selectedproduct.length > 0 && selectedproduct[0].sku,
          brand: selectedproduct.length > 0 && selectedproduct[0].brand.name,
          unitType:
            selectedproduct.length > 0 &&
            selectedproduct[0].varients[0].unitType,
          varient: currentvairent.length > 0 && currentvairent[0],
          color: color,
          tax: selectedproduct.length > 0 && selectedproduct[0].Tax,
          DeliveryCharge:
            selectedproduct.length > 0 && selectedproduct[0].DeliveryCharge,
          SalesmanCommission:
            selectedproduct.length > 0 && selectedproduct[0].SalesmanCommission,
          ServiceCharge:
            selectedproduct.length > 0 && selectedproduct[0].ServiceCharge,
          totalStocks:
            selectedproduct.length > 0 && selectedproduct[0].totalStock,
        },
      ]);
      setproductname("");
      setselectedProduct([]);
      setquantity("");
      setVarient("");
    } else if (
      varient === "" ||
      quantity === "" ||
      selectedproduct.length < 0
    ) {
      // alert("Please Select each field");
      toast.error("Please Select each field", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.warning("Prodcut stock not available", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  // useEffect(() => {
  //   console.log("items is ", AllItems)
  // }, [AllItems])

  async function UpdateEntry(e) {
    e.preventDefault();
    if (AllItems.length === 0) {
      alert("please add item into van");
    } else {
      try {
        setLoaderstatus(true);
        let totalStock;
        const itemsToAdd = AllItems.filter((item) => !item.id);
        console.log(itemsToAdd);
        for (let item of itemsToAdd) {
          console.log("item======================", item);
          await addDoc(collection(db, `Delivery/${id}/Van`), item);
          const docRef = doc(db, "products", item.productid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            totalStock = docSnap.data().totalStock;
          } else {
            console.log("No such document!");
          }
          const washingtonRef = doc(db, "products", item.productid);
          await updateDoc(washingtonRef, {
            totalStock: totalStock - item.quantity,
          });
        }
        window.location.reload();
        setLoaderstatus(false);
        toast.success("Product added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        setLoaderstatus(false);
        console.log("Error in Adding Data to Van", error);
      }
    }
  }
  const [selectAll, setSelectAll] = useState([]);
  function handleSelectAll() {
    if (AllItems.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = AllItems.map((item) => {
        return item.id;
      });
      setSelectAll(allCheck);
    }
  }
  function handleSelect(e) {
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

  async function handleWithdrow() {
    try {
      setLoaderstatus(true);
      let totalStock;
      const itemsToAdd = AllItems.filter((item) => selectAll.includes(item.id));
      for (let item of itemsToAdd) {
        const docRef = doc(db, "products", item.productid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          totalStock = docSnap.data().totalStock;
        } else {
          console.log("No such document!");
        }
        let quantity = item.quantity - (item.sold != null ? item.sold : 0);
        const washingtonRef = doc(db, "products", item.productid);
        await updateDoc(washingtonRef, {
          totalStock: totalStock + quantity,
        });
      }
      // Define the reference to the Van sub-collection
      const vanCollectionRef = collection(db, `Delivery/${id}/Van`);

      // Retrieve all documents in the Van sub-collection
      const querySnapshot = await getDocs(vanCollectionRef);
      const existingDocs = querySnapshot.docs;

      // Delete all existing documents in the Van sub-collection
      for (let doc of existingDocs) {
        await deleteDoc(doc.ref);
      }

      // Add the updated items to the Van sub-collection
      const updateVan = AllItems.filter((item) => !selectAll.includes(item.id));
      for (let item of updateVan) {
        await addDoc(vanCollectionRef, item);
      }

      // Update the local state
      setAllItems(updateVan);
      setLoaderstatus(false);
      toast.success("Product withdrow Successfully !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoaderstatus(false);
      console.log("Error in withdrow product", error);
    }
  }

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between ">
            {delivryMan.length > 0 &&
              delivryMan.map((data) => {
                return (
                  <div className="d-flex align-items-center mw-300 p-2">
                    <div>
                      <img
                        src={profile_image}
                        alt="mobileicon"
                        className="items_images"
                      />
                    </div>
                    <div className="ps-3">
                      <p className="fs-sm fw-400 black mb-0">
                        {data.basic_info.name}
                      </p>
                      <p className="fs-xxs fw-400 fade_grey mb-0">
                        {data.basic_info.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between gap-3">
              {/* <button
                className="green_btn text-white px-5"
                onClick={() => window.history.back()}
              >
                Back
              </button> */}
              <button
                onClick={UpdateEntry}
                className=" outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
              >
                Update Entry
              </button>
            </div>
          </div>
          <div className="  gap-2 gap-sm-0  p-3 mt-3 bg-white product_shadow mt-4 ">
            <div className="row mb-3 align-items-center">
              <div className="col-6 pe-0">
                <div className="dropdown w-100">
                  <button
                    style={{ height: "44px" }}
                    className="btn dropdown-toggle w-100 quantity_bg"
                    type="button"
                    id="dropdownMenuButton3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                        {productname ? productname : "Product Name"}
                      </p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <ul
                    className="dropdown-menu delivery_man_dropdown w-100"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    {product_names.map((names) => {
                      return (
                        <li>
                          <div
                            onClick={() => setproductname(names)}
                            className="dropdown-item py-2"
                          >
                            <p className="fs-sm fw-400 balck m-0">{names}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-5 ms-5">
                    <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                      SKU :{" "}
                      {selectedproduct.length === 0
                        ? "N/A"
                        : selectedproduct[0].sku}
                    </p>
                    <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                      Brand :
                      {selectedproduct.length === 0
                        ? "N/A"
                        : selectedproduct[0].brand.name}
                    </p>
                  </div>
                  <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                    Unit :{" "}
                    {selectedproduct.length === 0
                      ? "N/A"
                      : selectedproduct[0].varients[0].unitType}
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between w-100 gap-4">
              <div className=" w-100 d-flex align-items-center gap-3">
                <div className="dropdown w-100">
                  <button
                    style={{ height: "44px" }}
                    className="btn dropdown-toggle w-100 quantity_bg"
                    type="button"
                    id="dropdownMenuButton3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                        {varient ? varient : "Varient"}
                      </p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  <ul
                    className="dropdown-menu delivery_man_dropdown w-100"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    {selectedproduct.length > 0 &&
                      selectedproduct[0].varients.map((name) => {
                        return (
                          <li>
                            <div
                              onClick={() => setVarient(name.VarientName)}
                              className="dropdown-item py-2"
                              href="#"
                            >
                              <p className="fs-sm fw-400 balck m-0">
                                {name.VarientName}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div className="dropdown w-100">
                  <button
                    style={{ height: "44px" }}
                    className="btn dropdown-toggle w-100 quantity_bg"
                    type="button"
                    id="dropdownMenuButton3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                        {color ? color : "Select Colors"}
                      </p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  <ul
                    className="dropdown-menu delivery_man_dropdown w-100"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    {selectedproduct.length > 0 &&
                      selectedproduct[0].colors.map((name) => {
                        return (
                          <li>
                            <div
                              onClick={() => setColor(name)}
                              className="dropdown-item py-2"
                              href="#"
                            >
                              <p className="fs-sm fw-400 balck m-0">{name}</p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                {/* <div className="dropdown w-100">
                  <button
                    style={{ height: '44px' }}
                    className="btn dropdown-toggle w-100 quantity_bg"
                    type="button"
                    id="dropdownMenuButton3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                        {quantity ? quantity : 'Quantity'}
                      </p>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <ul
                    className="dropdown-menu delivery_man_dropdown w-100"
                    aria-labelledby="dropdownMenuButton3">
                    <li>
                      <div
                        onClick={() => setquantity('product')}
                        className="dropdown-item py-2"
                        href="#">
                        <p className="fs-sm fw-400 balck m-0">Product</p>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => setquantity('product')}
                        className="dropdown-item py-2"
                        href="#">
                        <p className="fs-sm fw-400 balck m-0">Product</p>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => setquantity('product')}
                        className="dropdown-item py-2"
                        href="#">
                        <p className="fs-sm fw-400 balck m-0">Product</p>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => setquantity('product')}
                        className="dropdown-item py-2"
                        href="#">
                        <p className="fs-sm fw-400 balck m-0">Product</p>
                      </div>
                    </li>
                  </ul>
                </div> */}
                <input
                  className="w-100 quantity_bg outline_none"
                  type="text"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setquantity(e.target.value)}
                />
              </div>
              <div className="d-flex align-itmes-center justify-content-center justify-content-md-between gap-3">
                <button
                  onClick={HandleAddToVan}
                  className="addnewproduct_btn white_space_nowrap black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                >
                  <img
                    className="me-1"
                    width={20}
                    src={addicon}
                    alt="add-icon"
                  />
                  Add to Van
                </button>
              </div>
            </div>
          </div>
          {/* categories details  */}
          {selectAll.length !== 0 && (
            <button
              onClick={handleWithdrow}
              className=" outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400  mt-4"
            >
              Withdraw
            </button>
          )}
          <div className="p-3 mt-3 bg-white product_shadow mt-3">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th className="py-3 ps-3 w-100 cursor_pointer">
                        <div className="d-flex align-items-center gap-3 min_width_300">
                          <label className="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              checked={selectAll.length === AllItems.length}
                              onChange={handleSelectAll}
                            />
                            <span className="checkmark"></span>
                          </label>
                          <p className="fw-400 fs-sm black mb-0 ms-2">
                            Items
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
                      <th className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">SKU</h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Brand</h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Total Stokes
                        </h3>
                      </th>
                      <th className="mx_140 cursor_pointer">
                        <p className="fw-400 fs-sm black mb-0 ms-2">Quantity</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ maxHeight: "calc(100vh - 460px)" }}
                    className="table_body"
                  >
                    {AllItems.length > 0 &&
                      AllItems.map((item, index) => {
                        console.log(item, "===========");
                        return (
                          <tr className="product_borderbottom">
                            <td className="py-3 ps-3 w-100">
                              <div className="d-flex align-items-center gap-3 min_width_300">
                                <label className="check1 fw-400 fs-sm black mb-0">
                                  <input
                                    type="checkbox"
                                    value={item.id}
                                    checked={selectAll.includes(item.id)}
                                    onChange={handleSelect}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                                <div className="d-flex align-items-center ms-1">
                                  <p className="fw-400 fs-sm color_green mb-0 ms-2">
                                    {item.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 mx_160">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {item.sku}
                              </h3>
                            </td>
                            <td className="ps-4 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {item.brand === " " ? "N/A" : item.brand}
                              </h3>
                            </td>
                            <td className="ps-4 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {item.totalStocks}
                              </h3>
                            </td>
                            <td className="mx_140">
                              <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                {item.quantity -
                                  (item.sold != null ? item.sold : 0)}
                              </h3>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <ToastContainer />
                {/* <div className=""></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DeliveryBoyInventory;

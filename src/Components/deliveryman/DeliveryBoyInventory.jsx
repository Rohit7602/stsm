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
  where,
  WriteBatch,
  writeBatch,
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
  // const [varient, setVarient] = useState("");
  const [filtervalue, setFilterValue] = useState("");
  const [quantity, setquantity] = useState(0);
  const [qut, setQut] = useState(0);
  const [selectedproduct, setselectedProduct] = useState([]);
  const [AllItems, setAllItems] = useState([]);
  const [delivryMan, setDeliveryMan] = useState([]);
  const [varienttype, setvarienttype] = useState("");
  console.log(varienttype);

  // const [color, setColor] = useState("");

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
    // console.log("filter data si ", filterData);
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

  ///////////////////////////     previous functionality     ////////////////////////////////////

  // function HandleAddToVan(e) {
  //   e.preventDefault();

  //   if (
  //     selectedproduct.length > 0 &&
  //     quantity > 0 &&
  //     selectedproduct[0].totalStock >= quantity
  //   ) {
  //     let productToUpdate = selectedproduct[0];

  //     setAllItems((prevVariants) => {
  //       const existingItemIndex = prevVariants.findIndex(
  //         (item) => item.productid === productToUpdate.id
  //       );

  //       if (existingItemIndex !== -1) {
  //         // Update the existing item quantity by adding the new quantity
  //         const updatedItem = {
  //           ...prevVariants[existingItemIndex],
  //           additionalQty: quantity, // Add the new quantity
  //         };

  //         return [
  //           ...prevVariants.slice(0, existingItemIndex),
  //           updatedItem,
  //           ...prevVariants.slice(existingItemIndex + 1),
  //         ];
  //       } else {
  //         // Add new item
  //         const newItem = {
  //           name: productname,
  //           productImage: productToUpdate.productImages[0],
  //           productid: productToUpdate.id,
  //           salesprice: productToUpdate.salesprice,
  //           quantity: quantity,
  //           sku: productToUpdate.sku,
  //           brand: productToUpdate.brand.name,
  //           stockUnitType: productToUpdate.stockUnitType,
  //           tax: productToUpdate.Tax,
  //           DeliveryCharge: productToUpdate.DeliveryCharge,
  //           ServiceCharge: productToUpdate.ServiceCharge,
  //           totalStocks: productToUpdate.totalStock,
  //         };

  //         return [...prevVariants, newItem];
  //       }
  //     });

  //     // Reset state
  //     setproductname("");
  //     setselectedProduct([]);
  //     setquantity(0);
  //   } else if (quantity === 0 || selectedproduct.length === 0) {
  //     toast.error("Please select each field", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   } else {
  //     toast.warning("Product stock not available", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   }
  // }

  // async function UpdateEntry(e) {
  //   e.preventDefault();
  //   if (AllItems.length === 0) {
  //     alert("please add item into van");
  //   } else {
  //     try {
  //       let batch = writeBatch(db);

  //       for (let item of AllItems) {
  //         const existingDoc = await getDoc(
  //           doc(db, `Delivery/${id}/Van/${item.id}`)
  //         );

  //         if (!existingDoc.exists()) {
  //           await addDoc(collection(db, `Delivery/${id}/Van`), item);
  //         } else {
  //           batch.update(doc(db, `Delivery/${id}/Van/${item.id}`), {
  //             quantity: existingDoc.data().quantity + (item.additionalQty ?? 0),
  //           });
  //         }
  //         const docRef = doc(db, "products", item.productid);
  //         const docSnap = await getDoc(docRef);
  //         if (docSnap.exists()) {
  //           let qty = existingDoc.exists()
  //             ? item.additionalQty ?? 0
  //             : item.quantity;
  //           batch.update(doc(db, `products/${item.productid}`), {
  //             totalStock: docSnap.data().totalStock - qty,
  //           });
  //         }
  //       }
  //       await batch.commit();
  //       setLoaderstatus(true);
  //       window.location.reload();
  //       setLoaderstatus(false);
  //       toast.success("Product added Successfully !", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } catch (error) {
  //       setLoaderstatus(false);
  //       console.log("Error in Adding Data to Van", error);
  //     }
  //   }
  // }

  //////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////

  function HandleAddToVan(e) {
    e.preventDefault();

    if (!varienttype && selectedproduct[0]?.stockUnitType === "KG") {
      toast.error("Please select each field", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      if (
        selectedproduct.length > 0 &&
        quantity > 0 &&
        (selectedproduct[0].stockUnitType === "KG" && varienttype === "GRAM"
          ? selectedproduct[0].totalStock * 1000 >= quantity
          : selectedproduct[0].totalStock >= quantity)
      ) {
        let productToUpdate = selectedproduct[0];

        setAllItems((prevVariants) => {
          const existingItemIndex = prevVariants.findIndex(
            (item) =>
              item.productid === productToUpdate.id &&
              item.stockUnitType ===
                (selectedproduct[0].stockUnitType === "KG"
                  ? varienttype
                  : productToUpdate.stockUnitType)
          );

          if (existingItemIndex !== -1) {
            const updatedItem = {
              ...prevVariants[existingItemIndex],
              additionalQty:
                (prevVariants[existingItemIndex].additionalQty || 0) + quantity, // Add new quantity
            };

            return [
              ...prevVariants.slice(0, existingItemIndex),
              updatedItem,
              ...prevVariants.slice(existingItemIndex + 1),
            ];
          } else {
            // Add new item
            const newItem = {
              name: productname,
              productImage: productToUpdate.productImages[0],
              productid: productToUpdate.id,
              salesprice: productToUpdate.salesprice,
              quantity: quantity,
              sku: productToUpdate.sku,
              brand: productToUpdate.brand.name,
              stockUnitType:
                selectedproduct[0].stockUnitType === "KG"
                  ? varienttype
                  : productToUpdate.stockUnitType,
              tax: productToUpdate.Tax,
              DeliveryCharge: productToUpdate.DeliveryCharge,
              ServiceCharge: productToUpdate.ServiceCharge,
              totalStocks: productToUpdate.totalStock,
            };

            return [...prevVariants, newItem];
          }
        });

        // Reset state
        setproductname("");
        setselectedProduct([]);
        setquantity(0);
        setvarienttype("");
      } else if (quantity === 0 || selectedproduct.length === 0) {
        toast.error("Please select each field", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.warning("Product stock not available", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }

async function UpdateEntry(e) {
  e.preventDefault();
  if (AllItems.length === 0) {
    alert("please add item into van");
  } else {
    try {
      let batch = writeBatch(db);
      for (let item of AllItems) {
        console.log(item);

        const vanDocRef = doc(db, `Delivery/${id}/Van/${item.id}`);
        const existingDoc = await getDoc(vanDocRef);

        // Determine the quantity to subtract
        const qtyToSubtract = item.additionalQty ?? item.quantity;

        if (!existingDoc.exists()) {
          // First-time addition to the van
          await addDoc(collection(db, `Delivery/${id}/Van`), {
            ...item,
            quantity: qtyToSubtract, // Add with the correct quantity
          });
        } else {
          // Update existing document in the van
          const existingQty = existingDoc.data().quantity || 0;
          const newQty = existingQty + (item.additionalQty ?? 0);
          batch.update(vanDocRef, { quantity: newQty });
        }

        // Update the product's stock in the database
        const productDocRef = doc(db, "products", item.productid);
        const productDocSnap = await getDoc(productDocRef);

        if (productDocSnap.exists()) {
          const productData = productDocSnap.data();

          const updatedStock =
            item.stockUnitType === "GRAM"
              ? Number(
                  (
                    (productData.totalStock * 1000 - qtyToSubtract) /
                    1000
                  ).toFixed(1)
                )
              : productData.totalStock - qtyToSubtract;

          batch.update(productDocRef, { totalStock: updatedStock });
        }
      }

      // Commit the batch updates
      await batch.commit();
      setLoaderstatus(true);
      window.location.reload();
      setLoaderstatus(false);

      // Success toast message
      toast.success("Product added Successfully!", {
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
    const itemsToAdd = AllItems.filter((item) => selectAll.includes(item.id));
    for (let item of itemsToAdd) {
      const docRef = doc(db, "products", item.productid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        let totalStock = productData.totalStock; // Current stock
        const stockUnitType = productData.stockUnitType || "KG"; // Default to KG
        // Calculate the remaining quantity
        let quantity = item.quantity - (item.sold != null ? item.sold : 0);
        // Normalize to kilograms if the quantity is in grams
        if (item.stockUnitType === "GRAM") {
          quantity = quantity / 1000; // Convert grams to kilograms
        }
        // Update total stock
        let updatedStock = totalStock + quantity;
        // Ensure the updated stock is converted back to the correct unit type
        if (stockUnitType === "GRAM") {
          updatedStock = updatedStock * 1000; // Convert back to grams
        }
        // Update the product's stock in the database
        const updateRef = doc(db, "products", item.productid);
        await updateDoc(updateRef, {
          totalStock: parseFloat(updatedStock.toFixed(3)),
        });
      } else {
        console.log(`No document found for product ID: ${item.productid}`);
      }
    }

    // Van sub-collection operations
    const vanCollectionRef = collection(db, `Delivery/${id}/Van`);
    const querySnapshot = await getDocs(vanCollectionRef);

    // Delete existing Van documents
    for (let doc of querySnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Add updated items back to the Van sub-collection
    const updateVan = AllItems.filter((item) => !selectAll.includes(item.id));
    for (let item of updateVan) {
      await addDoc(vanCollectionRef, item);
    }

    // Update local state
    setAllItems(updateVan);
    setLoaderstatus(false);
    toast.success("Product withdrawn successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    setLoaderstatus(false);
    console.error("Error in withdrawing product:", error);
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
              {selectAll.length !== 0 && (
                <button
                  onClick={handleWithdrow}
                  className=" outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400"
                >
                  Unload Van
                </button>
              )}
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <ul
                    className="dropdown-menu delivery_man_dropdown w-100 pt-0 bg-white mt-3"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    <li className="p-2 position-sticky start-0 top-0 bg-white">
                      <input
                        type="text"
                        className="form-control shadow-none border-1 border-dark-subtle"
                        placeholder="Search Product..."
                        value={filtervalue}
                        onChange={(e) => setFilterValue(e.target.value)}
                      />
                    </li>
                    {product_names
                      .filter((v) =>
                        v.toLowerCase().includes(filtervalue.toLowerCase())
                      )
                      .map((names, index) => (
                        <li key={index}>
                          <div
                            onClick={() => {
                              setproductname(names);
                              setFilterValue("");
                            }}
                            className="dropdown-item py-2"
                          >
                            <p className="fs-sm fw-400 black m-0">{names}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-5 ms-5 justify-content-between w-75">
                    <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                      SKU :{" "}
                      {selectedproduct.length === 0
                        ? "N/A"
                        : selectedproduct[0].sku}
                    </p>
                    {/* <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                      Brand :
                      {selectedproduct.length === 0
                        ? "N/A"
                        : selectedproduct[0].brand.name}
                    </p> */}
                    <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                      Total Stokes :{" "}
                      {selectedproduct.length === 0
                        ? "N/A"
                        : ` ${selectedproduct[0].totalStock}  ${selectedproduct[0].stockUnitType}`}
                    </p>
                  </div>
                  {/* <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                    Unit :{" "}
                    {selectedproduct.length === 0
                      ? "N/A"
                      : selectedproduct[0].varients[0].stockUnitType}
                  </p> */}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between w-100 gap-4">
              <div className=" d-flex gap-4 align-items-center">
                <div className=" w-100 d-flex align-items-center gap-3">
                  <input
                    className="w-100 quantity_bg outline_none"
                    type="text"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => {
                      setquantity(Number(e.target.value) || 0);
                    }}
                  />
                </div>
                {selectedproduct.length !== 0 &&
                  selectedproduct[0].stockUnitType.toLowerCase() === "kg" && (
                    <div className="w-100 d-flex align-items-center gap-3 quantity_bg">
                      <select
                        required
                        onChange={(e) => setvarienttype(e.target.value)}
                        className="w-100  bg-transparent outline_none border-0"
                      >
                        <option value={""}>Select Type</option>
                        <option value={"KG"}>KG</option>
                        <option value={"GRAM"}>GRAM</option>
                      </select>
                    </div>
                  )}
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
                      {/* <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Total Stokes
                        </h3>
                      </th> */}
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
                            {/* <td className="ps-4 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {item.totalStocks}
                              </h3>
                            </td> */}
                            <td className="mx_140">
                              <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                {item.quantity +
                                  (item.additionalQty ?? 0) -
                                  (item.sold != null ? item.sold : 0)}
                                <span className=" ms-1">
                                  {item.stockUnitType}
                                </span>
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

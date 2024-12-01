import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import { useParams } from "react-router-dom";
import addicon from "../../Images/svgs/addicon.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import profile_image from "../../Images/Png/customer_profile.png";
import { useProductsContext } from "../../context/productgetter";
import Loader from "../Loader";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";

function DeliveryBoyInventory2() {
  const { DeliveryManData } = UseDeliveryManContext();
  const { id } = useParams();
  const [loaderstatus, setLoaderstatus] = useState(false);
  const { productData } = useProductsContext();
  const product_names = productData.map((product) => product.name);
  const [delivryMan, setDeliveryMan] = useState([]);
  const [filtervalue, setFilterValue] = useState("");
  const [productname, setproductname] = useState("");
  const [selectedproduct, setselectedProduct] = useState([]);
  const [addquantity, setaddquantity] = useState(0);
  const [varienttype, setvarienttype] = useState("");
  const [selectAll, setSelectAll] = useState([]);
  const [AllProducts, setAllProducts] = useState([]);

  //////////////   filter delivryMan  ////////////////

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.id === id);
    setDeliveryMan(DeliveryManDatas);
  }, [id, delivryMan.length !== 0]);

  //////////////   filter products  ////////////////

  useEffect(() => {
    let filterData = productData.filter(
      (product) => product.name === productname
    );
    setselectedProduct(filterData);
  }, [productname]);

  //////////////////// get all products in firebase //////////////

  useEffect(() => {
    const Data = DeliveryManData.find((item) => item.id === id);
    if (Data) {
      const fetchVan = async () => {
        const q = query(collection(db, `Delivery/${Data.id}/Van`));
        const querySnapshot = await getDocs(q);
        setAllProducts(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      };
      fetchVan();
    }
  }, [id, DeliveryManData]);

  ////////////  add product state  //////////

  function HandleAddToVan(event) {
    event.preventDefault();
    if (!varienttype && selectedproduct[0]?.stockUnitType === "KG") {
      toast.error("Please select each field", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      let getproduct = selectedproduct[0];
      if (
        selectedproduct.length > 0 &&
        addquantity > 0 &&
        (selectedproduct[0].stockUnitType === "KG" && varienttype === "GRAM"
          ? selectedproduct[0].totalStock * 1000 >= addquantity
          : selectedproduct[0].totalStock >= addquantity)
      ) {
        setAllProducts((previousproduct) => {
          const existingItem = previousproduct.findIndex(
            (value) =>
              value.productid === getproduct.id &&
              value.stockUnitType ===
                (selectedproduct[0].stockUnitType === "KG"
                  ? varienttype
                  : getproduct.stockUnitType)
          );
          if (existingItem !== -1) {
            let getoldquantity = previousproduct.filter((value) => {
              let producttype = varienttype
                ? varienttype
                : getproduct.stockUnitType;
              return (
                value.productid === getproduct.id &&
                value.stockUnitType === producttype
              );
            });
            const updatedItem = {
              ...previousproduct[existingItem],
              quantity: getoldquantity[0].quantity,
              addquantity: getoldquantity[0].addquantity
                ? getoldquantity[0].addquantity + addquantity
                : addquantity,
            };

            return [
              ...previousproduct.slice(0, existingItem),
              updatedItem,
              ...previousproduct.slice(existingItem + 1),
            ];
          } else {
            const newItem = {
              name: productname,
              productImage: getproduct.productImages[0],
              productid: getproduct.id,
              salesprice: getproduct.salesprice,
              quantity: addquantity,
              sku: getproduct.sku,
              brand: getproduct.brand.name,
              stockUnitType:
                selectedproduct[0].stockUnitType === "KG"
                  ? varienttype
                  : getproduct.stockUnitType,
              tax: getproduct.Tax,
              DeliveryCharge: getproduct.DeliveryCharge,
              ServiceCharge: getproduct.ServiceCharge,
              totalStocks: getproduct.totalStock,
            };
            return [...previousproduct, newItem];
          }
        });
        setproductname("");
        setselectedProduct([]);
        setaddquantity(0);
        setvarienttype("");
      } else if (addquantity === 0 || selectedproduct.length === 0) {
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

  ////////////  add product firebase  //////////

  async function UpdateEntry(event) {
    event.preventDefault();
    setLoaderstatus(true);
    if (AllProducts.length === 0) {
      alert("please add item into van");
    } else {
      try {
        let batch = writeBatch(db);
        for (let item of AllProducts) {
          let totalquantity =
            item.addquantity !== undefined
              ? item.addquantity + item.quantity
              : item.quantity;
          const vanDocRef = doc(db, `Delivery/${id}/Van/${item.id}`);
          const existingDoc = await getDoc(vanDocRef);
          let updatedItem = {
            ...item,
            quantity: totalquantity,
          };
          delete updatedItem.addquantity;
          if (!existingDoc.exists()) {
            await addDoc(collection(db, `Delivery/${id}/Van`), updatedItem);
          } else {
            const existingQty = existingDoc.data().quantity || 0;
            const newQty = existingQty + (item.addquantity ?? 0);
            batch.update(vanDocRef, { quantity: newQty });
          }

          // Update the product's stock in the database
          const productDocRef = doc(db, "products", item.productid);
          const productDocSnap = await getDoc(productDocRef);
          let subtractquantity = !existingDoc.data()
            ? (item.addquantity ?? 0) + item.quantity
            : item.addquantity ?? 0;

          if (productDocSnap.exists()) {
            const productData = productDocSnap.data();
            const updatedStock =
              item.stockUnitType === "GRAM"
                ? Number(
                    (
                      (productData.totalStock * 1000 - subtractquantity) /
                      1000
                    ).toFixed(1)
                  )
                : productData.totalStock - subtractquantity;

            batch.update(productDocRef, { totalStock: updatedStock });
          }
        }
        // Commit the batch updates
        await batch.commit();
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
    setLoaderstatus(false);
  }

  ////////////  unload products //////////////

  async function handleWithdrow() {
    try {
      setLoaderstatus(true);
      const itemsToAdd = AllProducts.filter((item) =>
        selectAll.includes(item.id)
      );
      for (let item of itemsToAdd) {
        const docRef = doc(db, "products", item.productid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          let totalStock = productData.totalStock; 
          const stockUnitType = productData.stockUnitType || "KG";
          let quantity = item.quantity - (item.sold != null ? item.sold : 0);
          if (item.stockUnitType === "GRAM") {
            quantity = quantity / 1000;
          }
          let updatedStock = totalStock + quantity;
          if (stockUnitType === "GRAM") {
            updatedStock = updatedStock * 1000;
          }
          const updateRef = doc(db, "products", item.productid);
          await updateDoc(updateRef, {
            totalStock: parseFloat(updatedStock.toFixed(3)),
          });
        } else {
          console.log(`No document found for product ID: ${item.productid}`);
        }
      }
      const vanCollectionRef = collection(db, `Delivery/${id}/Van`);
      const querySnapshot = await getDocs(vanCollectionRef);
      for (let doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      const updateVan = AllProducts.filter(
        (item) => !selectAll.includes(item.id)
      );
      for (let item of updateVan) {
        await addDoc(vanCollectionRef, item);
      }
      setAllProducts(updateVan);
      setLoaderstatus(false);
      toast.success("Product withdrawn successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoaderstatus(false);
      console.error("Error in withdrawing product:", error);
    }
  }

  ////////////  select only all product  //////////

  function handleSelectAll() {
    if (AllProducts.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = AllProducts.map((item) => {
        return item.id;
      });
      setSelectAll(allCheck);
    }
  }

  ////////////  select only one product  //////////

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

  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div>
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
                <button
                  onClick={UpdateEntry}
                  className=" outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                >
                  Update Entry
                </button>
                {AllProducts.length !== 0 && (
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
                      <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                        Total Stokes :{" "}
                        {selectedproduct.length === 0
                          ? "N/A"
                          : ` ${selectedproduct[0].totalStock}  ${selectedproduct[0].stockUnitType}`}
                      </p>
                    </div>
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
                      value={addquantity}
                      onChange={(e) => {
                        setaddquantity(Number(e.target.value) || 0);
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
                                checked={
                                  selectAll.length === AllProducts.length
                                }
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
                        <th className="mx_140 cursor_pointer">
                          <p className="fw-400 fs-sm black mb-0 ms-2">
                            Quantity
                          </p>
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      style={{ maxHeight: "calc(100vh - 460px)" }}
                      className="table_body"
                    >
                      {AllProducts.length > 0 &&
                        AllProducts.map((item, index) => {
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
                              <td className="mx_140">
                                <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                  {item.addquantity
                                    ? item.quantity + item.addquantity
                                    : item.quantity + 0}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeliveryBoyInventory2;

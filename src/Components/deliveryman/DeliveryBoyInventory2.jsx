import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UseDeliveryManContext } from "../../context/DeliverymanGetter";
import { useParams } from "react-router-dom";
import addicon from "../../Images/svgs/addicon.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import closeIcon from "../../Images/svgs/closeicon.svg";
import profile_image from "../../Images/Png/customer_profile.png";
import { useProductsContext } from "../../context/productgetter";
import Loader from "../Loader";

import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ActionIcon } from "../../Common/Icon";
import { ButtonGroup } from "react-bootstrap";
import {RandomPopup} from "../popups/RandomPopup";

function DeliveryBoyInventory2() {
  const { DeliveryManData } = UseDeliveryManContext();
  const { id } = useParams();
  const [loaderstatus, setLoaderstatus] = useState(false);
  const { productData, fetchProducts } = useProductsContext();
  const [delivryMan, setDeliveryMan] = useState([]);
  const [filtervalue, setFilterValue] = useState("");
  const [productname, setproductname] = useState("");
  const [selectedproduct, setselectedProduct] = useState([]);
  const [addquantity, setaddquantity] = useState(0);
  const [varienttype, setvarienttype] = useState("");
  const [selectAll, setSelectAll] = useState([]);
  const [itemSelect, setItemSelect] = useState({});
  const [disableUpload, setDisableUpload] = useState(false);
  const [finalVanProducts, setFinalVanProducts] = useState([]);
  const [conformpop, setConFormPop] = useState(false);
  
  const [AllProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);

console.log(orders,"order")
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  function addToVan(e) {
    e.preventDefault();
    if (
      productname.length > 0 &&
      addquantity > 0 &&
      (itemSelect.item.stockUnitType === "KG" && varienttype === "GRAM"
        ? itemSelect.item.totalStock * 1000 >= addquantity
        : itemSelect.item.totalStock >= addquantity)
    ) {
      setDisableUpload(true);
      let totalQuantity;
      if (itemSelect.varient == "GRAM") {
        totalQuantity = itemSelect.updatedQuantity / 1000;
      } else {
        totalQuantity = itemSelect.updatedQuantity;
      }
      // //////////////// updating All state items /////////////////////

      if (AllProducts.length > 0) {
        let isPresent = AllProducts.some(
          (item) => item.productid == itemSelect.item.id
        );

        if (isPresent) {
          for (let i of AllProducts) {
            if (i.productid == itemSelect.item.id) {
              let previousQuantity = i.quantity;
              i.quantity = (
                Number(totalQuantity) + Number(previousQuantity)
              ).toFixed(3);
            }
          }
        } else {
          setAllProducts([
            ...AllProducts,
            {
              productid: itemSelect.item.id,
              DeliveryCharge: itemSelect.item.DeliveryCharge,
              ServiceCharge: itemSelect.item.ServiceCharge,
              brand: itemSelect.item.brand.name,
              stockUnitType: itemSelect.item.stockUnitType,
              sku: itemSelect.item.sku,
              quantity: Number(totalQuantity).toFixed(3),
              name: itemSelect.item.name,
              totalStock: itemSelect.item.totalStock,
              productImage: itemSelect.item.productImages[0],
              salesprice: itemSelect.item.salesprice,
              tax: itemSelect.item.Tax,
            },
          ]);
        }
      } else {
        setAllProducts([
          ...AllProducts,
          {
            productid: itemSelect.item.id,
            DeliveryCharge: itemSelect.item.DeliveryCharge,
            ServiceCharge: itemSelect.item.ServiceCharge,
            brand: itemSelect.item.brand.name,
            stockUnitType: itemSelect.item.stockUnitType,
            sku: itemSelect.item.sku,
            quantity: Number(totalQuantity).toFixed(3),
            name: itemSelect.item.name,
            totalStock: itemSelect.item.totalStock,
            productImage: itemSelect.item.productImages[0],
            salesprice: itemSelect.item.salesprice,
            tax: itemSelect.item.Tax,
          },
        ]);
      }

      // handling Updating State ///////////////////////////////
      if (finalVanProducts.length > 0) {
        for (let i of finalVanProducts) {
          if (i.id == itemSelect.item.id) {
            let previousQuantity = i.updatedQuantity;

            const index = finalVanProducts.indexOf(i);
            if (index !== -1) {
              finalVanProducts.splice(index, 1);
            }
            setFinalVanProducts([
              ...finalVanProducts,
              {
                ...itemSelect.item,
                updatedQuantity: totalQuantity + previousQuantity,
              },
            ]);
          } else {
            setFinalVanProducts([
              ...finalVanProducts,
              { ...itemSelect.item, updatedQuantity: totalQuantity },
            ]);
          }
        }
      } else {
        setFinalVanProducts([
          ...finalVanProducts,
          { ...itemSelect.item, updatedQuantity: totalQuantity },
        ]);
      }
      //////////////////////////////////  clear data ////////////////////////////////

      setItemSelect({});
      setvarienttype("");
      setproductname("");
      setaddquantity(0);
    } else if (addquantity === 0 || productname.length === 0) {
      toast.error("Please select each field", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.warning("Product stock not available", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  ///////////////////////             update entry                      ////////////////////////////////////
  async function updateEntry(e) {
    let loaditems = [];
    e.preventDefault();
    if (finalVanProducts.length == 0) {
      return null;
    }
    setLoaderstatus(true);
    setDisableUpload(false);
    let batch = writeBatch(db);
    try {
      for (const items of AllProducts) {
        const vanDocRef = doc(db, `Delivery/${id}/Van/${items.id}`);
        const existingDoc = await getDoc(vanDocRef);
        if (!existingDoc.exists()) {
          delete items.id;

          await addDoc(collection(db, `Delivery/${id}/Van`), items);
        } else {
          delete items.id;
          const newQty = items.quantity ?? 0;
          batch.update(vanDocRef, { quantity: newQty });
        }
      }

      for (const element of finalVanProducts) {
        loaditems.push(element);
        const washingtonRef = doc(db, "products", element.id);
        let finalvalue = element.totalStock - element.updatedQuantity;
        await updateDoc(washingtonRef, {
          totalStock: finalvalue,
        });
      }

      addDailyDoc(loaditems, []);
    } catch (error) {
      setLoaderstatus(false);
      console.log("Error in Adding Data to Van", error);
    }
    setAllProducts([]);
    await batch.commit();
    setLoaderstatus(true);
    GetAllProductsInVan();
    FeatchProductName();
    setproductname("");
    setaddquantity(0);
    setvarienttype("");
    fetchProducts();
    setLoaderstatus(false);

    // Success toast message
    toast.success("Product added Successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });

    setFinalVanProducts([]);
  }
  //////////////////////////////////

  async function handleWithdrow() {
    let unloaditems = [];
    if (selectAll.length == 0) {
      return null;
    }
    setLoaderstatus(true);
    try {
      const itemsToAdd = AllProducts.filter((item) =>
        selectAll.includes(item.id)
      );
      for (let item of itemsToAdd) {
        unloaditems.push(item);
        const docRef = doc(db, "products", item.productid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          let totalStock = Number(productData.totalStock);
          let changesold = Number(item.sold ? item.sold : 0);
          let updatedStock = totalStock + Number(item.quantity - changesold);
          let fixedstokes = Number(updatedStock).toFixed(3);
          const updateRef = doc(db, "products", item.productid);
          await updateDoc(updateRef, {
            totalStock: Number(fixedstokes),
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
      const updateVan = AllProducts.filter(
        (item) => !selectAll.includes(item.id)
      );
      for (let item of updateVan) {
        delete item.id;
        await addDoc(vanCollectionRef, item);
      }
      // Update local state
      setAllProducts(updateVan);
      GetAllProductsInVan();
      setLoaderstatus(false);
      FeatchProductName();
      setproductname("");
      fetchProducts();

      toast.success("Product withdrawn successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      addDailyDoc([], unloaditems);
    } catch (error) {
      setLoaderstatus(false);
      console.error("Error in withdrawing product:", error);
    }
  }

  ////////////////////////////////    create history van    ////////////////////////////////////////////

  async function addDailyDoc(loaditems, unloaditems) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    ///////////////////////////////   subtract sold value in Quantity  //////////////////////////

    let newupdateUnloadItems = unloaditems.map((value) => ({
      ...value,
      quantity: value.quantity - Number(value.sold || 0),
    }));

    try {
      const historyRef = collection(db, `Delivery/${id}/history`);
      const q = query(historyRef, where("formattedDate", "==", formattedDate));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(historyRef, {
          loaditems: loaditems,
          unloaditems: newupdateUnloadItems,
          formattedDate,
          formattedTime: today.toLocaleTimeString("en-GB", {
            timeZone: "Asia/Kolkata",
          }),
        });
      } else {
        let historyDocId = null;
        let filterloaditems = [];
        let filterunloaditems = [];
        querySnapshot.forEach((doc) => {
          historyDocId = doc.id;
          filterloaditems = doc.data().loaditems || [];
          filterunloaditems = doc.data().unloaditems || [];
        });

        if (historyDocId) {
          //////////////////////////     load items   //////////////////////////////////////
          const updatedLoadItems = filterloaditems.map((filterItem) => {
            const match = loaditems.find(
              (loadItem) => loadItem.id === filterItem.id
            );
            if (match) {
              return {
                ...filterItem,
                ...match,
                updatedQuantity:
                  (filterItem.updatedQuantity || 0) +
                  (match.updatedQuantity || 0),
              };
            }
            return filterItem;
          });
          //////////////////////////   update  load items   //////////////////////////////////////
          const unmatchedLoadItems = loaditems.filter(
            (loadItem) =>
              !filterloaditems.some(
                (filterItem) => filterItem.id === loadItem.id
              )
          );
          const finalLoadItems = [...updatedLoadItems, ...unmatchedLoadItems];
          //////////////////////////////  unload items  ////////////////////////////////////////
          const updatedUnloadItems = filterunloaditems.map((filterItem) => {
            const match = newupdateUnloadItems.find(
              (unloadItem) => unloadItem.productid === filterItem.productid
            );
            if (match) {
              return {
                ...filterItem,
                ...match,
                quantity: filterItem.quantity + match.quantity,
              };
            }
            return filterItem;
          });
          //////////////////////////////  update unload items  ////////////////////////////////////////
          const unmatchedUnloadItems = newupdateUnloadItems.filter(
            (unloadItem) =>
              !filterunloaditems.some(
                (filterItem) => filterItem.productid === unloadItem.productid
              )
          );

          const finalUnloadItems = [
            ...updatedUnloadItems,
            ...unmatchedUnloadItems,
          ];
          const vanDocRef = doc(db, `Delivery/${id}/history/${historyDocId}`);
          await updateDoc(vanDocRef, {
            loaditems: finalLoadItems,
            unloaditems: finalUnloadItems,
          });
        } else {
          console.error("Failed to retrieve history document ID.");
        }
      }
    } catch (error) {
      console.error("Error creating daily document:", error);
    }
  }

  //////////////   filter delivryMan data  ////////////////

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.id === id);
    setDeliveryMan(DeliveryManDatas);
  }, [id, delivryMan.length !== 0]);

  //////////////   filter products data  ////////////////

  function FeatchProductName() {
    let filterData = productData.filter(
      (product) => product.name === productname
    );
    setselectedProduct(filterData);
  }

  useEffect(() => {
    FeatchProductName();
  }, [productname]);

  //////////////////// get all products in van firebase //////////////

  function GetAllProductsInVan() {
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
  }

  useEffect(() => {
    GetAllProductsInVan();
  }, [id, DeliveryManData]);

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

  ////////////  time history  //////////

  async function onHandleLoadVan(vandata) {
    setLoaderstatus(true);
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const formattedTime = today.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
    });

    try {
      const historyRef = collection(db, `Delivery/${id}/history`);
      const q = query(historyRef, where("formattedDate", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const historyKey =
        vandata === "loadOutvan" ? "LoadOutVanHistory" : "LoadInVanHistory";
      const newEntry = { date: formattedDate, time: formattedTime };

      if (querySnapshot.empty) {
        await addDoc(historyRef, {
          formattedDate,
          [historyKey]: [newEntry],
        });
      } else {
        let historyDocId = null;
        let vanHistoryData = [];
        querySnapshot.forEach((doc) => {
          historyDocId = doc.id;
          vanHistoryData = doc.data()[historyKey] || [];
        });
        vanHistoryData.push(newEntry);
        const vanDocRef = doc(db, `Delivery/${id}/history/${historyDocId}`);
        await updateDoc(vanDocRef, {
          [historyKey]: vanHistoryData,
        });
      }
      setLoaderstatus(false);
    } catch (error) {
      console.error("Error adding van entry:", error);
      setLoaderstatus(false);
    }
  }

  async function getDeliverman() {
    let list = [];

    const querySnapshot = await getDocs(collection(db, "Delivery"));
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    const DeliveryManval = list.filter((item) => item.id === id);

     
    const allTerritories = DeliveryManval[0].serviceArea?.flatMap(
      (area) => area.terretory
    );

    return allTerritories;
  }

  const fetchOrders = async () => {


    const allTerritories = await getDeliverman();



    try {
      const ordersRef = collection(db, "order");
      const q = query(
        ordersRef,
        where("shipping.area", "in", allTerritories),
        where("status", "==", "PROCESSING")
      );
      const querySnapshot = await getDocs(q);

      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const updateAllOrdersStatus = async () => {
    try {
      const batch = writeBatch(db);

      orders.forEach((order) => {
        const orderRef = doc(db, "order", order.id);
        batch.update(orderRef, { status: "OUT_FOR_DELIVERY", assign_to:id });
      });

      await batch.commit();
      console.log("All orders updated to OUT FOR DELIVERY ✅");
    } catch (error) {
      console.error("Error updating all orders:", error);
    }
  };
  const handleUpdateOrders = () => {
    const allProductTitles = AllProducts.map(p => p.name); // ✅ list of allowed titles

    let totalOrders = orders.length;
    let matchedOrders = 0;

    console.log(totalOrders, "Total Orders");
    console.log(allProductTitles, "Allowed Product Titles");

    orders.forEach(order => {
      const items = order.items || [];

      const hasMatchingItem = items.some(item =>
        allProductTitles.includes(item.title)
      );

      if (hasMatchingItem) {
        matchedOrders++;
      }
    });


    if (matchedOrders === 0) {
      alert("❌ Product not found in van. Orders not updated.");
      return;
    }

    if (matchedOrders < totalOrders) {
      const confirmProceed = window.confirm(
        `⚠️ ${matchedOrders} out of ${totalOrders} orders matched with products in van. Do you want to proceed?`
      );
      if (!confirmProceed) return;
      updateAllOrdersStatus();
      return;
    }


    // ✅ Final update call
    alert("✅ All orders matched. Orders are marked as OUT_FOR_DELIVERY.");
    updateAllOrdersStatus();
  };

  console.log(AllProducts, "all products");

  
  // fetching orders
  useEffect(() => {
    fetchOrders();
  }, []);


  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div>
        <RandomPopup showModal={showModal} handleClose={handleClose} data={orders} updateAllOrdersStatus={handleUpdateOrders} />
        <div className="main_panel_wrapper bg_light_grey w-100">
          {/* conform pop */}
          {conformpop ? <div className="bg_black_overlay"></div> : null}
          {conformpop && (
            <div className={`position-relative ${conformpop ? "" : "d-none"}`}>
              <div className="Logout_popup">
                <div onClick={() => setConFormPop(false)} className="text-end">
                  <img
                    width={40}
                    className="cursor_pointer"
                    src={closeIcon}
                    alt="closeIcon"
                  />
                </div>
                <p className="fs-2sm fw-700 black mb-0 text-center">
                  {conformpop === "loadInvan"
                    ? "Load Into Van"
                    : "Unload From Van"}
                </p>
                <p className="fs-sm fw-500 black text-center mt-4">
                  Are you sure you want to{" "}
                  {conformpop === "loadInvan" ? "Load Into" : "Unload From"} the
                  Van?
                </p>
                <div className="d-flex align-items-center justify-content-center gap-4 mt-4 pt-2">
                  <button
                    onClick={() => setConFormPop(false)}
                    className="cancel_btn fs-sm fw-400 color_brown"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => (
                      onHandleLoadVan(conformpop), setConFormPop(false)
                    )}
                    className="delete_btn"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  onClick={updateEntry}
                  className={`${
                    finalVanProducts.length == 0 ? "opacity-50" : "opacity-100"
                  } outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 `}
                >
                  Update Entry
                </button>
                {AllProducts.length !== 0 && (
                  <button
                    onClick={handleWithdrow}
                    disabled={disableUpload}
                    className={`${
                      disableUpload || selectAll.length == 0
                        ? "opacity-50"
                        : "opacity-100"
                    } outline_none border-0 update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400`}
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
                      {productData
                        .filter((v) =>
                          v.name
                            .toLowerCase()
                            .includes(filtervalue.toLowerCase())
                        )
                        .map((item, index) => (
                          <li key={index}>
                            <div
                              onClick={() => {
                                setproductname(item.name);
                                setItemSelect({ ...itemSelect, item: item });
                                setvarienttype("");
                                setFilterValue("");
                              }}
                              className="dropdown-item py-2"
                            >
                              <p className="fs-sm fw-400 black m-0">
                                {item.name}
                              </p>
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
                        setItemSelect({
                          ...itemSelect,
                          updatedQuantity: Number(e.target.value),
                        });
                        setaddquantity(Number(e.target.value) || 0);
                      }}
                    />
                  </div>
                  {selectedproduct.length !== 0 &&
                    selectedproduct[0].stockUnitType.toLowerCase() === "kg" && (
                      <div className="w-100 d-flex align-items-center gap-3 quantity_bg">
                        <select
                          required
                          onChange={(e) => {
                            setItemSelect({
                              ...itemSelect,
                              varient: e.target.value,
                            });
                            setvarienttype(e.target.value);
                          }}
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
                    onClick={() => setShowModal(true)}
                    className="addnewproduct_btn2  gap-2 white_space_nowrap black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                  >
                    <span>Process All Orders</span>
                  </button>
                  <button
                    onClick={() => setConFormPop("loadOutvan")}
                    className="addnewproduct_btn  gap-2 white_space_nowrap black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                  >
                    <ActionIcon />
                    <span>Load Out Van</span>
                  </button>
                  <button
                    onClick={() => setConFormPop("loadInvan")}
                    className="addnewproduct_btn gap-2 white_space_nowrap black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 "
                  >
                    <ActionIcon />
                    <span>Load In Van</span>
                  </button>
                  <button
                    onClick={addToVan}
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
                            Total Quantity
                          </p>
                        </th>
                        <th className="mx_140 cursor_pointer">
                          <p className="fw-400 fs-sm black mb-0 ms-3">Sold</p>
                        </th>
                        <th className="mx_140 cursor_pointer">
                          <p className="fw-400 fs-sm black mb-0 ms-3">
                            Available Quantity
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
                                  N/A{" "}
                                </h3>
                              </td>
                              <td className="mx_140">
                                <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                  {item.quantity}
                                  <span className=" ms-1">
                                    {item.stockUnitType == "GRAM"
                                      ? "KG"
                                      : item.stockUnitType}
                                  </span>
                                </h3>
                              </td>
                              <td className="mx_140">
                                <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                  {item.sold ? item.sold : 0}
                                  <span className=" ms-1">
                                    {item.stockUnitType == "GRAM"
                                      ? "KG"
                                      : item.stockUnitType}
                                  </span>
                                </h3>
                              </td>
                              <td className="mx_140">
                                <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                                  {Number(
                                    item.quantity - (item.sold ? item.sold : 0)
                                  ).toFixed(3)}
                                  <span className=" ms-1">
                                    {item.stockUnitType == "GRAM"
                                      ? "KG"
                                      : item.stockUnitType}
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

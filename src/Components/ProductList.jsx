import React, { useEffect, useState } from "react";
import filtericon from "../Images/svgs/filtericon.svg";
import addicon from "../Images/svgs/addicon.svg";
import checkicon from "../Images/svgs/checkicon.svg";
import deleteIcon from "../Images/Png/Icons.png";
import { ProductList } from "../Common/Helper";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Modifyproduct from "./Modifyproduct";

const ProductListComponent = () => {
  const [selectedProduct, setselectedProduct] = useState(null);
  const [data, setData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
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


  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, "products", id)).then(() => {
        setData(data.filter((item) => item.id !== id));
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="container">
          <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500  mb-0 black fs-lg">Products</h1>
            </div>
            <div className="d-flex align-itmes-center gap-3">
              <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={24} src={filtericon} alt="filtericon" />
                Filter
              </button>
              <Link
                to="/addproduct"
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Product
              </Link>
            </div>
          </div>
          {/* product details  */}
          <div className="p-3 mt-3 bg-white product_shadow">
            <div className="overflow-x-scroll line_scroll">
              <div className="product_overflow_X ">
                <div className="d-flex align-items-center justify-content-between py-3">
                  <div className="d-flex align-items-center  w-25 ">
                    <label className="check1 fw-400 fs-sm black mb-0">
                      Product
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="d-flex align-items-center   w-75">
                    <h3 className="fs-sm fw-400 black mb-0 mw-300">Product ID</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-450">Short Discription </h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">SKU</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Category</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Stock</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Status</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Price</h3>
                    <h3 className="fs-sm fw-400 black mb-0  pe-4">Action</h3>
                  </div>
                </div>
                <div className="product_borderbottom"></div>

                {data.map((value, index) => {
                  return (
                    <div
                      className="d-flex align-items-center justify-content-md-between py-3"
                      key={index}>
                      <div className="d-flex align-items-center gap-3 w-25 ">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          {value.name}
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="d-flex align-items-center   w-75">
                        <h3 className="fs-sm fw-400 black mb-0 mw-300">{value.id}</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-450">{value.shortDescription}</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-200"> {value.sku}</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-200">{value.categories[0]}</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-200">50</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-200">{value.status}</h3>
                        <h3 className="fs-sm fw-400 black mb-0 mw-200">{value.originalPrice}</h3>
                        <div className="position-relative    d-flex pe-4  flex-column align-items-end  ">
                          <img
                            onClick={() => {
                              handleDelete(value.id);
                            }}
                            className="threedot me-3"
                            src={deleteIcon}
                            alt="threedot"
                          />
                          {/* 
                          {selectedProduct === index && (
                            <div className="position-absolute mt-4 z_index top-20 bg_white">
                              <Modifyproduct />
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListComponent;

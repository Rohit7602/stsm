import React from 'react';
import filtericon from '../Images/svgs/filtericon.svg';
import manicon from '../Images/svgs/manicon.svg';
import threedot from '../Images/svgs/threedot.svg';
import search from '../Images/svgs/search.svg';
import SearchIcon from '../Images/svgs/search.svg';
import { collection, doc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Customers = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const q = query(collection(db, 'customers'), where('is_customer', '==', true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        console.log(list);
        setData([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="main_panel_wrapper pb-4 overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="container">
          <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              {/* <button onClick={() => setOpen(!open)}>Click</button> */}
              <h1 className="fw-500  mb-0 black fs-lg">Customers</h1>
            </div>
            <div className="d-flex align-itmes-center gap-3">
              <div className="d-flex px-2 gap-2 align-items-center input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input"
                  placeholder="Search for categories..."
                />
              </div>
              <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400  ">
                <img className="me-1" width={24} src={filtericon} alt="filtericon" />
                Filter
              </button>
            </div>
          </div>
          {/* Customers details  */}
          <div className="p-3 mt-3 bg-white product_shadow">
            <div className="overflow-x-scroll line_scroll">
              <div className="Customers_overflow_X">
                <div className="d-flex align-items-center justify-content-between py-3">
                  <div className="d-flex align-items-center gap-3 width_33">
                    <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                      Name
                      <input type="checkbox" />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div className="d-flex width_33">
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Registration</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">City / State</h3>
                  </div>
                  <div className="d-flex width_33">
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Group</h3>
                    <h3 className="fs-sm fw-400 black mb-0 mw-200">Total Spent</h3>
                    <h3 className="fs-sm fw-400 black mb-0  me-3">Action</h3>
                  </div>
                </div>
                <div className="product_borderbottom"></div>
                {data.map((item, index) => {
                  const {
                    id,
                    city,
                    is_customer,
                    email,
                    is_salesman,
                    state,
                    is_wholesaler,
                    name,
                    image,
                    created_at,
                  } = item;
                  const formatNumbers = function (num) {
                    return num < 10 ? '0' + num : num;
                  };
                  const formatDate = function (date) {
                    let day = formatNumbers(date.getDate());
                    let month = formatNumbers(date.getMonth() + 1);
                    let year = date.getFullYear();

                    return day + '-' + month + '-' + year;
                  };
                  const newval = new Date(created_at);
                  const newDate = formatDate(newval);
                  return (
                    <>
                      <div className="d-flex align-items-center justify-content-between py-3">
                        <div className="d-flex align-items-center gap-3  width_33">
                          <label class="check1 fw-400 fs-sm black mb-0  align-items-center d-flex">
                            {' '}
                            <img
                              className="manicon mx-2"
                              src={!image ? manicon : image}
                              alt="manicon"
                            />
                            <div>
                              <Link
                                className="d-flex py-1 color_black_02"
                                to={`/CustomerDetailsView/${id}`}>
                                {' '}
                                {name}
                              </Link>

                              <h3 className="fs-xxs fw-400 fade_grey mt-1 mb-0">{email}</h3>
                            </div>
                            <input type="checkbox" />
                            <span class="checkmark"></span>
                          </label>
                        </div>
                        <div className="d-flex width_33">
                          <h3 className="fs-sm fw-400 black mb-0 mw-200">{newDate}</h3>
                          <h3 className="fs-sm fw-400 black mb-0 mw-200">
                            {city} / {state}
                          </h3>
                        </div>
                        <div className="d-flex  width_33">
                          <h3 className="fs-sm fw-400 black mb-0 mw-200">Public</h3>
                          <h3 className="fs-sm fw-400 black mb-0 mw-200">₹ 32,460.00</h3>

                          <img
                            className="threedot me-3"
                            src={threedot}
                            alt="threedot"
                            onClick={() => {
                              alert('Actions Under Development');
                            }}
                          />
                        </div>
                      </div>
                      <div className="product_borderbottom"></div>
                    </>
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

export default Customers;

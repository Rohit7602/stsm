import React from 'react';
import saveicon from '../Images/svgs/saveicon.svg';
import threedot from '../Images/svgs/threedot.svg';
import manimage from '../Images/Png/manimage.png';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ViewCustomerDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const formatNumbers = function (num) {
    return num < 10 ? '0' + num : num;
  };
  const formatDate = function (date) {
    let day = formatNumbers(date.getDate());
    let month = formatNumbers(date.getMonth() + 1);
    let year = date.getFullYear();

    return day + '-' + month + '-' + year;
  };
  const newval = new Date(data.created_at);
  const newDate = formatDate(newval);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const docRef = doc(db, 'customers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column gap-2 gap-sm-0 flex-sm-row  justify-content-between">
          <div className="d-flex">
            {/* <button onClick={() => setOpen(!open)}>Click</button> */}
            <h1 className="fw-500  mb-0 black fs-lg">View Customer Details</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <button className="reset_border">
              <button className="fs-sm reset_btn  border-0 fw-400 ">Block Customer</button>
            </button>
            <button className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  ">
              <img src={saveicon} alt="saveicon" />
              Reset Password
            </button>
          </div>
        </div>
        {/* View Customer Details  */}

        <Row className="mt-3">
          <Col xxl={4}>
            {/* Basic Information */}
            <div className="product_shadow bg_white d-flex flex-column justify-content-center align-items-center p-3">
              <img className="manimage" src={!data.image ? manimage : data.image} alt="manimage" />
              <h2 className="fw-700 fs-2sm black mb-0 mt-3">{data.name}</h2>
              <h2 className="fw-400 fs-2sm black mb-0 mt-2">{data.email}</h2>
              <h2 className="fw-400 fs-2sm black mb-0 ">{data.phone}</h2>
            </div>
            {/*   last order */}
            <div className="product_shadow bg_white p-3 mt-3">
              <h2 className="fw-400 fs-2sm black mb-0  ">Last Order</h2>
              <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">
                3 days ago - <span className="color_light_blue">#87oh67t</span>
              </h2>
              <h2 className="fw-400 fs-2sm black mb-0 mt-3  ">Average Order Value</h2>
              <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">345.00</h2>
              <h2 className="fw-400 fs-2sm black mb-0 mt-3 ">Registration</h2>
              <h2 className="fw-400 fs-xs fade_grey mb-0 mt-1  ">{newDate}</h2>
            </div>
          </Col>
          <Col xxl={8}>
            <div className="product_shadow p-3 bg_white mt-3 mt-xxl-0">
              <div className="overflow_lg_scroll">
                <div className="customer_lg_overflow_X">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2 className="fw-400 fs-2sm black mb-0  "> Order</h2>{' '}
                    <h2 className="fw-400 fs-2sm black mb-0  ">Total Spent : ₹ 12,590.00</h2>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3"></div>
                  <table className="w-100">
                    <tr className="product_borderbottom">
                      <th className="p-3">
                        <h2 className="fw-400 fs-sm black mb-0"> Order No. </h2>
                      </th>
                      <th className="py-3">
                        <h2 className="fw-400 fs-sm black mb-0"> Order Date </h2>
                      </th>
                      <th className='p-3'>
                        <h2 className="fw-400 fs-sm black mb-0"> Status </h2>
                      </th>
                      <th className='py-3'>
                        <h2 className="fw-400 fs-sm black mb-0"> Items </h2>
                      </th>
                      <th className="mx_140 ps-3">
                        <h2 className="fw-400 fs-sm black mb-0">Billed Amount</h2>
                      </th>
                    </tr>
                    <tr className="product_borderbottom">
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm color_green mb-0 mt-3 "> #p7oh67gtbyh </h2>
                      </td>
                      <td className="py-3">
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 01-01-2023 </h2>
                      </td>
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> Pending </h2>
                      </td>
                      <td className='py-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 2 items </h2>
                      </td>
                      <td className='ps-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 me-2">₹ 1,260.00</h2>
                      </td>
                    </tr>
                    <tr className="product_borderbottom">
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm color_green mb-0 mt-3 "> #p7oh67gtbyh </h2>
                      </td>
                      <td className="py-3">
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 01-01-2023 </h2>
                      </td>
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> Pending </h2>
                      </td>
                      <td className='py-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 2 items </h2>
                      </td>
                      <td className='ps-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 me-2">₹ 1,260.00</h2>
                      </td>
                    </tr>
                    <tr className="product_borderbottom">
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm color_green mb-0 mt-3 "> #p7oh67gtbyh </h2>
                      </td>
                      <td className="py-3">
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 01-01-2023 </h2>
                      </td>
                      <td className='p-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> Pending </h2>
                      </td>
                      <td className='py-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 "> 2 items </h2>
                      </td>
                      <td className='ps-3'>
                        <h2 className="fw-400 fs-sm black mb-0 mt-3 me-2">₹ 1,260.00</h2>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center justify-content-center">
                <button className="border-0 bg-transparent fs-sm fw-400 color_blue">
                  View all 6 orders
                </button>
              </div>
            </div>
            <div className="product_shadow p-3 bg_white mt-3">
              <h2 className="fw-400 fs-2sm black mb-0  "> Addresses</h2>{' '}
              <div className="product_borderbottom mt-3"></div>
              {/* 1st */}
              <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                <div>
                  <h2 className="fw-700 fs-sm black mb-0   ">John Doe</h2>
                  <h2 className="fw-400 fs-xs black mb-0   ">
                    Address Line 1, Landmark, Area, Landmark, City, State
                  </h2>
                </div>
                <img className="threedot" src={threedot} alt="threedot" />
              </div>
              <div className="product_borderbottom mt-3"></div>
              {/* 2nd */}
              <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                <div>
                  <h2 className="fw-700 fs-sm black mb-0   ">John Doe</h2>
                  <h2 className="fw-400 fs-xs black mb-0   ">
                    Address Line 1, Landmark, Area, Landmark, City, State
                  </h2>
                </div>
                <img className="threedot" src={threedot} alt="threedot" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewCustomerDetails;

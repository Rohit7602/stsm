import React, { useState, useEffect } from 'react';
import paymenticon from '../../Images/svgs/saveicon.svg';
import { Col, Row } from 'react-bootstrap';
import profile_image from '../../Images/Png/customer_profile.png';
import { useParams } from 'react-router-dom';
import Loader from '../Loader';
import { UseDeliveryManContext } from '../../context/DeliverymanGetter';



const DeliverymanProfile = () => {
  const { DeliveryManData } = UseDeliveryManContext()
  const { id } = useParams()
  const [filterData, setfilterData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.d_id === id);
    setfilterData(DeliveryManDatas);
  }, [DeliveryManData, id]);


  if (!id || filterData.length === 0) {
    return <Loader> </Loader>;
  }


  console.log("filter Data is ", filterData)


  return (
    filterData.map((datas, index) => {
      return (
        <div className="my-4">
          <div className="d-flex justify-content-between align-items-center mt-4 mx-2">
            <h1 className="fw-500  mb-0 black fs-lg">{datas.basic_info.name === "" ? "N/A" : datas.basic_info.name} {datas.d_id} </h1>
            <div className="d-flex justify-content-center">
              <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 16C1 16.5304 1.21071 17.0391 1.58579 17.4142C1.96086 17.7893 2.46957 18 3 18H11C11.5304 18 12.0391 17.7893 12.4142 17.4142C12.7893 17.0391 13 16.5304 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z"
                          fill="#D73A60"
                        />
                      </svg>
                      Delete Delivery Man
                    </button>
                  </button>
                  <svg
                    className="cursor_pointer"
                    width="44"
                    height="48"
                    viewBox="0 0 44 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect width="44" height="48" rx="10" fill="white" />
                    <path
                      d="M25 17.9997L28 20.9997M23 31.9997H31M15 27.9997L14 31.9997L18 30.9997L29.586 19.4137C29.9609 19.0386 30.1716 18.53 30.1716 17.9997C30.1716 17.4694 29.9609 16.9608 29.586 16.5857L29.414 16.4137C29.0389 16.0388 28.5303 15.8281 28 15.8281C27.4697 15.8281 26.9611 16.0388 26.586 16.4137L15 27.9997Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center text-center gap-4 mt-4 pb-2 flex-wrap">
            <div className="d-flex align-items-center text-center bg_light_orange">
              <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">Total Delivery</p>
                <p className="fs_24 fw_600 red m-0 mt-2">30</p>
              </div>
              <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column">
                <p className="fs-sm fw-400 black m-0">On Site Orders</p>
                <p className="fs_24 fw_600 black m-0 mt-2">12</p>
              </div>
            </div>
            <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column bg_light_sky">
              <p className="fs-sm fw-400 black m-0">Attendance Count</p>
              <p className="fs_24 fw_600 color_blue m-0 mt-2">16</p>
            </div>
            <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column bg_light_green">
              <p className="fs-sm fw-400 black m-0">Wallet Balance</p>
              <p className="fs_24 fw_600 green m-0 mt-2">₹ 12,500</p>
            </div>
            <div className="profile_top_data_width d-flex align-items-center justify-content-center flex-column bg_light_purple">
              <p className="fs-sm fw-400 black m-0">Van Capacity</p>
              <p className="progress_bar mb-0 mt-2">
                <span></span>
              </p>
            </div>
          </div>
          <Row className="mt-3">
            <Col xl={6}>
              <div className="p-2 bg-white product_shadow">
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Name</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.name === "" ? "N/A" : datas.basic_info.name}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Date of Birth</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.dob === "" ? "N/A" : (new Date(datas.basic_info.dob).toLocaleDateString())}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Phone</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.phone_no === "" ? "N/A" : datas.basic_info.phone_no}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Email</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.email === "" ? "N/A" : datas.basic_info.email}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Address</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.address === "" ? "N/A" : datas.basic_info.address}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">City</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.city === "" ? "N/A" : datas.basic_info.city}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">State </p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.state === "" ? "N/A" : datas.basic_info.state}</p>
                </div>
              </div>
              <div className="p-2 bg-white product_shadow mt-4">
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Emergency Number</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.emergency_contact.phone_no === "" ? "N/A" : datas.basic_info.emergency_contact.phone_no}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Relative Name</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.emergency_contact.name === "" ? "N/A" : datas.basic_info.emergency_contact.name}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Relation</p>
                  <p className="fs-16 fw-400 black m-0">{datas.basic_info.emergency_contact.relationship === "" ? "N/A" : datas.basic_info.emergency_contact.relationship}</p>
                </div>
              </div>
            </Col>
            <Col xl={6}>
              <div className="p-2 bg-white product_shadow">
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Job Title</p>
                  <p className="fs-16 fw-400 black m-0">Delivery Man</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Date of Joining</p>
                  <p className="fs-16 fw-400 black m-0">{datas.job_info.joining_date === "" ? "N/A" : (new Date(datas.job_info.joining_date).toLocaleDateString())}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Employment Type</p>
                  <p className="fs-16 fw-400 black m-0">{datas.job_info.employement_type === "" ? "N/A" : datas.job_info.employement_type}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Time Schedule</p>
                  <p className="fs-16 fw-400 black m-0">{datas.job_info.shift === "" ? "N/A" : datas.job_info.shift}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Document Number</p>
                  <p className="fs-16 fw-400 black m-0">{datas.kyc.document_number === "" ? "N/A" : datas.kyc.document_number}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Driving License </p>
                  <p className="fs-16 fw-400 black m-0">{datas.vehicle.dl_number === "" ? "N/A" : datas.vehicle
                    .dl_number}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Vehicle Reg. No. </p>
                  <p className="fs-16 fw-400 black m-0">{datas.vehicle
                    .vehicle_number === "" ? "N/A" : datas.vehicle
                    .vehicle_number}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Vehicle Type</p>
                  <p className="fs-16 fw-400 black m-0">{datas.vehicle
                    .vehicle_type === "" ? "N/A" : datas.vehicle
                    .vehicle_type}</p>
                </div>
              </div>
              <div className="p-2 bg-white product_shadow mt-4">
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Bank Name</p>
                  <p className="fs-16 fw-400 black m-0">{datas.bank.bank_name === "" ? "N/A" : datas.bank.bank_name}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">IFSC</p>
                  <p className="fs-16 fw-400 black m-0">{datas.bank.ifsc_code === "" ? "N/A" : datas.bank.ifsc_code}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Account Number</p>
                  <p className="fs-16 fw-400 black m-0">{datas.bank.account_no === "" ? "N/A" : datas.bank.account_no}</p>
                </div>
                <div className="d-flex py_10">
                  <p className="left_content_width fs-16 fw-400 black m-0">Name in Account</p>
                  <p className="fs-16 fw-400 black m-0">{datas.bank.account_holder_name === "" ? "N/A" : datas.bank.account_holder_name}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )
    })
  );
};

export default DeliverymanProfile;

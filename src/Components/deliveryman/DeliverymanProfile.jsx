import React, { useState, useEffect } from 'react';
import paymenticon from '../../Images/svgs/saveicon.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
import blackCheck from '../../Images/svgs/check_black_icon.svg';
import { Col, Row } from 'react-bootstrap';
import profile_image from '../../Images/Png/customer_profile.png';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Loader';
import { UseDeliveryManContext } from '../../context/DeliverymanGetter';
import { updateDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../firebase';

const DeliverymanProfile = () => {
  const { DeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const { id } = useParams();
  const [filterData, setfilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employTypeDropdown, setEmployTypeDropdown] = useState('');
  const [approvePopup, setApprovePopup] = useState(false);
  const [rejectPopup, setRejectPopup] = useState(false);
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    const DeliveryManDatas = DeliveryManData.filter((item) => item.d_id === id);
    setfilterData(DeliveryManDatas);
  }, [DeliveryManData, id]);

  if (!id || filterData.length === 0) {
    return <Loader> </Loader>;
  }

  async function ApprovedDelivermanProfile(id) {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'Delivery', id), {
        is_verified: true,
        profile_status: 'APPROVED',
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
      updateDeliveryManData({ id: id, is_verified: true, profile_status: 'APPROVED' });
      toast.success('Verified Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoading(false);
      console.log('error is ', error);
    }
  }
  async function RejectDelivermanProfile(id) {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'Delivery', id), {
        is_verified: false,
        profile_status: 'REJECTED',
        updated_at: new Date().toISOString(),
      });
      setLoading(false);
      updateDeliveryManData({ id: id, is_verified: true, profile_status: 'REJECTED' });
      toast.success('Rejected Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoading(false);
      console.log('error is ', error);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return filterData.map((datas, index) => {
    return (
      <div className="my-4">
        {approvePopup ? (
          <div className="approve_popup">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-2sm fw-400 black m-0">Approve Profile</p>
              <img
                onClick={() => setApprovePopup(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Joining Date
            </label>
            <br />
            <input id="date" className="input w-100" type="date" />
            <br />
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Employment Type
            </label>
            <br />
            <div className="dropdown w-100">
              <button
                className="btn dropdown-toggle w-100 employ_dropdown"
                type="button"
                id="dropdownMenuButton3"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <p className="ff-outfit fw-400 fs_sm m-0 fade_grey">
                    {employTypeDropdown ? employTypeDropdown : 'Salaried'}
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
                    onClick={() => setEmployTypeDropdown('ABC')}
                    className="dropdown-item py-2"
                    href="#">
                    <p className="fs-sm fw-400 balck m-0">ABC</p>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setEmployTypeDropdown('DEF')}
                    className="dropdown-item py-2"
                    href="#">
                    <p className="fs-sm fw-400 balck m-0">DEF</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 pt-2 pb-2">
              <div className="d-flex align-items-center w-100">
                <label class="check1 fw-400 fs-sm black mb-0  ms-3">
                  <input
                    onChange={() => setJobType('Part Time')}
                    checked={jobType === 'Part Time'}
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                </label>
                <p className="fs-sm fw-400 black ms-3 ps-1 my-0">Part Time</p>
              </div>
              <div className="d-flex align-items-center w-100">
                <label class="check1 fw-400 fs-sm black mb-0 ">
                  <input
                    onChange={() => setJobType('Full Time')}
                    checked={jobType === 'Full Time'}
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                </label>
                <p className="fs-sm fw-400 black ms-3 ps-1 my-0">Full Time</p>
              </div>
            </div>
            <div className="text-end">
              <button
                onClick={() => {
                  setApprovePopup(false);
                  ApprovedDelivermanProfile(datas.id);
                }}
                className="approve_btn mt-4">
                <p className="m-0 text-white">Approve Profile</p>
              </button>
            </div>
          </div>
        ) : null}
        {rejectPopup ? (
          <div className="approve_popup">
            <div className="d-flex align-items-center justify-content-between">
              <p className="fs-2sm fw-400 black m-0">Reject Profile</p>
              <img
                onClick={() => setRejectPopup(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <label className="fs-xs fw-400 black mt-3 pt-1" htmlFor="date">
              Reason for rejection
            </label>
            <br />
            <textarea
              style={{ maxHeight: '90px' }}
              className="input w-100 outline_none resize_none"
              placeholder="Enter a proper reason here..."></textarea>
            <div className="text-end mt-3 pt-1">
              <button
                onClick={() => {
                  setRejectPopup(false);
                  RejectDelivermanProfile(datas.id);
                }}
                className="reject_delivery">
                Reject profile
              </button>
            </div>
          </div>
        ) : null}
        <div className="d-flex justify-content-between align-items-center mt-4 mx-2">
          <h1 className="fw-500  mb-0 black fs-lg">
            {datas.basic_info.name === '' ? 'N/A' : datas.basic_info.name} {datas.d_id}{' '}
          </h1>
          <div className="d-flex justify-content-center">
            <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
              {datas.profile_status === 'NEW' ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button onClick={() => setApprovePopup(true)} className="approve_btn">
                    <p className="m-0 text-white">Approve Profile</p>
                  </button>
                  <button onClick={() => setRejectPopup(true)} className="reject_delivery">
                    Reject profile
                  </button>
                  {/* <button className="reset_border">
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
                </button> */}
                  {/* <svg
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
                </svg> */}
                </div>
              ) : datas.profile_status === 'APPROVED' ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 10C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12H15C15.2652 12 15.5196 11.8946 15.7071 11.7071C15.8946 11.5196 16 11.2652 16 11C16 10.7348 15.8946 10.4804 15.7071 10.2929C15.5196 10.1054 15.2652 10 15 10H7Z"
                          fill="#D73A60"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22 11C22 17.075 17.075 22 11 22C4.925 22 0 17.075 0 11C0 4.925 4.925 0 11 0C17.075 0 22 4.925 22 11ZM20 11C20 12.1819 19.7672 13.3522 19.3149 14.4442C18.8626 15.5361 18.1997 16.5282 17.364 17.364C16.5282 18.1997 15.5361 18.8626 14.4442 19.3149C13.3522 19.7672 12.1819 20 11 20C9.8181 20 8.64778 19.7672 7.55585 19.3149C6.46392 18.8626 5.47177 18.1997 4.63604 17.364C3.80031 16.5282 3.13738 15.5361 2.68508 14.4442C2.23279 13.3522 2 12.1819 2 11C2 8.61305 2.94821 6.32387 4.63604 4.63604C6.32387 2.94821 8.61305 2 11 2C13.3869 2 15.6761 2.94821 17.364 4.63604C19.0518 6.32387 20 8.61305 20 11Z"
                          fill="black"
                        />
                      </svg>
                      Block Profile
                    </button>
                  </button>
                  <Link to={`/deliveryman/addnewdeliveryman/${datas.d_id}`}>
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
                  </Link>
                </div>
              ) : (
                <button className="reset_border">
                  <button className="fs-sm reset_btn border-0 fw-400  d-flex align-items-center gap-2 transition_04">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17.25 20.4L15.3 18.45L14.25 19.5L17.25 22.5L22.5 17.25L21.45 16.2L17.25 20.4ZM9 13.5H15V15H9V13.5ZM9 9.75H15V11.25H9V9.75ZM9 6H15V7.5H9V6Z"
                        fill="#D73A60"
                      />
                      <path
                        d="M12 21H4.5V18H6V16.5H4.5V12.75H6V11.25H4.5V7.5H6V6H4.5V3H18V15H19.5V3C19.5 2.175 18.825 1.5 18 1.5H4.5C3.675 1.5 3 2.175 3 3V6H1.5V7.5H3V11.25H1.5V12.75H3V16.5H1.5V18H3V21C3 21.825 3.675 22.5 4.5 22.5H12V21Z"
                        fill="black"
                      />
                    </svg>
                    Revise KYC
                  </button>
                </button>
              )}
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
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.name === '' ? 'N/A' : datas.basic_info.name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Date of Birth</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.dob === ''
                    ? 'N/A'
                    : new Date(datas.basic_info.dob).toLocaleDateString()}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Phone</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.phone_no === '' ? 'N/A' : datas.basic_info.phone_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Email</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.email === '' ? 'N/A' : datas.basic_info.email}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Address</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.address === '' ? 'N/A' : datas.basic_info.address}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">City</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.city === '' ? 'N/A' : datas.basic_info.city}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">State </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.state === '' ? 'N/A' : datas.basic_info.state}
                </p>
              </div>
            </div>
            <div className="p-2 bg-white product_shadow mt-4">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Emergency Number</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.phone_no === ''
                    ? 'N/A'
                    : datas.basic_info.emergency_contact.phone_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Relative Name</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.name === ''
                    ? 'N/A'
                    : datas.basic_info.emergency_contact.name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Relation</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.basic_info.emergency_contact.relationship === ''
                    ? 'N/A'
                    : datas.basic_info.emergency_contact.relationship}
                </p>
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
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.joining_date === ''
                    ? 'N/A'
                    : new Date(datas.job_info.joining_date).toLocaleDateString()}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Employment Type</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.employement_type === '' ? 'N/A' : datas.job_info.employement_type}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Time Schedule</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.job_info.shift === '' ? 'N/A' : datas.job_info.shift}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Document Number</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.kyc.document_number === '' ? 'N/A' : datas.kyc.document_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Driving License </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.dl_number === '' ? 'N/A' : datas.vehicle.dl_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Vehicle Reg. No. </p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.vehicle_number === '' ? 'N/A' : datas.vehicle.vehicle_number}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Vehicle Type</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.vehicle.vehicle_type === '' ? 'N/A' : datas.vehicle.vehicle_type}
                </p>
              </div>
            </div>
            <div className="p-2 bg-white product_shadow mt-4">
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Bank Name</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.bank_name === '' ? 'N/A' : datas.bank.bank_name}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">IFSC</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.ifsc_code === '' ? 'N/A' : datas.bank.ifsc_code}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Account Number</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.account_no === '' ? 'N/A' : datas.bank.account_no}
                </p>
              </div>
              <div className="d-flex py_10">
                <p className="left_content_width fs-16 fw-400 black m-0">Name in Account</p>
                <p className="fs-16 fw-400 black m-0">
                  {datas.bank.account_holder_name === '' ? 'N/A' : datas.bank.account_holder_name}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <ToastContainer></ToastContainer>
      </div>
    );
  });
};

export default DeliverymanProfile;

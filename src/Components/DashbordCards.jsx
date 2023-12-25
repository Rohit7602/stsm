import React from 'react';
import Dots from '../Images/svgs/dots.svg';
import ApexBarChart from './bar';
import Donut from './donatchart';
import eyeIcon from "../Images/svgs/eye-icon.svg"
import printIcon from "../Images/svgs/print-icon.svg"

function DashbordCards() {
  return (
    <>
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        {/* Dashboard-panel  */}
        <div className="w-100 px-3 py-4">
          <div className="d-flex   justify-content-between">
            <div className="d-flex">
              <h1 className="fs-400   black fs-lg">Dashboard</h1>
            </div>
            <button className="export_btn  white fs-xxs px-3 py-2 fw-400 border-0">Export</button>
          </div>
          <div className="  row justify-content-star  mt-3">
            <div className="    col-xl col-lg-4 col-md-6  mb-3 mr-3  ">
              <div className="   bg-white cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Total Sales</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">₹ 50680.00</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">15.3%</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="    col-xl col-lg-4 col-md-6 mb-3 mr-3  ">
              <div className=" bg-white   cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Average Order Value</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg">₹ 50680.00</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">15.3%</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="     col-xl col-lg-4 col-md-6 mb-3    ">
              <div className="  bg-white  cards  flex-column d-flex justify-content-around px-3">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 fade_grey fs-xs">Total Orders</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>

                <div className="d-flex justify-content-between   align-items-center bg_white">
                  <h3 className="fw-500 black mb-0 fs-lg"> 3368</h3>
                  <div className="d-flex flex-column   justify-content-between">
                    <h3 className="color_green fs-xxs mb-0 text-end">15.3%</h3>
                    <p className="text-end  para mb-0">Compared to Last Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart-section-bar  */}
        <div className="chat_wrapper px-3">
          <div className="row  justify-content-between ">
            <div className="col-xl-3 col-lg-5 mb-4 col-12 ">
              <div className="chart_content_wrapper p-2 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="fw-400 fade_grey mb-0 fs-xs"> Active Users</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>
                <div className="grey_box my-2 text-center w-100 p-2">
                  <h3 className="fw-500 black mb-0 fs-lg">56</h3>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 fade_grey mb-0 fs-xs"> City</h4>
                  <h4 className="fw-400 fade_grey mb-0 fs-xs"> Users</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Hisar</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 12</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Hansi</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 8</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Fatehabad</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 4</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Siwani</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 9</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Agroha</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 10</h4>
                </div>
                <div className="d-flex align-items-center py-1 bottom_border  justify-content-between">
                  <h4 className="fw-400 black mb-0 fs-xs"> Barwala</h4>
                  <h4 className="fw-400 black mb-0 fs-xs"> 18</h4>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-7 col-12 h-100 ">
              <div className="  h-100 chart_box px-2 py-3  chart_content_wrapper bg-white">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 black fs-xs">Income Statistics</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>
                <ApexBarChart className="w-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart-section-donat  */}
        <div className="chat_wrapper px-3  mt-4">
          <div className="row  justify-content-between ">
            <div className="col-xl-9 table_box col-lg-7 mb-xl-0 mb-4 col-12 ">
              <div className=" px-3 tables mb-2 chart_content_wrapper p-2 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="fw-600 black  mb-0 fs-xs">Recent Orders</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>
                <table className="w-100">
                  <tr className="product_borderbottom">
                    <th className="py-2 px-3 mw_50">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs"> No</h4>
                    </th>
                    <th className="py-2 px-3 mx_100">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs"> Status</h4>
                    </th>
                    <th className="py-2 px-3 mx_100">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs"> City</h4>
                    </th>
                    <th className="py-2 px-3 mw-250">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs">Customer</h4>
                    </th>
                    <th className="py-2 px-3 mx_160">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs"> Date</h4>
                    </th>
                    <th className="py-2 px-3 mx_100">
                      <h4 className="fw-400 fade_grey mb-0 fs-xs"> Total</h4>
                    </th>
                    <th className="mx_70">

                    </th>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                    <td className="d-flex align-items-center gap-3 py-1">
                      <img src={eyeIcon} alt="" />
                      <img src={printIcon} alt="" />
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                  <tr className="product_borderbottom">
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> #0012</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Status</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> Hisar</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0 fs-xs">John Doe</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> 18-10-2023</h4>
                    </td>
                    <td className="py-2 px-3">
                      <h4 className="fw-400 black mb-0  fs-xs"> ₹ 360.00</h4>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="col-xl-3 col-lg-5 col-12 h-100 ">
              <div className="  h-100 chart_box px-3 py-3  chart_content_wrapper bg-white">
                <div className="d-flex justify-content-between   bg-white">
                  <h3 className="fw-400 black fs-xs">Sales by source</h3>
                  <div>
                    <img src={Dots} alt="dots" />
                  </div>
                </div>
                <div className="text-center">
                  <Donut />
                </div>

                <div className="d-flex     align-items-center   p-2 bottom_border  justify-content-between">
                  <h4 className="fw-400 col fade_grey mb-0 fs-xs"> Source</h4>
                  <h4 className="fw-400 col text-center fade_grey mb-0 fs-xs">Orders</h4>
                  <h4 className="fw-400 col text-end fade_grey mb-0 fs-xs">Amount</h4>
                </div>
                <div className="d-flex      align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col black mb-0 fs-xs"> Direct</h4>
                  <h4 className="fw-400 col text-center black mb-0    fs-xs">110</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹45,368.00</h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs"> Salesman</h4>
                  <h4 className="fw-400 col text-center  black mb-0   fs-xs">36</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹13,810.00</h4>
                </div>
                <div className="d-flex     align-items-center p-2 bottom_border justify-content-between  ">
                  <h4 className="fw-400 col  black mb-0 fs-xs">Wholesalers</h4>
                  <h4 className="fw-400 col text-center black mb-0     fs-xs">43</h4>
                  <h4 className="fw-400 col text-end black mb-0 fs-xs">₹56,108.00</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashbordCards;

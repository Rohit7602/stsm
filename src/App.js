import './App.css';
import CategoriesView from './View/CategoriesView';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import DashbordCards from './Components/DashbordCards';
import ProductList from './Components/ProductList';
import NewCategory from './Components/NewCategory';
import AddProduct from './Components/AddProduct';
import Customers from './Components/Customers';
import OrdersList from './Components/OrdersList';
import ViewCustomerDetails from './Components/ViewCustomerDetails';
import BannersAdvertisement from './Components/BannersAdvertisement';
import Topbar from './Components/Topbar';
import Orderdetails from './Components/Orderdetails';
import ParentCategories from './Components/ParentCategories';
import Login from './Components/Login';
import { useState } from 'react';

function App() {
  const [orderStatus, setOrderStatus] = useState();
  return (
    // <Routes>
    //   <Route path="/" element={<Login />}></Route>
    // </Routes>
    <div className="d-flex">
      <Sidebar />
      <div className="content d-flex flex-column  position-relative">
        <Topbar />
        <div className="h-100 px-3 bg_light_grey">
          <Routes>
            <Route path="/" element={<DashbordCards />} />
            <Route path="/CategoriesView" element={<CategoriesView />} />
            <Route path="/newcategory" element={<NewCategory />} />
            <Route path="/newcategory/parentcategories" element={<ParentCategories />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/orderslist" element={<OrdersList />} />
            <Route path="/orderslist/orderdetails/:id" element={<Orderdetails />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/customer/viewcustomerdetails/:id" element={<ViewCustomerDetails />} />
            <Route path="/bannersadvertisement" element={<BannersAdvertisement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

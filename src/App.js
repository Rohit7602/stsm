import './App.css';
import CategoriesView from './Components/catalog/Categories';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Components/layout/Sidebar';
import DashbordCards from './Components/dashbord/DashbordCards';
import ProductList from './Components/catalog/ProductList';
import NewCategory from './Components/catalog/NewCategory';
import AddProduct from './Components/catalog/AddProduct';
import Customers from './Components/customers/Customers';
import OrdersList from './Components/orders/OrdersList';
import ViewCustomerDetails from './Components/customers/ViewCustomerDetails';
import BannersAdvertisement from './Components/marketing/BannersAdvertisement';
import Topbar from './Components/layout/Topbar';
import Orderdetails from './Components/orders/Orderdetails';
import ParentCategories from './Components/catalog/ParentCategories';
import ServiceAreas from './Components/catalog/SearviceAreas';
import Login from './Components/login/Login';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(true);
  function handelLogout() {
    setUser(true);
  }
  function handelLogin() {
    setUser(false);
  }
  return (
    <>
      {user ? <Login login={handelLogin} /> : null}
      <div className="d-flex">
        {!user ? <Sidebar logout={handelLogout} /> : null}
        <div className="content d-flex flex-column  position-relative">
          {!user ? <Topbar /> : null}
          <div className="h-100 px-3 bg_light_grey">
            <Routes>
              <Route path="dashbord" element={<DashbordCards />} />
              <Route path="catalog">
                <Route index element={<CategoriesView />} />
                <Route path="newcategory" element={<NewCategory />} />
                <Route path="parentcategories" element={<ParentCategories />} />
                <Route path="productlist" element={<ProductList />} />
                <Route path="addproduct" element={<AddProduct />} />
                <Route path="serviceareas" element={<ServiceAreas />} />
              </Route>
              <Route path="customer">
                <Route index element={<Customers />} />
                <Route path="viewcustomerdetails/:id" element={<ViewCustomerDetails />} />
              </Route>
              <Route path="orders">
                <Route index element={<OrdersList />} />
                <Route path="orderdetails/:id" element={<Orderdetails />} />
              </Route>
              <Route path="marketing">
                <Route path="bannersadvertisement" element={<BannersAdvertisement />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

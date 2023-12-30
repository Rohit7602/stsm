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
import AccountDelete from './Components/AccountDelete';
import { useEffect } from 'react';
import { auth } from './firebase'

import { useState } from 'react';

function App() {
  const [user, setUser] = useState(true);
  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase Authentication
      await auth.signOut();

      // Clear any user-related data from local storage or state
      // (e.g., clear isAdmin from localStorage)
      localStorage.removeItem('isAdmin');

      // Update the user state to trigger the rendering of the Login component
      setUser(true);
    } catch (error) {
      console.error('Error signing out:', error.message);
      // Handle logout error (e.g., display an error message)
    }
  };

  function handleLogin() {
    setUser(false);
  }
  useEffect(() => {
    // This effect will run after the user state is updated
    if (!user) {
      // Redirect or perform any actions after successful login
      console.log('User logged in');
    }
  }, [user]);
  return (
    <>
      {user ? <Login login={handleLogin} /> : null}
      {!user ? (
        <div className="d-flex">
          <Sidebar logout={handleLogout} />
          <div className="content d-flex flex-column  position-relative">
            <Topbar />
            <div className="h-100 px-3 bg_light_grey">
              <Routes>
                <Route path="dashbord" element={<DashbordCards />} />
                <Route path="deleteAcount" element={<AccountDelete />} />
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
      ) : null}
    </>
  );
}

export default App;

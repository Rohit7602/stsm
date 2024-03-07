import './App.css';
import CategoriesView from './Components/catalog/Categories';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { auth, messaging } from './firebase';
import HashLoader from 'react-spinners/HashLoader';
import CheckConnection from './Components/CheckConnection';

import { permissionHandler } from './firebase';
import DeliveryManList from './Components/deliveryman/DeliveryManList';
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';
import TermConditions from './Components/Security/TermConditions/TermConditions';
import AddDeliveryMan from './Components/deliveryman/AddDeliveryMan';
import Faqs from './Components/faqs/Faqs';


function App() {
  const [user, setUser] = useState(true);
  const [authchecked, setauthchecked] = useState(false);
  const [loading, setloading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    permissionHandler();
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 3000);
  }, []);

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
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(false);
      } else {
        // User is signed out
        setUser(true);
      }
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {loading ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HashLoader
            color={'#ffae00'}
            loading={loading}
            height={100}
            width={3}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          {location.pathname === '/deleteAcount' ? (
            <Routes>
              <Route path="/deleteAcount" element={<AccountDelete />} />
            </Routes>
          ) : (
            <>
              {user ? (
                <Login login={handleLogin} />
              ) : (
                <div className="d-flex">
                  <Sidebar logout={handleLogout} />
                  <div className="content d-flex flex-column  position-relative">
                    <Topbar />
                    <div className="h-100 px-3 bg_light_grey">
                      <Routes>
                        <Route path="" element={<DashbordCards />} />
                        <Route path="catalog">
                          <Route index element={<CategoriesView />} />
                          <Route path="newcategory" element={<NewCategory />} />
                          <Route path="parentcategories" element={<ParentCategories />} />
                          <Route path="productlist" element={<ProductList />} />
                          <Route path="/catalog/addproduct/:id?" element={<AddProduct />} />

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
                        <Route path="deliveryman">
                          <Route index element={<DeliveryManList />} />
                          <Route path="addnewdeliveryman" element={<AddDeliveryMan/>}/>
                        </Route>
                        <Route path="marketing">
                          <Route path="bannersadvertisement" element={<BannersAdvertisement />} />
                        </Route>
                        <Route path="privacypolicy" element={<PrivacyPolicy />} />
                        <Route path="term" element={<TermConditions />} />
                        <Route path='FAQ' element={<Faqs></Faqs>} />
                      </Routes>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <CheckConnection></CheckConnection>
    </div>
  );
}

export default App;

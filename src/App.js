import './App.css';
import CategoriesView from './View/CategoriesView';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import DashbordCards from './Components/DashbordCards';
import ProductList from './Components/ProductList';
import NewCategory from './Components/NewCategory';
import AddProduct from './Components/AddProduct';
import Customers from './Components/Customers';
import ViewCustomerDetails from './Components/ViewCustomerDetails';
import BannersAdvertisement from './Components/BannersAdvertisement';
import Topbar from './Components/Topbar';

function App() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content d-flex flex-column">
        <Topbar />
        <div className="h-100 px-3 bg_light_grey">
          <Routes>
            <Route path="/" element={<DashbordCards />} />
            <Route path="/CategoriesView" element={<CategoriesView />} />
            <Route path="/newcategory" element={<NewCategory />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/viewcustomerdetails/:id" element={<ViewCustomerDetails />} />
            <Route path="/bannersadvertisement" element={<BannersAdvertisement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

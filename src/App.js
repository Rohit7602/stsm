import "./App.css";
import CategoriesView from "./View/CategoriesView";
import Main from "./View/Main";
import ProductView from "./View/ProductView";
import CustomerView from "../src/View/CustomerView";
import NewProductView from "./View/NewProductView";
import NewCategoryView from "./View/NewCategoryView";
import CustomerDetailsView from "../src/View/CustomerDetailsView";
import { Route, Routes } from "react-router-dom";
import BannersAdvertisementView from "./View/BannersAdvertisementView";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/productview" element={<ProductView />} />
        <Route path="/CategoriesView" element={<CategoriesView />} />
        <Route path="/CustomerView" element={<CustomerView />} />
        <Route path="/NewProductView" element={<NewProductView />} />
        <Route path="/NewCategoryView" element={<NewCategoryView />} />
        <Route path="/CustomerDetailsView/:id" element={<CustomerDetailsView />} />
        <Route
          path="/BannersAdvertisementView"
          element={<BannersAdvertisementView />}
        />
      </Routes>
    </div>
  );
}

export default App;

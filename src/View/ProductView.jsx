import React, { useState } from "react";
import ProductList from "../Components/ProductList";
import Sidebar from "../Components/Sidebar";
const ProductView = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className=" d-flex w-100">
      {<Sidebar setOpen={setOpen} open={open} />}
      {<ProductList setOpen={setOpen} open={open} />}
    </div>
  );
};

export default ProductView;

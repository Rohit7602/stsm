import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import AddProduct from "../Components/AddProduct";
const NewProductView = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className=" d-flex w-100">
      {<Sidebar setOpen={setOpen} open={open} />}
      {<AddProduct setOpen={setOpen} open={open} />}
    </div>
  );
};

export default NewProductView;

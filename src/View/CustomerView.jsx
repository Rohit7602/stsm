import React, { useState } from "react";
import Customers from "../Components/Customers";
import Sidebar from "../Components/Sidebar";
const CustomerView = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className=" d-flex w-100">
      {<Sidebar setOpen={setOpen} open={open} />}
      {<Customers setOpen={setOpen} open={open} />}
    </div>
  );
};

export default CustomerView;

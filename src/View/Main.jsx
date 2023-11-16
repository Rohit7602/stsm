import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import DashbordCards from "../Components/DashbordCards";

function Main() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div>
        <>
          <div className=" d-flex h-100 w-100">
            {<Sidebar setOpen={setOpen} open={open} />}
            {<DashbordCards setOpen={setOpen} open={open} />}
          </div>
        </>
      </div>
    </>
  );
}

export default Main;

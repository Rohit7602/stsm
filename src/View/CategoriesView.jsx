import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Categories from "../Components/Categories";

const CategoriesView = () => {
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [showOne, setShowOne] = useState(false);
  const [showtwo, setShowtwo] = useState(false);
  const [showthree, setShowthree] = useState(false);
  const [showfor, setShowfor] = useState(false);
  const [showfive, setShowfive] = useState(false);
  return (
    <div className=" d-flex w-100">
      {<Sidebar setOpen={setOpen} open={open} />}
      {
        <Categories
          setOpen={(setOpen, setShow)}
          open={open}
          setShow={setShow}
          show={show}
          setShowOne={setShowOne}
          showOne={showOne}
          setShowtwo={setShowtwo}
          showtwo={showtwo}
          showthree={showthree}
          setShowthree={setShowthree}
          setShowfor={setShowfor}
          showfor={showfor}
          showfive={showfive}
          setShowfive={setShowfive}
        />
      }
    </div>
  );
};

export default CategoriesView;

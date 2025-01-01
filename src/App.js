import "./App.css";
import CategoriesView from "./Components/catalog/Categories";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Sidebar from "./Components/layout/Sidebar";
import DashbordCards from "./Components/dashbord/DashbordCards";
import ProductList from "./Components/catalog/ProductList";
import NewCategory from "./Components/catalog/NewCategory";
import AddProduct from "./Components/catalog/AddProduct";
import Customers from "./Components/customers/Customers";
import OrdersList from "./Components/orders/OrdersList";
import ViewCustomerDetails from "./Components/customers/ViewCustomerDetails";
import BannersAdvertisement from "./Components/marketing/BannersAdvertisement";
import Topbar from "./Components/layout/Topbar";
import Orderdetails from "./Components/orders/Orderdetails";
import ParentCategories from "./Components/catalog/ParentCategories";
import ServiceAreas from "./Components/catalog/SearviceAreas";
import Login from "./Components/login/Login";
import AccountDelete from "./Components/AccountDelete";
import { useEffect, useRef, useState } from "react";
import { auth, messaging, onMessageListener } from "./firebase";
import HashLoader from "react-spinners/HashLoader";
import CheckConnection from "./Components/CheckConnection";
import Brands from "./Components/brands/Brands";
import Invoices from "./Components/invoices/Invoices";
import { permissionHandler } from "./firebase";
import DeliveryManList from "./Components/deliveryman/DeliveryManList";
import { ToastContainer, toast } from "react-toastify";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import TermConditions from "./Components/Security/TermConditions/TermConditions";
import AddDeliveryMan from "./Components/deliveryman/AddDeliveryMan";
import Faqs from "./Components/faqs/Faqs";
import Logout from "./Components/login/Logout";
import DeliverymanProfile from "./Components/deliveryman/DeliverymanProfile";
import DeliveryOrderList from "./Components/deliveryman/DeliveryOrderList";
import DeliveryBoyInventory from "./Components/deliveryman/DeliveryBoyInventory";
import { useUserAuth } from "./context/Authcontext";
import Coupons from "./Components/marketing/Coupons";
import InvoiceBill from "./Components/invoices/InvoiceBill";
import Chats from "./Components/communications/Chats";
import Complains from "./Components/communications/Complains";
import ComplainDetails from "./Components/communications/ComplainDetails";
import { firebase, db } from "./firebase";
import Notification from "./Components/layout/Notification";
import { getDocs, collection, query } from "firebase/firestore";
import { CrossIcons } from "./Common/Icon";
import { useNotification } from "./context/NotificationContext";
import DeliveryList from "./Components/deliveryman/DeliveryList";
import Offers from "./Components/marketing/Offers";
import DeliveryBoyInventory2 from "./Components/deliveryman/DeliveryBoyInventory2";
import VanHistoryLogs from "./Components/deliveryman/VanHistoryLogs";

function App() {
  const { logoutUser } = useUserAuth();
  const [user, setUser] = useState(null);
  const [distributor, setDistributor] = useState(null);
  const [loading, setloading] = useState(true);
  const location = useLocation();
  const [deletPopup, setDeletPopup] = useState(false);
  const { showpop, setShowpop } = useNotification();
  const navigate = useNavigate();
  const loction = useLocation();
  
  useEffect(() => {
    let distributorstatus = localStorage.getItem("distributor");
    if (distributorstatus === "true") {
      setDistributor(true);
      navigate("/deliveryman");
    } else {
      setDistributor(false);
    }
  }, [distributor && loction.pathname !== "deliveryman"]);

  useEffect(() => {
    let distributorstatus = localStorage.getItem("distributor");
    if (distributorstatus === "true") {
      setDistributor(true);
      navigate("/deliveryman");
    } else {
      setDistributor(false);
    }

    // console.log("helooooooooooooooooooooooooooooooooooo");
    
  }, [loction.pathname === "/"]);

  useEffect(() => {
    permissionHandler();
    onMessageListener();

    window.addEventListener("load", () => {
      setloading(false); 
    });

    return () => {
      window.removeEventListener("load", () => {
        setloading(false);
      });
    };
  }, []);

  useEffect(() => {
    const admain_id = async () => {
      try {
        const getadmainid = query(collection(db, "User"));
        const querySnapshot = await getDocs(getadmainid);
        querySnapshot.forEach((doc) => {
          const admainid = doc.id;
          if (admainid) {
            localStorage.setItem("isAdminId", admainid);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    admain_id();
  }, []);

  // Check if '/orders/orderdetails/' is one of the segments
  var pathSegments = location.pathname.split("/");
  // console.log(pathSegments[1]);

  // Check if '/orders/orderdetails/' is one of the segments
  if (
    pathSegments.includes("orders") &&
    pathSegments.includes("orderdetails")
  ) {
    document.body.classList.add("overflow_hidden");
  }

  if (location.pathname === "/invoices" || location.pathname === "/orders") {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
  const handleLogout = async () => {
    try {
      // Sign out the user from Firebase Authentication
      await logoutUser();
      // Update the user state to trigger the rendering of the Login component
      localStorage.removeItem("isAdmin", "true");
      localStorage.removeItem("distributor");
      setDistributor(null);
      setUser(true);
    } catch (error) {
      console.error("Error signing out:", error.message);
      // Handle logout error (e.g., display an error message)
    }
  };

  function handleLogin() {
    setUser(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(false);
      } else {
        setUser(true);
      }
      setloading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`${showpop ? " position-fixed w-100" : null} `}>
      <Logout
        logout={handleLogout}
        setDeletPopup={setDeletPopup}
        deletPopup={deletPopup}
      />
      {loading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HashLoader
            color={"#ffae00"}
            loading={loading}
            height={100}
            width={3}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          {location.pathname === "/deleteAcount" ? (
            <Routes>
              <Route path="/deleteAcount" element={<AccountDelete />} />
            </Routes>
          ) : (
            <>
              {!user ? (
                <div className="d-flex">
                  <Sidebar setDeletPopup={setDeletPopup} />
                  <div className="content d-flex flex-column  position-relative">
                    <Topbar />
                    <Notification />
                    {!distributor ? (
                      <div className="h-100 px-3 bg_light_grey">
                        <Routes>
                          <Route path="" element={<DashbordCards />} />
                          <Route path="catalog">
                            <Route index element={<CategoriesView />} />
                            <Route
                              path="newcategory"
                              element={<NewCategory />}
                            />
                            <Route
                              path="parentcategories"
                              element={<ParentCategories />}
                            />
                            <Route
                              path="productlist"
                              element={<ProductList />}
                            />
                            <Route
                              path="/catalog/addproduct/:id?"
                              element={<AddProduct />}
                            />

                            <Route
                              path="serviceareas"
                              element={<ServiceAreas />}
                            />
                          </Route>
                          <Route path="customer">
                            <Route index element={<Customers />} />
                            <Route
                              path="viewcustomerdetails/:id"
                              element={<ViewCustomerDetails />}
                            />
                          </Route>
                          <Route path="orders">
                            <Route index element={<OrdersList />} />
                            <Route
                              path="orderdetails/:id"
                              element={<Orderdetails />}
                            />
                          </Route>
                          <Route path="deliveryman">
                            <Route index element={<DeliveryManList />} />
                            <Route
                              path="deliverylist"
                              element={<DeliveryList />}
                            />
                            <Route
                              path="viewhistory"
                              element={<VanHistoryLogs />}
                            />
                            <Route
                              path="addnewdeliveryman/:id?"
                              element={<AddDeliveryMan />}
                            />
                            <Route
                              path="deliverymanprofile/:id"
                              element={<DeliverymanProfile />}
                            />
                            <Route
                              path="inventory/:id"
                              element={<DeliveryBoyInventory2 />}
                            />
                          </Route>

                          <Route path="marketing">
                            <Route
                              path="bannersadvertisement"
                              element={<BannersAdvertisement />}
                            />
                            <Route path="coupans" element={<Coupons />} />
                            <Route path="Offers" element={<Offers />} />
                          </Route>
                          <Route path="communications">
                            <Route path="chats" element={<Chats />} />
                            <Route path="complains" element={<Complains />} />
                            <Route
                              path="complaindetails/:complainId"
                              element={<ComplainDetails />}
                            />
                          </Route>
                          <Route
                            path="privacypolicy"
                            element={<PrivacyPolicy />}
                          />
                          <Route path="setting">
                            <Route path="brands" element={<Brands />} />
                            {/* <Route path="products" element={< />} /> */}
                          </Route>
                          <Route path="term" element={<TermConditions />} />
                          <Route path="FAQ" element={<Faqs />} />
                          <Route path="invoices" element={<Invoices />} />
                          <Route
                            path="invoicesbill"
                            element={<InvoiceBill />}
                          />
                        </Routes>
                      </div>
                    ) : (
                      <div className="h-100 px-3 bg_light_grey">
                        <Routes>
                          <Route path="orders">
                            <Route
                              index
                              element={<OrdersList distributor={distributor} />}
                            />
                            <Route
                              path="orderdetails/:id"
                              element={<Orderdetails />}
                            />
                          </Route>
                          <Route path="customer">
                            <Route index element={<Customers />} />
                            <Route
                              path="viewcustomerdetails/:id"
                              element={<ViewCustomerDetails />}
                            />
                          </Route>
                          <Route path="deliveryman">
                            <Route
                              path="deliverylist"
                              element={<DeliveryList />}
                            />
                            <Route
                              path="viewhistory"
                              element={<VanHistoryLogs />}
                            />
                            <Route index element={<DeliveryManList />} />
                            <Route
                              path="addnewdeliveryman/:id?"
                              element={<AddDeliveryMan />}
                            />
                            <Route
                              path="deliverymanprofile/:id"
                              element={<DeliverymanProfile />}
                            />
                            <Route
                              path="inventory/:id"
                              element={<DeliveryBoyInventory2 />}
                            />
                          </Route>
                        </Routes>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Login login={handleLogin} />
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

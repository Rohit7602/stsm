import React from "react";
import SearchIcon from "../../Images/svgs/search.svg";
import { useNotification } from "../../context/NotificationContext";
import { useLocation } from "react-router-dom";
import { CrossIcons } from "../../Common/Icon";
export default function Topbar({ setOpen, open }) {
  const {
    ToggleNotification,
    currentNotifications,
    CheckNotification,
    newnotifications,
  } = useNotification();

  const location = useLocation();
  // console.log();

  return (
    <nav className="top_bar  bg-white py-2 position-sticky">
      <div className="d-flex align-items-center  justify-content-between px-3 bg-white py-2">
        <div className="d-flex align-items-center search_bar_wrapper">
          {location.pathname.slice(0, 23) == "/deliveryman/inventory/" ? (
            <div className=" ms-3">
              <button
                className=" border-0 bg-white"
                onClick={() => window.history.back()}
              >
                {" "}
                <CrossIcons />
              </button>
            </div>
          ) : (
            <svg
              onClick={() => setOpen(!open)}
              className="togle cursor   "
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.3999 9.59961C2.3999 9.28135 2.52633 8.97613 2.75137 8.75108C2.97642 8.52604 3.28164 8.39961 3.5999 8.39961H15.9695C16.2878 8.39961 16.593 8.52604 16.818 8.75108C17.0431 8.97613 17.1695 9.28135 17.1695 9.59961C17.1695 9.91787 17.0431 10.2231 16.818 10.4481C16.593 10.6732 16.2878 10.7996 15.9695 10.7996H3.5999C3.28164 10.7996 2.97642 10.6732 2.75137 10.4481C2.52633 10.2231 2.3999 9.91787 2.3999 9.59961ZM2.3999 4.79961C2.3999 4.48135 2.52633 4.17612 2.75137 3.95108C2.97642 3.72604 3.28164 3.59961 3.5999 3.59961H20.3999C20.7182 3.59961 21.0234 3.72604 21.2484 3.95108C21.4735 4.17612 21.5999 4.48135 21.5999 4.79961C21.5999 5.11787 21.4735 5.42309 21.2484 5.64814C21.0234 5.87318 20.7182 5.99961 20.3999 5.99961H3.5999C3.28164 5.99961 2.97642 5.87318 2.75137 5.64814C2.52633 5.42309 2.3999 5.11787 2.3999 4.79961ZM2.3999 14.3996C2.3999 14.0814 2.52633 13.7761 2.75137 13.5511C2.97642 13.326 3.28164 13.1996 3.5999 13.1996H20.3999C20.7182 13.1996 21.0234 13.326 21.2484 13.5511C21.4735 13.7761 21.5999 14.0814 21.5999 14.3996C21.5999 14.7179 21.4735 15.0231 21.2484 15.2481C21.0234 15.4732 20.7182 15.5996 20.3999 15.5996H3.5999C3.28164 15.5996 2.97642 15.4732 2.75137 15.2481C2.52633 15.0231 2.3999 14.7179 2.3999 14.3996ZM2.3999 19.1996C2.3999 18.8814 2.52633 18.5761 2.75137 18.3511C2.97642 18.126 3.28164 17.9996 3.5999 17.9996H15.9695C16.2878 17.9996 16.593 18.126 16.818 18.3511C17.0431 18.5761 17.1695 18.8814 17.1695 19.1996C17.1695 19.5179 17.0431 19.8231 16.818 20.0481C16.593 20.2732 16.2878 20.3996 15.9695 20.3996H3.5999C3.28164 20.3996 2.97642 20.2732 2.75137 20.0481C2.52633 19.8231 2.3999 19.5179 2.3999 19.1996Z"
                fill="black"
              />
            </svg>
          )}
        </div>
        <div className=" pe-3">
          <abbr title="Notifications">
            <button
              className=" border-0 bg-white position-relative"
              onClick={() => (ToggleNotification(), CheckNotification())}
            >
              {newnotifications ? (
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {newnotifications >= 99
                    ? `${newnotifications}+`
                    : newnotifications}
                </span>
              ) : null}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 18H19V11.031C19 7.148 15.866 4 12 4C8.134 4 5 7.148 5 11.031V18ZM12 2C16.97 2 21 6.043 21 11.031V20H3V11.031C3 6.043 7.03 2 12 2ZM9.5 21H14.5C14.5 21.663 14.2366 22.2989 13.7678 22.7678C13.2989 23.2366 12.663 23.5 12 23.5C11.337 23.5 10.7011 23.2366 10.2322 22.7678C9.76339 22.2989 9.5 21.663 9.5 21Z"
                  fill="black"
                />
              </svg>
            </button>
          </abbr>
        </div>
      </div>
    </nav>
  );
}

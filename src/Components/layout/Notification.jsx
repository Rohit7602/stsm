import React from "react";
import { CrossIcons, NotificationIcon } from "../../Common/Icon";
import { useNotification } from "../../context/NotificationContext";
function Notification() {
  const { showNotification, ToggleNotification, currentNotifications } =
    useNotification();
  return (
    <div
      className={`position-fixed vh-100 transition_600ms bg-white  ${
        showNotification ? "end-0" : "right_n100"
      } top-0  notifications_pop_shadow`}
    >
      <div className="px_20">
        <div className=" d-flex align-items-center w-75  justify-content-between pe-4">
          <div>
            <button className=" border-0 bg-white" onClick={ToggleNotification}>
              <CrossIcons />
            </button>
          </div>
          <div>
            <h6 className=" text-black fs-2sm fw-medium mb-0">Notifications</h6>
          </div>
        </div>
        <div className="black_line my-3"></div>
      </div>
      <div className=" overflow-auto h-100 ps_20_pb_48px">
        <div className="gap-3 d-flex flex-column pe-3">
          {currentNotifications.map((value) => {
         const milliseconds = value.timestamp.seconds * 1000 + value.timestamp.nanoseconds / 1000000;
         const dateObject = new Date(milliseconds);
        //  const date = dateObject.toLocaleDateString(); 
         const time = dateObject.toLocaleTimeString();
        //  console.log("Date:", date);
        //  console.log("Time:", time);
            return (
              <div className="notifications_details p-3 rounded-4 overflow-auto">
                <div className=" d-flex gap-3">
                  <NotificationIcon />
                  <div className=" w-100">
                    <div className=" d-flex justify-content-between">
                      <h5 className=" mb-0 fw-normal text-black fs-sm">
                        {value.title}
                      </h5>
                      <p className=" mb-0 fs-xxs text-black opacity-75">
                        {time} ago
                      </p>
                    </div>
                    <h6 className=" mb-0 fw-normal text-black fs-xs mt-1">
                      {value.message}
                    </h6>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Notification;

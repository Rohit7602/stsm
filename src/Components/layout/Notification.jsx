import React, { useState } from "react";
import { CrossIcons, NotificationIcon } from "../../Common/Icon";
import { useNotification } from "../../context/NotificationContext";

function Notification() {
  const {
    showNotification,
    ToggleNotification,
    currentNotifications,
    Deletenotification,
  } = useNotification();
  const [showcheckbox, setShowcheckbox] = useState(false);
  const [showbtn, setShowbtn] = useState(false);
  const [showcheck, setShowCheck] = useState(false);
  const [storedata, setStoreData] = useState([]);

  function onHandleChange(e) {
    setStoreData((old) => {
      const newStoreData = old.includes(e)
        ? old.filter((item) => item.id !== e.id)
        : [...old, e];
      setShowbtn(newStoreData.length > 0);
      return newStoreData;
    });
  }

  function selectAll() {
    if (!showcheck) {
      setStoreData(currentNotifications);
      setShowbtn(showbtn);
    } else {
      setStoreData([]);
      setShowbtn(!showbtn);
    }
    setShowCheck(!showcheck);
  }


  function onhandelclose() {
    ToggleNotification();
    setStoreData([]);
    setShowcheckbox(false);
    setShowbtn(false)
  }

  console.log(storedata);

  return (
    <div
      className={`position-fixed vh-100 transition_600ms bg-white ${
        showNotification ? "end-0" : "right_n100"
      } top-0 notifications_pop_shadow`}
    >
      <div className="px_20">
        <div className="d-flex align-items-center justify-content-between">
          <button className="border-0 bg-white" onClick={onhandelclose}>
            <CrossIcons />
          </button>
          <h6 className="text-black fs-2sm fw-medium mb-0">Notifications</h6>
          <button
            onClick={() => setShowcheckbox(true)}
            className="btn bg-danger text-white btn-sm px-3"
          >
            Select
          </button>
        </div>
        <div className="black_line my-3"></div>
        {showbtn && (
          <div className="d-flex gap-3 my-2 ps-4">
            <button
              className={`btn ${
                !showcheck ? "bg-success" : " bg-secondary"
              }  text-white btn-sm px-3`}
              onClick={selectAll}
            >
              {!showcheck ? "Select" : "Unselect"} All
            </button>
            <button
              onClick={() => Deletenotification(storedata)}
              className="btn  bg-danger text-white btn-sm px-3"
            >
              Delete All
            </button>
          </div>
        )}
      </div>
      <div className="overflow-auto h-100 ps_20_pb_48px">
        <div className="gap-3 d-flex flex-column pe-3">
          {currentNotifications
            .sort(
              (a, b) =>
                new Date(b.timestamp.toDate()) - new Date(a.timestamp.toDate())
            )
            .map((value, index) => {
              const milliseconds =
                value.timestamp.seconds * 1000 +
                value.timestamp.nanoseconds / 1000000;
              const dateObject = new Date(milliseconds);
              const time = dateObject.toLocaleTimeString();
              return (
                <div key={index} className="d-flex gap-3">
                  {showcheckbox && (
                    <input
                      type="checkbox"
                      id={index}
                      checked={storedata.includes(value)}
                      onChange={() => onHandleChange(value)}
                    />
                  )}
                  <div
                    className={`notifications_details p-3 rounded-4 overflow-auto ${
                      value.read !== true
                        ? "bg_light_grey"
                        : "notifications_details"
                    }`}
                  >
                    <div className="d-flex gap-3">
                      <abbr title="Notifications">
                        {" "}
                        <NotificationIcon />
                      </abbr>
                      <div className="w-100">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-0 fw-normal text-black fs-sm">
                            {value.title}
                          </h5>
                          <p className="mb-0 fs-xxs text-black opacity-75">
                            {time} ago
                          </p>
                        </div>
                        <h6 className="mb-0 fw-normal text-black fs-xs mt-1">
                          {value.message}
                        </h6>
                      </div>
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

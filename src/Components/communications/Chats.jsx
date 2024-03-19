import React from "react";
import peopleIcon from "../../Images/svgs/people-icon.svg";
import chatBg from "../../Images/svgs/chatting.svg";
import peopleDp from "../../Images/Png/people-dp.png";

export default function Chats() {
  return (
    <div className="chat_container">
      <div className="row">
        <div className="col-6">
          <div className="d-flex align-items-center chat_input mt-2">
            <img src={peopleIcon} alt="peopleIcon" />
            <input
              className="fs-sm fw-400 black"
              type="text"
              placeholder="People, Groups and Messages"
            />
          </div>
          <div className="d-flex align-items-center chat_read_btn">
            <button className="fs-sm fw-400 black w-100">All</button>
            <button className="fs-sm fw-400 black w-100">Read</button>
            <button className="fs-sm fw-400 black w-100">Unread</button>
          </div>
        </div>
        <div className="col-6 bg-white">
          <div className="chat_height">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <img className="w-100" src={chatBg} alt="chatBg" />
              <p className="fs-lg fw-400 text-center mb-0">
                Click to select a Conversation or,
                <br />
                <span className="color_blue">Start a New Conversation</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

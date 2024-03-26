import React, { useState } from 'react';
import peopleIcon from '../../Images/svgs/people-icon.svg';
import chatBg from '../../Images/svgs/chatting.svg';
import peopleDp from '../../Images/Png/people-dp.png';

export default function Chats() {
  // const [customerChatList, setCustomerList] = useState([]);
  const customerChatList = [
    {
      id: 1,
      CustomerDp: peopleDp,
      customerName: 'Vikram Swami',
      time: 'Yesterday, 10 AM',
      shotMsg: 'I have got a date at a quater to eight; I’LL...',
      msgCount: 4,
    },
  ];
  return (
    <div className="chat_container">
      <div className="d-flex">
        <div className="w_500">
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
          <div className="mt_20 customer_list_chat">
            {customerChatList.map((item, index) => {
              return (
                <div className="d-flex align-content-center cursor_pointer">
                  <img className="chat_profile" src={item.CustomerDp} alt="peopleDp" />
                  <div className="w-100 ms-4 mt-2">
                    <div className="d-flex align-items-end justify-content-between">
                      <p className="fs-sm fw-500 black m-0">Sharuka Nijibum</p>
                      <p className="fs-xxs fw-400 black m-0">Yesterday, 10 AM</p>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-2">
                      <p className="fs-xs fw-400 black m-0">
                        I have got a date at a quater to eight; I’LL...
                      </p>
                      <p className="fs-sm fw-500 color_blue msg_count d-flex align-items-center justify-content-center m-0">
                        1
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="w-100 bg-white">
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
        </div> */}
      </div>
    </div>
  );
}

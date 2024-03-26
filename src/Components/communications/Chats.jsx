import React, { useState } from 'react';
import peopleIcon from '../../Images/svgs/people-icon.svg';
import chatBg from '../../Images/svgs/chatting.svg';
import attechFile from '../../Images/svgs/attech-file.svg';
import peopleDp from '../../Images/Png/people-dp.png';
import sendMsg from '../../Images/svgs/send-icon.svg';
import Reciver from './chat-bubble/reciver';
import Sender from './chat-bubble/sender';
export default function Chats() {
  // const [customerChatList, setCustomerList] = useState([]);
  const [activeChat, setActiveChat] = useState();

  const customerChatList = [
    {
      id: 1,
      CustomerDp: peopleDp,
      customerName: 'Vikram Swami',
      msgCount: 4,
      msg: [
        {
          massage: 'My Name is Vikram',
          sender: 'admin',
          read: true,
        },
        {
          massage: 'dnalkdmnaslkdnald',
          sender: 1,
          read: true,
        },
        {
          massage: 'I am fine, How are you',
          sender: 1,
          read: true,
        },
        {
          massage: 'how are you',
          sender: 'admin',
          read: true,
        },
      ],
    },
    {
      id: 2,
      CustomerDp: peopleDp,
      customerName: 'Rohit Verma',
      msgCount: 2,
      msg: [
        {
          massage: 'Hii',
          sender: 2,
          read: true,
        },
        {
          massage: 'Hello',
          sender: 'admnin',
          read: true,
        },
      ],
    },
  ];

  let currentChat = customerChatList.filter((item) => activeChat === item.id);
  console.log(currentChat);
  return (
    <div className="chat_container">
      <div className="d-flex">
        <div style={{ padding: '10px' }} className="w_500">
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
          <div className="mt_20 customer_list_chat d-flex flex-column row-gap-3">
            {customerChatList.map((item, index) => {
              return (
                <div
                  onClick={() => setActiveChat(item.id)}
                  className="d-flex align-content-center cursor_pointer"
                  key={index}>
                  <img className="chat_profile" src={item.CustomerDp} alt="peopleDp" />
                  <div className="w-100 ms-4 mt-2">
                    <div className="d-flex align-items-end justify-content-between">
                      <p className="fs-sm fw-500 black m-0">{item.customerName}</p>
                      <p className="fs-xxs fw-400 black m-0">Yesterday, 10 AM</p>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-2">
                      <p className="fs-xs fw-400 black m-0">{item.shotMsg}</p>
                      {item.msgCount !== 0 ? (
                        <p className="fs-sm fw-500 color_blue msg_count d-flex align-items-center justify-content-center m-0">
                          {item.msgCount}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 'calc(100% - 500px)', padding: '0 30px' }} className="bg-white">
          <div className="chat_height">
            {currentChat.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <img className="w-50" src={chatBg} alt="chatBg" />
                <p className="fs-lg fw-400 text-center mb-0">
                  Click to select a Conversation or,
                  <br />
                  <span className="color_blue">Start a New Conversation</span>
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-end h-100 w-100">
                {currentChat.length > 0 &&
                  currentChat[0].msg.map((msg, index) => {
                    console.log(msg);
                    if (msg.sender === 'admin') {
                      return (
                        <div className="d-flex justify-content-end mt-2">
                          <Sender msg={msg} />
                        </div>
                      );
                    } else {
                      return <Reciver msg={msg} />;
                    }
                  })}
                <div className="w-100 d-flex align-items-center gap-2 justify-content-between mt-4 pt-1">
                  <input
                    className="w-100 mb-2 msg_send_input fs-sm fw-400 black"
                    placeholder="Enter your message"
                    type="text"
                  />
                  <label htmlFor="chat">
                    <img className="cursor_pointer" src={attechFile} alt="attechFile" />
                  </label>
                  <input id="chat" type="file" hidden />
                  <img className="cursor_pointer" src={sendMsg} alt="sendMsg" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

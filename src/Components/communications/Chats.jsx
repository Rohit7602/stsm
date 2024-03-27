import React, { useState } from 'react';
import peopleIcon from '../../Images/svgs/people-icon.svg';
import chatBg from '../../Images/svgs/chatting.svg';
import attechFile from '../../Images/svgs/attech-file.svg';
import peopleDp from '../../Images/Png/people-dp.png';
import sendMsg from '../../Images/svgs/send-icon.svg';
import Reciver from './chat-bubble/reciver';
import Sender from './chat-bubble/sender';
import manimage from '../../Images/Png/manimage.jpg';
import { useCustomerContext } from '../../context/Customergetters';
import { useChat } from '../../context/ChatRoom';
import { getDatabase, ref, update, push, set } from 'firebase/database';
import { app } from '../../firebase';
import { useUserAuth } from '../../context/Authcontext';

export default function Chats() {
  const database = getDatabase(app);
  // const [customerChatList, setCustomerList] = useState([]);
  const { customer } = useCustomerContext();
  const { chatrooms } = useChat();
  const { userData } = useUserAuth();
  const [messageText, setMessageText] = useState('');
  const [selectedChatRoomId, setSelectedChatRoomID] = useState('');
  // console.log("asdfasdf", customer)

  // console.log(chatrooms)

  const getCustomerData = (customerId) => {
    return customer.find((customer) => customer.id === customerId);
  };

  const [currentChat, setCurrentChat] = useState([]);

  const selectChat = (chatroomId) => {
    setSelectedChatRoomID(chatroomId);
    const chatroom = chatrooms[chatroomId];
    if (chatroom) {
      const messages = Object.entries(chatroom.Chats).map(([key, value]) => ({
        ...value,
        id: key,
        chatroomid: chatroomId, // Assuming the message ID is the key in the Firebase database
      }));

      console.log('message is', messages);

      const updates = {};
      messages.forEach((message) => {
        if (message.senderId === chatroomId.split('_')[0] && !message.seen) {
          updates[`/Chatrooms/${chatroomId}/Chats/${message.id}/seen`] = true;
        }
      });

      // Update the Firebase database
      update(ref(database), updates);

      setCurrentChat(messages);
    } else {
      setCurrentChat([]);
    }
  };

  const sendMessage = (chatroomId) => {
    // Assuming you have a way to get the current user's ID
    const senderId = userData.uuid;

    // Create a new message object
    const newMessage = {
      message: messageText,
      createdAt: new Date().toISOString(),
      messageType: 'TEXT',
      seen: false,
      senderId,
    };

    // Add the new message to the chatroom
    const chatRef = ref(database, `Chatrooms/${chatroomId}/Chats`);
    const newMessageRef = push(chatRef);
    set(newMessageRef, newMessage);

    // Clear the message input
    setMessageText('');
    setCurrentChat((prevChat) => [...prevChat, newMessage]);
  };

  // const customerChatList = [
  //   {
  //     id: 1,
  //     CustomerDp: peopleDp,
  //     customerName: 'Vikram Swami',
  //     msgCount: 4,
  //     msg: [
  //       {
  //         massage: 'My Name is Vikram',
  //         sender: 'admin',
  //         read: true,
  //       },
  //       {
  //         massage: 'dnalkdmnaslkdnald',
  //         sender: 1,
  //         read: true,
  //       },
  //       {
  //         massage: 'I am fine, How are you',
  //         sender: 1,
  //         read: true,
  //       },
  //       {
  //         massage: 'how are you',
  //         sender: 'admin',
  //         read: true,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     CustomerDp: peopleDp,
  //     customerName: 'Rohit Verma',
  //     msgCount: 2,
  //     msg: [
  //       {
  //         massage: 'Hii',
  //         sender: 2,
  //         read: true,
  //       },
  //       {
  //         massage: 'Hello',
  //         sender: 'admnin',
  //         read: true,
  //       },
  //     ],
  //   },
  // ];

  // let currentChat = customerChatList.filter((item) => activeChat === item.id);

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
            {Object.keys(chatrooms).map((chatroomId, index) => {
              let costumerid = chatroomId.split('_')[0];
              const customer = getCustomerData(costumerid);
              const lastMessageKey = Object.keys(chatrooms[chatroomId].Chats).pop();
              const lastMessage = chatrooms[chatroomId].Chats[lastMessageKey];
              // Count messages where seen is not true
              const unseenMessageCount = Object.values(chatrooms[chatroomId].Chats).reduce(
                (count, message) => {
                  if (!message.seen && message.senderId === costumerid) {
                    return count + 1;
                  }
                  return count;
                },
                0
              );

              return (
                <div
                  onClick={() => selectChat(chatroomId)}
                  className="d-flex align-content-center cursor_pointer"
                  key={index}>
                  <img
                    className="chat_profile"
                    src={customer ? customer.image : manimage}
                    alt="peopleDp"
                  />
                  <div style={{ width: 'calc(100% - 85px)' }} className="ms-4 mt-2">
                    <div className="d-flex align-items-end justify-content-between">
                      <p className="fs-sm fw-500 black m-0">{customer ? customer.name : 'N/A'}</p>
                      <p className="fs-xxs fw-400 black m-0">
                        {lastMessage ? new Date(lastMessage.createdAt).toLocaleString() : ''}
                      </p>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-2">
                      <p className="fs-xs fw-400 black m-0">
                        {lastMessage ? lastMessage.message : 'No Message Yet.'}
                      </p>
                      {unseenMessageCount > 0 && (
                        <p className="fs-sm fw-500 color_blue msg_count d-flex align-items-center justify-content-center m-0">
                          {unseenMessageCount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 'calc(100% - 500px)' }} className="bg-white">
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
                <div className='all_bubble' style={{ padding: '0 30px', overflowY: 'scroll'}}>
                  {currentChat.length > 0 &&
                    currentChat.map((msg, index) => {
                      if (msg.senderId === userData.uuid) {
                        return (
                          <div key={msg.senderId} className="d-flex justify-content-end mt-2">
                            <Sender msg={msg.message} date={msg.createdAt} />
                          </div>
                        );
                      } else {
                        return <Reciver msg={msg.message} date={msg.createdAt} />;
                      }
                    })}
                </div>
                <div className="w-100 d-flex align-items-center gap-2 justify-content-between mt-4 pt-1">
                  <input
                    className="w-100 mb-2 msg_send_input fs-sm fw-400 black"
                    placeholder="Enter your message"
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <label htmlFor="chat">
                    <img className="cursor_pointer" src={attechFile} alt="attechFile" />
                  </label>
                  <input id="chat" type="file" hidden />
                  <img
                    className="cursor_pointer"
                    src={sendMsg}
                    onClick={() => sendMessage(selectedChatRoomId)}
                    alt="sendMsg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

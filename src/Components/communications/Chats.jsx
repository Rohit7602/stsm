import React, { useRef, useEffect, useState } from 'react';
import peopleIcon from '../../Images/svgs/people-icon.svg';
import chatBg from '../../Images/svgs/chatting.svg';
import attechFile from '../../Images/svgs/attech-file.svg';
import peopleDp from '../../Images/Png/people-dp.png';
import sendMsg from '../../Images/svgs/send-icon.svg';
import Reciver from './chat-bubble/reciver';
import Sender from './chat-bubble/sender';
import closeIcon from '../../Images/svgs/closeicon.svg';
import manimage from '../../Images/Png/manimage.jpg';
import { useCustomerContext } from '../../context/Customergetters';
import { useChat } from '../../context/ChatRoom';
import { getDatabase, ref, update, push, set } from 'firebase/database';
import { app } from '../../firebase';
import { useUserAuth } from '../../context/Authcontext';
import { storage } from '../../firebase';
import { getDownloadURL, uploadBytes } from 'firebase/storage';

export default function Chats() {
  const database = getDatabase(app);
  const { customer } = useCustomerContext();
  const { chatrooms } = useChat();
  const { userData } = useUserAuth();
  const [messageText, setMessageText] = useState('');
  const [selectedChatRoomId, setSelectedChatRoomID] = useState(null);
  const [filterMode, setFilterMode] = useState('All');
  const [activeChat, setActiveChat] = useState(null);
  const [seenChatrooms, setSeenChatrooms] = useState([]);
  const [chatImages, setChatImages] = useState([]);
  const [search, setSearch] = useState('');
  function handleChatImgUpload(e) {
    setChatImages([...chatImages, ...e.target.files]);
  }

  function handleChatImgDelete(index) {
    let updatedImges = [...chatImages];
    updatedImges.splice(index, 1);
    setChatImages(updatedImges);
  }
  const getCustomerData = (customerId) => {
    return customer.find((customer) => customer.id === customerId);
  };

  const [currentChat, setCurrentChat] = useState([]);

  useEffect(() => {
    if (selectedChatRoomId && chatrooms[selectedChatRoomId]) {
      const messages = Object.entries(chatrooms[selectedChatRoomId].Chats).map(([key, value]) => ({
        ...value,
        id: key,
        chatroomid: selectedChatRoomId,
      }));
      setCurrentChat(messages);
    } else {
      setCurrentChat([]);
    }
  }, [selectedChatRoomId, chatrooms]);

  useEffect(() => {
    markMessagesAsSeen(activeChat);
  }, [activeChat]);

  const markMessagesAsSeen = (chatroomId) => {
    if (chatroomId === activeChat) {
      const updates = {};
      const chatroom = chatrooms[chatroomId];
      if (chatroom) {
        Object.entries(chatroom.Chats).forEach(([key, value]) => {
          if (!value.seen && value.senderId !== userData.uuid) {
            updates[`/Chatrooms/${chatroomId}/Chats/${key}/seen`] = true;
          }
        });
        update(ref(database), updates);
      }
    }
  };

  const selectChat = (chatroomId) => {
    setSelectedChatRoomID(chatroomId);
    setActiveChat(chatroomId);
    // Remove the chatroom from seenChatrooms list when the chat is selected
    setSeenChatrooms(seenChatrooms.filter((roomId) => roomId !== chatroomId));
  };

  const sendMessage = async (chatroomId) => {
    const senderId = userData.uuid;
    const newMessage = {
      message: messageText,
      createdAt: new Date().toISOString(),
      messageType: 'TEXT',
      // chat_imges: images,
      seen: false,
      senderId,
    };

    const chatRef = ref(database, `Chatrooms/${chatroomId}/Chats`);
    const newMessageRef = push(chatRef);
    set(newMessageRef, newMessage);

    setMessageText('');
    setCurrentChat((prevChat) => [...prevChat, newMessage]);

    // const filename = Math.floor(Date.now() / 1000) + '-' + chatImages.name;
    // const storageRef = ref(storage, `/chat/${filename}`);
    // await uploadBytes(storageRef, chatImages);
    // var images = await getDownloadURL(storageRef);
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat, chatImages]);

  const handleFilterModeChange = (mode) => {
    setFilterMode(mode);
  };

  const filterChatrooms = () => {
    let filteredChatrooms = Object.keys(chatrooms);

    // Filter based on search query
    if (search.trim() !== '') {
      filteredChatrooms = filteredChatrooms.filter((chatroomId) => {
        const customer = getCustomerData(chatroomId.split('_')[0]);
        return customer && customer.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    // Apply filter based on mode
    if (filterMode === 'All') {
      return filteredChatrooms;
    } else if (filterMode === 'Read') {
      return filteredChatrooms.filter((chatroomId) => {
        const room = chatrooms[chatroomId];
        return room && room.Chats && Object.keys(room.Chats).length > 0 && isLastMessageSeen(room);
      });
    } else if (filterMode === 'Unread') {
      return filteredChatrooms.filter((chatroomId) => {
        const room = chatrooms[chatroomId];
        if (!room || !room.Chats) return false;
        const costumerid = chatroomId.split('_')[0];
        const unseenMessageCount = Object.values(room.Chats).reduce((count, message) => {
          if (!message.seen && message.senderId === costumerid && chatroomId !== activeChat) {
            return count + 1;
          }
          return count;
        }, 0);
        return unseenMessageCount > 0 && !seenChatrooms.includes(chatroomId);
      });
    }
  };


  // console.log(search);
  const isLastMessageSeen = (room) => {
    const lastMessageKey = Object.keys(room.Chats).pop();
    const lastMessage = room.Chats[lastMessageKey];
    return lastMessage && lastMessage.seen;
  };

  return (
    <div className="chat_container">
      <div className="d-flex">
        <div style={{ padding: '10px' }} className="w_500">
          <div className="d-flex align-items-center chat_input mt-2">
            <img src={peopleIcon} alt="peopleIcon" />
            <input
              className="fs-sm fw-400 black w-100"
              type="text"
              placeholder="People, Groups and Messages"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center chat_read_btn overflow-hidden">
            <button
              className={`fs-sm fw-400 black w-100 ${filterMode === 'All' ? 'active_chat_btn' : ''
                }`}
              onClick={() => handleFilterModeChange('All')}>
              All
            </button>
            <button
              className={`fs-sm fw-400 black w-100 ${filterMode === 'Read' ? 'active_chat_btn' : ''
                }`}
              onClick={() => handleFilterModeChange('Read')}>
              Read
            </button>
            <button
              className={`fs-sm fw-400 black w-100 ${filterMode === 'Unread' ? ' active_chat_btn' : ''
                }`}
              onClick={() => handleFilterModeChange('Unread')}>
              Unread
            </button>
          </div>
          <div className="mt_20 customer_list_chat d-flex flex-column row-gap-3">
            {filterChatrooms().map((chatroomId, index) => {
              let costumerid = chatroomId.split('_')[0];
              const customer = getCustomerData(costumerid);
              const room = chatrooms[chatroomId];
              if (!room || !room.Chats) return null;
              const lastMessageKey = Object.keys(room.Chats).pop();
              const lastMessage = room.Chats[lastMessageKey];
              const unseenMessageCount = Object.values(room.Chats).reduce((count, message) => {
                if (!message.seen && message.senderId === costumerid && chatroomId !== activeChat) {
                  return count + 1;
                }
                return count;
              }, 0);

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
                        {lastMessage
                          ? lastMessage.message.substring(0, 40) + '...'
                          : 'No Message Yet.'}
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
                <div
                  className="all_bubble"
                  style={{ padding: '0 30px', overflowY: 'scroll' }}
                  ref={chatContainerRef}>
                  {currentChat.length > 0 &&
                    currentChat.map((msg, index) => {
                      if (msg.senderId === userData.uuid) {
                        return (
                          <div key={msg.senderId} className="d-flex justify-content-end mt-2">
                            <Sender msg={msg.message} date={msg.createdAt} images={msg.image} />
                          </div>
                        );
                      } else {
                        return (
                          <div className="d-flex">
                            <Reciver msg={msg.message} date={msg.createdAt} images={msg.image} />
                          </div>
                        );
                      }
                    })}
                  <div className="d-flex gap-2 flex-wrap">
                    {chatImages.map((imgs, index) => {
                      return (
                        <div
                          key={index}
                          className="position-relative"
                          style={{ width: '100px', height: '100px' }}>
                          <img className="w-100 h-100" src={URL.createObjectURL(imgs)} alt="" />
                          <div
                            onClick={() => handleChatImgDelete(index)}
                            className="position-absolute top-0 end-0 z-1 cursor_pointer img_cut_icon">
                            <img src={closeIcon} alt="closeIcon" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  style={{ padding: '0 30px' }}
                  className="w-100 d-flex align-items-center gap-2 justify-content-between mt-3 pt-1 mb-2">
                  <input
                    className="w-100 msg_send_input fs-sm fw-400 black"
                    placeholder="Enter your message"
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <label htmlFor="chat">
                    <img className="cursor_pointer" src={attechFile} alt="attechFile" />
                  </label>
                  <input onChange={handleChatImgUpload} multiple id="chat" type="file" hidden />
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

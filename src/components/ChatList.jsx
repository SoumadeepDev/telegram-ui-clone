import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { AppContext } from "../context/Context";
import { IoReorderThree } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { format } from "date-fns";

const ChatList = ({ onSelectChat }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { chats, setChats, filteredChats, searchTerm, setSearchTerm } =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          "https://devapi.beyondchats.com/api/get_all_chats?page=1"
        );
        const chatsData = response.data.data.data;
        setChats(chatsData);

        // Fetch the last message for each chat
        const lastMessagesData = await Promise.all(
          chatsData.map(async (chat) => {
            const messagesResponse = await axios.get(
              `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chat.id}`
            );
            const messages = messagesResponse.data.data;
            const lastMessage = messages[messages.length - 1];
            return { chatId: chat.id, lastMessage };
          })
        );

        const lastMessagesMap = lastMessagesData.reduce(
          (acc, { chatId, lastMessage }) => {
            acc[chatId] = lastMessage;
            return acc;
          },
          {}
        );

        setLastMessages(lastMessagesMap);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchChats();
  }, [setChats]);

  if (loading)
    return (
      <div className="spinner loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    onSelectChat(chatId);
  };

  const truncateMessage = (message) => {
    if (!message) return "No messages yet";
    if (message.length <= 14) return message;
    return message.slice(0, 14) + "...";
  };

  return (
    <div className={`chat-list ${darkMode ? "dark" : ""}`}>
      <div className="chat-list-header">
        <IoReorderThree
          className="hamburger-icon"
          onClick={() => toggleDarkMode()}
        />
        <div className={`search-bar-container ${darkMode ? "dark" : ""}`}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-bar ${darkMode ? "dark" : ""}`}
          />
        </div>
      </div>
      {filteredChats.map((chat) => {
        const lastMessage = lastMessages[chat.id];
        return (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={`chat-item ${chat.id === activeChatId ? "active" : ""}`}
          >
            <div className="chat-item-avatar">
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
                alt="Avatar"
              />
            </div>
            <div className="chat-item-details">
              <div className="chat-item-name">
                {chat.creator.name || chat.creator.email}
              </div>
              <div className="message-time-container">
                <div
                  className={`chat-item-last-message ${darkMode ? "dark" : ""}`}
                >
                  {lastMessage
                    ? truncateMessage(lastMessage.message)
                    : "No messages yet"}
                </div>

                <div
                  className={`chat-item-timestamp ${darkMode ? "dark" : ""}`}
                >
                  {lastMessage
                    ? format(new Date(lastMessage.created_at), "p, MMM d")
                    : ""}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;

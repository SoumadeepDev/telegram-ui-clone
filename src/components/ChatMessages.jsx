import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaSearch,
  FaPhone,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaArrowLeft,
} from "react-icons/fa";
import { GrEmoji } from "react-icons/gr";
import EmojiPicker from "emoji-picker-react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

const ChatMessages = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const [sender, setSender] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`
        );
        setMessages(response.data.data); // Assuming `data` field contains the messages
        if (response.data.data.length > 0) {
          setSender(response.data.data[0].sender);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const onEmojiClick = (event, emojiObject) => {
    setInputText((prevInput) => prevInput + emojiObject.emoji);
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
    window.location.reload();
  };

  const renderMessages = () => {
    let lastDate = null;
    return messages.map((message) => {
      const messageDate = new Date(message.created_at);
      const showDaySeparator = !lastDate || !isSameDay(messageDate, lastDate);
      lastDate = messageDate;

      return (
        <React.Fragment key={message.id}>
          {showDaySeparator && (
            <div className="day-separator">
              <span>{format(messageDate, "MMMM d, yyyy")}</span>
            </div>
          )}
          <div
            className={`message ${
              message.sender.id === sender.id ? "left" : "right"
            } ${darkMode ? "dark" : ""}`}
          >
            <div className="message-sender">
              {message.sender.name ? message.sender.name : sender.email}
            </div>
            <div className="message-content">{message.message}</div>
            <div className="message-timestamp">
              {messageDate.toLocaleString()}
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`chat-messages-container ${darkMode ? "dark" : ""}`}>
      <div className="chat-navbar">
        <div className="sender-info">
          <FaArrowLeft className="back-icon" onClick={handleBackClick} />
          <img
            src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
            alt="Sender Avatar"
            className="sender-avatar"
          />
          <span className="sender-name">{sender.name || sender.email}</span>
        </div>
        <div className="navbar-icons">
          <FaSearch className="icon" />
          <FaPhone className="icon" />
          <FaEllipsisV className="icon" />
        </div>
      </div>
      <div className="chat-messages">{renderMessages()}</div>
      <div className="chat-input-container">
        <GrEmoji
          className={`emoji icon ${darkMode ? "dark" : ""}`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && (
          <EmojiPicker onEmojiClick={onEmojiClick} className="emoji-board" />
        )}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={`chat-input ${darkMode ? "dark" : ""}`}
          placeholder="Type a message..."
        />
        <FaPaperclip className={`icon ${darkMode ? "dark" : ""}`} />
        <FaMicrophone className={`icon ${darkMode ? "dark" : ""}`} />
      </div>
    </div>
  );
};

export default ChatMessages;

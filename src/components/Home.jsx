// src/components/Home.js
import { useContext } from "react";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import { ThemeContext } from "../context/ThemeContext";
import { AppContext } from "../context/Context";

const Home = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { selectedChatId, handleSelectChat } = useContext(AppContext);
  return (
    <div className={`home ${darkMode ? "dark" : ""}`}>
      <ChatList onSelectChat={handleSelectChat} />
      {selectedChatId && <ChatMessages chatId={selectedChatId} />}
    </div>
  );
};

export default Home;

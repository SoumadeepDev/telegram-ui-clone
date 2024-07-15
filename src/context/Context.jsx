import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.creator.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        selectedChatId,
        setSelectedChatId,
        handleSelectChat,
        filteredChats,
        chats,
        setChats,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [currentServer, setCurrentServer] = useState("dms");
    const [currentChannel, setCurrentChannel] = useState(null);

    const changeServer = (serverId) => {
        setCurrentServer(serverId);
    };

    const changeChannel = (channelId) => {
        setCurrentChannel(channelId);
    };

    return (
        <ChatContext.Provider value={{ currentServer, currentChannel, changeServer, changeChannel }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}

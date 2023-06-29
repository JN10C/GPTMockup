import React from 'react';
import '../css/Sidebar.css';
import SidebarItem from './SidebarItem';

const Sidebar = ({ conversations, onNewChat, onConversationSelected, selectedConversation }) => {
  return (
    <div className="Sidebar">
      <button className="Sidebar-newChat" onClick={onNewChat}>
        New Chat
      </button>
      {conversations.map((conversation) => (
        <SidebarItem
          key={conversation.id}
          conversation={conversation}
          onConversationSelected={() => onConversationSelected(conversation)}
          isSelected={selectedConversation && selectedConversation.id === conversation.id}
        />
      ))}
    </div>
  );
}

export default Sidebar;
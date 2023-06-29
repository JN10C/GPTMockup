import React from 'react';
import '../css/SidebarItem.css';

const SidebarItem = ({ conversation, onConversationSelected, isSelected }) => {
  return (
    <div 
      className={`SidebarItem ${isSelected ? 'selected' : ''}`}
      onClick={onConversationSelected}
    >
      <div className="SidebarItem-title">
        {conversation.title}
      </div>
    </div>
  );
}

export default SidebarItem;
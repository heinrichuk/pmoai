
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatInterface from '@/components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <MainLayout title="AI Assistant" subtitle="Ask questions about your projects">
      <div className="h-[calc(100vh-12rem)]">
        <ChatInterface />
      </div>
    </MainLayout>
  );
};

export default ChatPage;

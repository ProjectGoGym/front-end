'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ChatList from './ChatList';
import Chat from './Chat';
import { useEffect } from 'react';
import useWebSocketStore from '@/store/useSocketStore';

interface ChatItem {
  chatRoomId: number;
  createdAt: string;
  postId: number;
  counterpartyId: number;
  counterpartyNickname: string;
  unreadMessageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

export default function ChatRoom() {
  const { connect, messages, sendMessage, disconnect } = useWebSocketStore();
  //채팅방 목록 가져오기
  const { data, isSuccess } = useQuery<ChatItem[]>({
    queryKey: ['chatList'],
    queryFn: async () =>
      (await axios.get('http://localhost:4000/chatList')).data,
    staleTime: 100000,
  });

  useEffect(() => {
    connect(process.env.NEXT_PUBLIC_BACKEND_URL + '/ws', '2', (message) => {
      console.log('New message:', message.body);
    });

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const sortedData =
    isSuccess && data?.length
      ? [...data].sort((a, b) => {
          const dateA = new Date(a.lastMessageAt).getTime();
          const dateB = new Date(b.lastMessageAt).getTime();
          return dateB - dateA;
        })
      : [];

  const handleSendMessage = ({
    chatRoomId,
    senderId,
    content,
  }: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) => {
    sendMessage(
      '/app/chatroom/message',
      JSON.stringify({
        chatRoomId,
        senderId,
        content,
      })
    );
  };

  return (
    <div className=" flex w-[75%] h-[100%] border-l border-gray-400">
      <div className=" flex flex-col w-[30%] h-[100%] border-r border-gray-400">
        {sortedData.map((list) => (
          <ChatList
            key={list.chatRoomId}
            counterpartyNickname={list.counterpartyNickname}
            lastMessage={list.lastMessage}
            lastMessageAt={list.lastMessageAt}
          />
        ))}
        <div></div>
      </div>
      <Chat onSendMessage={handleSendMessage} />
    </div>
  );
}

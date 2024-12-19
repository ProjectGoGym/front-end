"use client";

import { useQuery } from "@tanstack/react-query";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { useState } from "react";
import useWebSocketStore from "@/store/useSocketStore";
import axiosInstance from "@/api/axiosInstance";

interface ChatItem {
  chatRoomId: string;
  createdAt: string;
  postId: string;
  counterpartyId: string;
  counterpartyNickname: string;
  unreadMessageCount: string;
  lastMessage: string;
  lastMessageAt: string;
  postAuthorActive: boolean;
  requestorActive: boolean;
}

export default function ChatRoom() {
  const [modal, setModal] = useState(true);
  const [currentChatRoom, setCurrentChatRoom] = useState("");
  const [currentChatNickname, setCurrentChatNickname] = useState("");
  const { messages, sendMessage } = useWebSocketStore();
  //채팅방 목록 가져오기
  const { data: chatList, isSuccess: listSuccess } = useQuery<ChatItem[]>({
    queryKey: ["chatroom1", messages[messages.length - 1]],
    queryFn: async () => {
      const response: { content: ChatItem[] } = await axiosInstance.get(
        "/api/chatroom?page=0&size=5",
      );
      return response.content;
    },
    staleTime: 0,
    placeholderData: [],
  });

  const sortedData =
    listSuccess && chatList?.length
      ? [...chatList].sort((a, b) => {
          const dateA = new Date(a.lastMessageAt).getTime();
          const dateB = new Date(b.lastMessageAt).getTime();
          return dateB - dateA;
        })
      : [];

  const handleClickChatRoom = (chatRoomId: string, chatNickname: string) => {
    setCurrentChatRoom(chatRoomId);
    setCurrentChatNickname(chatNickname);
    console.log(currentChatRoom);
  };

  const handleSendMessage = ({
    chatRoomId,
    content,
  }: {
    chatRoomId: string;
    content: string;
  }) => {
    //송신 경로 등록
    sendMessage(
      "/app/chatroom/message",
      JSON.stringify({
        chatRoomId,
        content,
      }),
    );
    console.log(messages);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleOpenModal = () => {
    setModal(true);
  };

  return (
    <div className="border-l-1 relative flex h-[100%] w-[100%] md:w-[75%]">
      {/* <button onClick={() => axiosInstance.post("/api/chatroom/1")}>
        채팅방 생성
      </button> */}

      <div
        className={`flex h-[100%] w-[100%] ${modal ? "" : "hidden"} animate-slide-down flex-col border-2 sm:block sm:w-[50%]`}
      >
        <button
          onClick={handleCloseModal}
          className={`${modal ? "" : "hidden"} sm:hidden`}
        >
          닫기
        </button>
        {sortedData &&
          sortedData.map((list) => (
            <ChatList
              key={list.chatRoomId}
              chatRoomId={list.chatRoomId}
              counterpartyNickname={list.counterpartyNickname}
              lastMessage={list.lastMessage}
              lastMessageAt={list.lastMessageAt}
              onClickChatRoom={handleClickChatRoom}
              onCloseModal={handleCloseModal}
            />
          ))}
      </div>

      <div className={`h-full w-[100%] ${!modal ? "" : "hidden"} sm:block`}>
        <Chat
          counterpartyNickname={currentChatNickname}
          chatRoomId={currentChatRoom}
          onSendMessage={handleSendMessage}
          onOpenModal={handleOpenModal}
        />
      </div>
    </div>
  );
}

'use client';
import useSocketStore from '@/store/useSocketStore';
import Image from 'next/image';
import { useState } from 'react';
import profile from '@/public/default_profile.png';

interface props {
  onSendMessage: ({
    chatRoomId,
    senderId,
    content,
  }: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) => void;
}

export default function Chat({ onSendMessage }: props) {
  const [text, setText] = useState('');

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (text.trim().length === 0) {
      return;
    }
    onSendMessage({ chatRoomId: '1', senderId: '1', content: text });
    setText('');
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  let buttonStyle = text.trim().length ? 'bg-blue-300' : 'bg-gray-300';

  return (
    <form
      onSubmit={handleSubmitMessage}
      className=" relative flex flex-col w-[70%] h-[100%] bg-blue-100 bg-opacity-40"
    >
      <div className=" flex flex-col h-[calc(100%-10rem)] p-2 overflow-y-auto scrollbar-hide">
        <div className=" flex items-center gap-4">
          <Image
            src={profile}
            alt="profile"
            width={40}
            className="cursor-pointer"
            priority
          />
          <div className=" flex justify-center items-center p-2 rounded-xl bg-white">
            <p className=" text-base">{'안녕하세요'}</p>
          </div>
        </div>
        <div className=" flex items-center gap-4 ml-auto">
          <div className=" flex justify-center items-center p-2 rounded-xl bg-blue-200">
            <p className=" text-base">{'안녕하세요'}</p>
          </div>
          <Image
            src={profile}
            alt="profile"
            width={40}
            className="cursor-pointer"
            priority
          />
        </div>
      </div>
      <div className=" flex absolute bottom-0 left-0 w-full h-40 bg-white p-2">
        <textarea
          className=" flex-[4] focus:outline-none"
          placeholder="메세지를 입력해주세요"
          onChange={handleText}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className=" flex flex-[1] justify-center items-center">
          <button
            type="submit"
            className={` p-1 pl-6 pr-6 rounded-lg ${buttonStyle} text-xl text-white font-bold`}
            disabled={text.trim().length === 0}
          >
            전송
          </button>
        </div>
      </div>
    </form>
  );
}

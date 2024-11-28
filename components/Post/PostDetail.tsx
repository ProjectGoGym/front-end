'use client';
import { FaHeart } from 'react-icons/fa';
import { CgCloseO } from 'react-icons/cg';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import PostDetailImage from './PostDetailImage';
import { useState } from 'react';
import Image from 'next/image';

export default function PostDetail() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['postDetail'],
    queryFn: async () =>
      (await axios.get(`http://localhost:4000/postDetails/${id}`)).data,
    staleTime: 1000,
  });

  const handleImageClick = () => {
    setVisibleModal(!visibleModal);
  };

  let statusBox = '게시중';

  if (data && data.postStatus === 'PENDING') {
    statusBox = '게시중';
  } else if (data && data.postStatus === 'IN_PROGRESS') {
    statusBox = '거래 중';
  } else if (data && data.postStatus === 'COMPLETED') {
    statusBox = '거래 완료';
  }

  return (
    <>
      {data && (
        <div className=" flex flex-col w-[70%]">
          <div className=" mb-6 border-b border-gray-400">
            <div className=" mt-12 ml-2 mr-2 mb-2">
              <p className=" text-2xl font-bold">{data.title}</p>
              <div className=" flex w-fit mt-4 pl-2 pr-2 pt-1 pb-1 rounded-lg bg-[#5AC800] bg-opacity-60 ">
                <p className=" text-[11px] text-[#377008] font-bold">
                  {statusBox}
                </p>
              </div>
              <p className=" text-right text-sm text-gray-500 font-bold">
                작성일 : {data.createdAt}
              </p>
            </div>
          </div>
          <div className=" flex flex-col gap-4 p-4 pt-0 mb-4 border-b border-gray-400">
            <div className=" flex justify-between">
              <p className=" font-bold">
                <span className=" text-gray-500 ">게시글 종류 : </span>
                {data.postType === 'SELL' ? '팝니다' : '삽니다'}
              </p>
              <p className=" font-bold">
                <span className=" text-gray-500">작성자 : </span>
                <span className=" cursor-pointer hover:underline underline-offset-4">
                  {data.authorNickname}
                </span>
              </p>
            </div>
            <p className=" font-bold">
              <span className=" text-gray-500 ">헬스장 : </span>
              {data.gymName}
            </p>
            <div className=" flex justify-between">
              <p className=" font-bold">
                <span className=" text-gray-500 ">회원권 마감일 : </span>
                {data.expirationDate}
              </p>
              <p className=" font-bold">
                <span className=" text-gray-500">가격 : </span>
                {data.amount} {'원'}
              </p>
            </div>
          </div>
          <div className=" relative min-h-[360px] p-4 border-b border-gray-400">
            내용 {data.content}
            <div className=" flex items-center gap-1 absolute bottom-2 right-2 cursor-pointer">
              <span className=" text-gray-400 text-sm font-bold ">찜</span>
              <FaHeart color="#DC7D7D" size={24} />
            </div>
          </div>

          <div className=" relative flex p-4 min-h-20">
            <PostDetailImage
              imageUrl={data.imageUrl1}
              onClick={handleImageClick}
            />
            <button className=" absolute bottom-4 right-4 p-1 pl-2 pr-2 rounded-lg bg-blue-300 text-2xl text-white hover:bg-blue-500 transition-all">
              채팅하기
            </button>
          </div>
        </div>
      )}
      {data && visibleModal && (
        <div className=" flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-30">
          <div className=" flex justify-between items-center max-w-[1100px] w-[70%] animate-slide-down">
            <p className=" text-white text-xl font-bold">사진 크게보기</p>
            <CgCloseO
              size={48}
              color="#545454"
              className=" translate-x-12 cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
          <div className=" relative bg-white max-w-[1100px] w-[70%] h-[60%] rounded-lg overflow-hidden animate-slide-down">
            <Image src={data.imageUrl1} alt="이미지" layout="fill" />
          </div>
        </div>
      )}
    </>
  );
}

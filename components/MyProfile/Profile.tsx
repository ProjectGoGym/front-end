'use client';

import Image from 'next/image';
import profile from '../../public/default_profile.png';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import Link from 'next/link';

export default function ChangeProfile() {
  const {} = useQuery({
    queryKey: ['user'],
    queryFn: async () => await axiosInstance.get('/api/members/me'),
    staleTime: 100000,
  });

  return (
    <div className=" flex items-center mt-4 p-8 border-2 border-gray-400 rounded-md">
      <Image
        src={profile}
        alt="profile"
        width={120}
        height={120}
        className=" cursor-pointer"
        priority
      />
      <div className=" flex flex-col gap-2 ml-8">
        <p className=" font-bold text-sm text-gray-600">이름: 전민혁</p>
        <p className=" font-bold text-sm text-gray-600">닉네임: 헬린이</p>
        <p className=" font-bold text-sm text-gray-600">
          이메일: example@example.com
        </p>
        <div className=" flex items-center gap-4">
          <div className=" flex w-fit pl-2 pr-2 pt-1 pb-1 rounded-lg bg-[#5AC800] bg-opacity-60 ">
            <p className=" text-[11px] text-[#377008] font-bold">서울</p>
          </div>
        </div>
      </div>
      <Link href={'/mypage/changeProfile'} className=" ml-auto">
        <button className="  h-12 p-1 pl-6 pr-6 rounded-lg bg-blue-300 text-white hover:bg-blue-500 transition-all">
          프로필 수정
        </button>
      </Link>
    </div>
  );
}

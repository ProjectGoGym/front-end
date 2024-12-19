"use client";

import { CgCloseO } from "react-icons/cg";
import PostList from "./PostList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import profile from "../../public/default_profile.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PostUserDetail() {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["postDetailUser"],
    queryFn: async () =>
      (await axios.get("http://localhost:4000/userDetail/1")).data,
    staleTime: 100000,
  });
  const { data: post } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => (await axios.get("http://localhost:4000/posts")).data,
    staleTime: 100000,
  });

  if (isPending) {
    return <p>데이터 로딩중...</p>;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center bg-gray-600 bg-opacity-30">
      <div className="] flex w-[70%] max-w-[1100px] animate-slide-down items-center justify-end">
        <CgCloseO
          size={48}
          color="#545454"
          className="translate-x-12 cursor-pointer"
          onClick={handleBack}
        />
      </div>
      <div className="relative h-[60%] w-[70%] min-w-[900px] max-w-[1100px] animate-slide-down overflow-hidden overflow-y-auto rounded-lg bg-white">
        <div className="m-8 flex items-center gap-4">
          <Image
            src={profile}
            alt="profile"
            width={80}
            className="cursor-pointer"
            priority
          />
          <p className="text-2xl text-gray-600">
            {data.nickname}님의 다른 게시글
          </p>
          <button className="btn btn-active bg-red-500 hover:bg-red-700">
            신고
          </button>
        </div>
        <div className="m-4 overflow-x-auto">
          <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
            <PostList data={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

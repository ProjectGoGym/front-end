"use client";

import { useQuery } from "@tanstack/react-query";
import PostList from "./PostList";
import axiosInstance from "@/api/axiosInstance";
import useLoginStore from "@/store/useLoginStore";
import PostItemSkeleton from "../SkeletonUI/PostItemSkeleton";
import PostItem from "./PostItem";

export default function MainPagePostContainer() {
  const { loginState } = useLoginStore();
  const { data, error, isPending } = useQuery({
    queryKey: ["defaultPost", loginState],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `api/posts/views?page=0&size=10`,
        // "http://localhost:4000/posts",
      );
      return response.content;
    },
    staleTime: 0,
  });

  if (isPending) {
    return (
      <div className="mb-20 mt-8 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        {[...Array(6).keys()].map((idx) => (
          <PostItemSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // postId,
  // authorNickname,
  // createdAt,
  // gymName,
  // imageUrl1,
  // status,
  // title,
  // wishCount,

  if (error) {
    return (
      <div className="mb-20 mt-8 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        <PostItem
          postId="1"
          authorNickname="전빡빡"
          createdAt=""
          gymName="바디트랜스"
          imageUrl1="https://go-gym-bucket.s3.ap-northeast-2.amazonaws.com/posts/2024/12/18/4893bf95-c33d-47f6-ad0e-308bb3dfd61f-slider_두번째.jpg"
          status="PENDING"
          title="제목"
          wishCount={2}
        />
      </div>
    );
  }

  return (
    <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
      <PostList data={data} />
    </div>
  );
}

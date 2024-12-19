"use client";

import { useParams } from "next/navigation";
import PostList from "../Post/PostList";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/store/useUserStore";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import PostItemSkeleton from "../SkeletonUI/PostItemSkeleton";
import Pagenation from "../UI/Pagination";

export default function LookupPost() {
  const { category } = useParams();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useUserStore();

  // const url = `/api/members/${category}`;
  let content = "안녕";

  useEffect(() => {
    if (category === "my-posts") {
      setTitle("내가 작성한 게시글");
      // setUrl(`/api/members/me/posts`);
      setUrl("http://localhost:4000/posts");
    } else if (category === "wishlist") {
      setTitle("내가 찜한 게시글");
      setUrl("http://localhost:4000/posts");
      // setUrl(`/api/members/me/wishlist`);
    } else if (category === "recent-view") {
      setTitle("최근 본 게시글");
      setUrl("http://localhost:4000/posts");
      // setUrl(
      //   `/api/members/me/recent-views`,
      // );
    } else if (category === "purchaselist") {
      setTitle("구매 목록");
      setUrl("http://localhost:4000/posts");
    } else if (category === "salelist") {
      setTitle("판매 목록");
      setUrl("http://localhost:4000/posts");
    }
  }, [category]);

  useEffect(() => {
    setCurrentPage(0);
  }, [category]);

  const { data, isPending } = useQuery({
    queryKey: ["post", user, url],
    queryFn: async () => {
      const response: any = await axiosInstance.get(
        `${url}?page=${currentPage}&size=5`,
      );
      return response;
    },
    enabled: !!url,
  });

  if (isPending) {
    <div className="mt-8 flex flex-col gap-16">
      <h1 className="text-3xl">{content}</h1>
      <div className="mb-20 mt-8 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        {[...Array(6).keys()].map((idx) => (
          <PostItemSkeleton key={idx} />
        ))}
      </div>
    </div>;
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(+event.target.value); // 상태 업데이트

    console.log(currentPage);
  };

  return (
    <div className="mt-8 flex flex-col gap-16">
      <h1 className="text-3xl">{title}</h1>
      <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        <PostList data={data} />
      </div>
      <Pagenation
        size={5}
        page={currentPage}
        onRadioChange={handleRadioChange}
        totalPage={24}
      />
    </div>
  );
}

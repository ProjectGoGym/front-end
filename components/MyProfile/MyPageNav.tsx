"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPageNav() {
  const params = useParams();
  const [visible, setVisible] = useState({
    post: false,
    trans: false,
  });

  const handlePostVisible = () => {
    setVisible({
      ...visible,
      post: !visible.post,
    });
  };

  const handleTransVisible = () => {
    setVisible({
      ...visible,
      trans: !visible.trans,
    });
  };

  useEffect(() => {
    if (params.category === "recent-view" || "my-posts" || "wishlist") {
      setVisible({ ...visible, post: true });
    } else if (params.category === "purchaselist" || "salelist") {
      setVisible({ ...visible, trans: true });
    }

    console.log(params);
  }, [params.category]);

  return (
    <div className="mt-16 flex min-w-48 flex-col">
      <h2 className="border-b-2 border-b-gray-600 p-2 text-xl font-bold text-gray-600">
        마이페이지
      </h2>
      <div className="flex flex-col items-start gap-2 p-3">
        <Link href={"/mypage"}>
          <button
            className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
              !params.category ? "text-blue-500" : "text-gray-600"
            }`}
          >
            프로필
          </button>
        </Link>
        <button
          onClick={handlePostVisible}
          className="cursor-pointer text-sm font-bold text-gray-600 hover:text-blue-500"
        >
          게시글
        </button>
        {visible.post && (
          <div className="flex animate-slide-down flex-col items-start gap-2 p-2">
            <Link href={"/mypage/postLook/my-posts"}>
              <button
                className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                  params.category === "my-posts"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                작성한 게시글
              </button>
            </Link>
            <Link href={"/mypage/postLook/wishlist"}>
              <button
                className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                  params.category === "wishlist"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                찜한 게시글
              </button>
            </Link>
            <Link href={"/mypage/postLook/recent-view"}>
              <button
                className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                  params.category === "recent-view"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                최근 본 게시글
              </button>
            </Link>
          </div>
        )}
        <button
          onClick={handleTransVisible}
          className="cursor-pointer text-sm font-bold text-gray-600 hover:text-blue-500"
        >
          거래내역
        </button>
        {visible.trans && (
          <div className="flex animate-slide-down flex-col items-start gap-2 p-2">
            <Link href={"/mypage/postLook/purchaselist"}>
              <button
                className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                  params.category === "purchaselist"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                구매 목록
              </button>
            </Link>
            <Link href={"/mypage/postLook/salelist"}>
              <button
                className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                  params.category === "salelist"
                    ? "text-blue-500"
                    : "text-gray-600"
                }`}
              >
                판매 목록
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

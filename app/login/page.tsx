"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Input from "@/app/login/input";

const client_id = "your_kakao_client_id_here";
const redirect_uri = "http://localhost:3000/oauth";
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Kakao login redirect
  const handleLogin = () => (window.location.href = kakaoURL);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 w-full h-[40rem]">
      <div className="flex flex-col space-y-7 border-2 border-gray-50 p-6 bg-white">
        <h2 className="text-2xl font-semibold text-center">로그인</h2>

        <div onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
          >
            로그인
          </button>
        </div>

        <div className="flex justify-center">
          <Image
            src="/kakao_login.png"
            alt="카카오 로그인"
            width={200}
            height={50}
            onClick={handleLogin}
          />
        </div>

        <div>
          <Link href="/sign">
            <button>회원가입</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

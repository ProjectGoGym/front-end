"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BiSolidMessageRounded } from "react-icons/bi";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import form from "../../public/form.png";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";

interface User {
  email: string;
  password: string;
}

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

const LoginInput = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}: InputProps) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="mb-3 w-full rounded-md border border-gray-300 p-2"
    />
    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
  </div>
);

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const { InitUser } = useUserStore();
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  const { login } = useLoginStore();

  const handleLoginChange =
    (field: keyof typeof loginFormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setLoginFormData({ ...loginFormData, [field]: e.target.value });
    };

  const redirect_uri = "http://localhost:3000/auth";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_RESTAPI_KEY}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  const router = useRouter();
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validateForm = () => {
      let emailErr = "";
      let passwordErr = "";
      let valid = true;

      if (!loginFormData.email) {
        emailErr = "이메일을 @포함해서 입력해주세요.";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
        emailErr = "유효한 이메일 주소를 입력해주세요.";
        valid = false;
      }

      if (!loginFormData.password) {
        passwordErr = "비밀번호를 입력해주세요.";
        valid = false;
      }

      setLoginErrors({ email: emailErr, password: passwordErr });

      return valid;
    };

    if (validateForm()) {
      try {
        const response = await axios.post<User[]>("/backend/api/auth/sign-in", {
          email: loginFormData.email,
          password: loginFormData.password,
        });

        console.log(response);
        if (response) {
          const authHeader = response.headers["authorization"];
          if (authHeader) {
            const token = authHeader.split(" ")[1];
            console.log("JWT Token:", token);
            sessionStorage.setItem("token", token);

            //백엔드 연결시 axiosInstance로 교체
            const userData = async () => {
              const response: any = await axios.get(
                "http://localhost:4000/user",
              );
              InitUser(response.data);
            };

            userData();
            login(token);
            router.push("/");
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response || error.message);
        } else {
          console.error("Unknown error:", error);
        }
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="flex h-[30rem] w-[15rem] max-w-4xl shadow-lg">
        <Image
          src={form}
          alt="Login Image"
          width={600}
          height={400}
          className="h-full w-full rounded-l-xl object-cover"
        />
      </div>
      <div className="flex items-center justify-center rounded-r-xl border-b-2 border-r-2 border-t-2 border-gray-200">
        <form
          onSubmit={handleLoginSubmit}
          className="h-[30rem] w-[35rem] max-w-md p-8"
        >
          <h2 className="mt-4 text-center text-2xl font-semibold">로그인</h2>
          <div>
            <label>이메일</label>
            <LoginInput
              type="email"
              placeholder="example@gmail.com"
              value={loginFormData.email}
              onChange={handleLoginChange("email")}
              errorMessage={loginErrors.email}
            />
          </div>

          <div>
            <label>비밀번호</label>
            <LoginInput
              type={showPw ? "text" : "password"}
              placeholder="영문, 숫자, 특수문자 포함"
              value={loginFormData.password}
              onChange={handleLoginChange("password")}
              errorMessage={loginErrors.password}
            />
            <div className="mb-2 flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPw}
                onChange={() => setShowPw(!showPw)}
                className="h-4 w-4"
              />
              <label htmlFor="showPassword" className="ml-1 text-sm">
                비밀번호 표시
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-blue-500 py-2 text-white focus:outline-none"
          >
            로그인
          </button>

          <div
            onClick={handleKakaoLogin}
            className="mt-2 flex cursor-pointer items-center justify-center"
          >
            <div className="inline-flex w-full items-center justify-center rounded-md bg-yellow-300 py-2 shadow-sm">
              <BiSolidMessageRounded className="mr-2 h-[20px] w-[20px]" />
              <span className="text-center text-sm">카카오 로그인</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-3 w-full rounded-md border border-blue-500 py-1.5"
          >
            <Link href="/signup"> 회원가입</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

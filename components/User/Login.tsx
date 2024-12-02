"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BiSolidMessageRounded } from "react-icons/bi";

interface User {
  id?: string;
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
      className="w-full p-2 rounded-md border border-gray-300 mb-3"
    />
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

export default function LoginForm() {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange =
    (field: keyof typeof loginFormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setLoginFormData({ ...loginFormData, [field]: e.target.value });
    };

  const redirect_uri = "http://localhost:3000/auth";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_API_KEY}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.get<User[]>("http://localhost:4000/users");
        if (response.status === 200) {
          const user = response.data.find(
            (user) =>
              user.email === loginFormData.email &&
              user.password === loginFormData.password
          );

          if (user) {
            console.log("Login successful");
            localStorage.setItem("user", JSON.stringify(user));
            // 로그인 성공 후 메인화면(추후 변경)
            window.location.href = "/";
          } else {
            console.log("Login failed");
            alert("이메일 또는 비밀번호가 일치하지 않습니다.");
          }
        } else {
          console.log("Login request failed");
          alert("로그인 요청에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="w-full h-[25rem] max-w-md bg-white p-8 space-y-3"
    >
      <h2 className="text-2xl font-semibold text-center mt-2">로그인</h2>

      <LoginInput
        type="email"
        placeholder="이메일 : example@gmail.com"
        value={loginFormData.email}
        onChange={handleLoginChange("email")}
        errorMessage={loginErrors.email}
      />

      <LoginInput
        type="password"
        placeholder="비밀번호"
        value={loginFormData.password}
        onChange={handleLoginChange("password")}
        errorMessage={loginErrors.password}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
      >
        로그인
      </button>

      <div onClick={handleLogin} className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center bg-yellow-300 w-[150px] h-[40px] shadow-sm rounded-md mt-2">
          <BiSolidMessageRounded className="w-[20px] h-[20px] mr-2" />
          <span className="text-center text-sm">카카오 로그인</span>
        </div>
      </div>

      <div>
        <Link href="/signup">회원가입</Link>
      </div>
    </form>
  );
}

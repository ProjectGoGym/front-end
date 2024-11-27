"use client";

import React, { useState, ChangeEvent } from "react";
import Input from "@/app/signup/input";

const areas = [""];
const areas2 = [""];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    area: "none",
    area2: "none",
  });
  const [availability, setAvailability] = useState({
    email: null as boolean | null,
    nickname: null as boolean | null,
  });
  const [loading, setLoading] = useState({
    email: false,
    nickname: false,
  });

  const handleInputChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSelectChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLSelectElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const checkAvailability = async (
    type: "email" | "nickname",
    value: string
  ) => {
    if (loading[type]) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await fetch(
        `/api/duplicate${type === "nickname" ? "/nickname" : ""}?user${
          type === "nickname" ? "Nickname" : "Email"
        }=${value}`
      );
      const data = await response.json();
      setAvailability((prev) => ({
        ...prev,
        [type]: data.result === "true" ? false : true,
      }));
      alert(data.message);
    } catch (error) {
      console.error(`Error checking ${type}:`, error);
      alert(
        `${type === "nickname" ? "닉네임" : "이메일"}을 다시 입력해주세요.`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted values:", formData);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 w-full h-[40rem]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 space-y-3"
      >
        <h2 className="text-2xl font-semibold text-center">회원가입</h2>

        <div>
          <Input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <Input
              type="text"
              placeholder="이메일"
              value={formData.email}
              onChange={handleInputChange("email")}
            />
          </div>
          <button
            type="button"
            onClick={() => checkAvailability("email", formData.email)}
            disabled={loading.email}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading.email ? "확인 중" : "중복확인"}
          </button>
        </div>
        <div className="mt-2">
          {availability.email === false && <p>이미 사용중인 이메일입니다.</p>}
          {availability.email === true && <p>사용 가능한 이메일입니다.</p>}
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <Input
              type="text"
              placeholder="닉네임"
              value={formData.nickname}
              onChange={handleInputChange("nickname")}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => checkAvailability("nickname", formData.nickname)}
              disabled={loading.nickname}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {loading.nickname ? "확인 중" : "중복확인"}
            </button>
            {availability.nickname === false && (
              <p>이미 사용중인 닉네임입니다.</p>
            )}
            {availability.nickname === true && <p>사용 가능한 닉네임입니다.</p>}
          </div>
        </div>

        <div>
          <Input
            type="text"
            placeholder="핸드폰 번호"
            value={formData.phone}
            onChange={handleInputChange("phone")}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleInputChange("password")}
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-full">
            <select
              value={formData.area}
              onChange={handleSelectChange("area")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="none">관심지역</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <select
              value={formData.area2}
              onChange={handleSelectChange("area2")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mb-3"
            >
              <option value="none">관심지역2</option>
              {areas2.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}

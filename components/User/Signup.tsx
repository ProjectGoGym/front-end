"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";

interface Signup {
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

interface SignupErrors {
  [key: string]: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
  area: string;
  area2: string;
  profileImageUrl: string;
}

const SignupInput: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-md border border-gray-300"
    />

    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

// 관심지역
const areas = ["서울"];
const areas2 = ["부산"];

export default function SignupPage() {
  const [signupFormData, setsignupFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    area: "",
    area2: "",
    profileImageUrl: "",
    role: "",
  });

  const [loading, setLoading] = useState({
    email: false,
    nickname: false,
  });

  const [signupErrors, setsignupErrors] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    area: "",
    area2: "",
    profileImageUrl: "",
  });

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setsignupFormData({ ...signupFormData, [field]: e.target.value });
    };

  const validateForm = () => {
    let valid = true;
    const newErrors: SignupErrors = { ...signupErrors };

    const fields = [
      {
        name: "name",
        message: "이름을 입력하세요",
        condition: !signupFormData.name,
      },
      {
        name: "nickname",
        message: "닉네임을 입력해주세요.",
        condition: !signupFormData.nickname,
      },
      {
        name: "phone",
        message: "핸드폰 번호를 입력해주세요.",
        condition: !signupFormData.phone,
      },
    ];

    fields.forEach((field) => {
      newErrors[field.name] = field.condition ? field.message : "";
      valid = field.condition ? false : valid;
    });

    if (!signupFormData.email) {
      newErrors.email = "이메일을 입력해주세요.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!signupFormData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(signupFormData.password)
    ) {
      newErrors.password =
        "비밀번호는 특수문자, 소문자, 숫자를 포함해야 합니다.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setsignupErrors(newErrors);
    return valid;
  };

  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const checkAvailability = async (
    type: "email" | "nickname",
    value: string
  ) => {
    if (loading[type]) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    // 중복 확인
    try {
      const api =
        type === "email"
          ? "http://localhost:4000/users"
          : "http://localhost:4000/nicknames";
      const response = await axios.get(api, {
        params: { [type]: value },
      });

      const data = response.data;
      if (!data || !data.result) {
        alert(`${type === "nickname" ? "닉네임" : "이메일"} 사용 가능합니다.`);
        if (type === "email") {
          setIsEmailAvailable(true);
        } else {
          setIsNicknameAvailable(true);
        }
      } else {
        const isAvailable = data.result === "true";
        alert(
          `${type === "nickname" ? "닉네임" : "이메일"} ${
            isAvailable ? "사용 가능합니다." : "이미 존재합니다."
          }`
        );
        if (type === "email") {
          setIsEmailAvailable(isAvailable);
        } else {
          setIsNicknameAvailable(isAvailable);
        }
      }
    } catch (error) {
      console.error(`Error checking availability for ${type}:`, error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailAvailable || !isNicknameAvailable) {
      alert("중복 확인을 해주세요.");
      return;
    }

    if (validateForm()) {
      try {
        // 회원가입
        const response = await axios.get<Signup[]>(
          "http://localhost:4000/signups"
        );

        if (response.status === 200) {
          console.log(response.data);
          alert("회원가입이 완료되었습니다.");

          const emailResponse = await axios.get(
            `http://localhost:4000/emails`,
            { params: { email: signupFormData.email } }
          );

          if (emailResponse.status === 200) {
            alert("이메일 인증 링크가 전송되었습니다.");
          } else {
            throw new Error("이메일 인증 요청 실패");
          }
        } else {
          throw new Error("회원가입 실패");
        }
      } catch (error) {
        console.error("오류:", error);
        alert("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 border-r-gray-300 w-full h-[40rem]">
      <form
        onSubmit={handleSignupSubmit}
        className="w-full h-[35rem] max-w-md bg-white p-8 space-y-3 overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold text-center">회원가입</h2>

        <div>
          <SignupInput
            type="text"
            placeholder="프로필 이미지 URL"
            value={signupFormData.profileImageUrl}
            onChange={handleSignupChange("profileImageUrl")}
            errorMessage={signupErrors.profileImageUrl}
          />
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="이름"
            value={signupFormData.name}
            onChange={handleSignupChange("name")}
            errorMessage={signupErrors.name}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="이메일"
              value={signupFormData.email}
              onChange={handleSignupChange("email")}
              errorMessage={signupErrors.email}
            />
          </div>
          <button
            type="button"
            onClick={() => checkAvailability("email", signupFormData.email)}
            disabled={loading.email}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading.email ? "확인 중" : "중복확인"}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="닉네임"
              value={signupFormData.nickname}
              onChange={handleSignupChange("nickname")}
              errorMessage={signupErrors.nickname}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                checkAvailability("nickname", signupFormData.nickname)
              }
              disabled={loading.nickname}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {loading.nickname ? "확인 중" : "중복확인"}
            </button>
          </div>
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="핸드폰 번호"
            value={signupFormData.phone}
            onChange={handleSignupChange("phone")}
            errorMessage={signupErrors.phone}
          />
        </div>

        <div>
          <SignupInput
            type="password"
            placeholder="비밀번호"
            value={signupFormData.password}
            onChange={handleSignupChange("password")}
            errorMessage={signupErrors.password}
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-full">
            <select
              value={signupFormData.area}
              onChange={handleSignupChange("area")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="">관심지역</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {signupErrors.area && (
              <p className="text-red-500 text-sm">{signupErrors.area}</p>
            )}
          </div>

          <div className="w-full">
            <select
              value={signupFormData.area2}
              onChange={handleSignupChange("area2")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mb-3"
            >
              <option value="">관심지역2</option>
              {areas2.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {signupErrors.area2 && (
              <p className="text-red-500 text-sm">{signupErrors.area2}</p>
            )}
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

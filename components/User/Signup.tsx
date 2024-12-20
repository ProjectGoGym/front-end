"use client";

import { ChangeEvent, useState, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import Image from "next/image";
import form from "../../public/form.png";
import { useMutation } from "@tanstack/react-query";
import S3ImageUrl from "@/hooks/S3ImageUrl";

interface Signup {
  email: string;
  nickname: string;
  phone: string;
  password: string;
  regionId1: string | undefined;
  regionId2: string | undefined;
  profileImageUrl: string;
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
  regionId1: string;
  regionId2: string;
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
      className="w-full rounded-md border border-gray-300 p-2"
    />
    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
  </div>
);

// 관심지역
const regions: { id: string; name: string }[] = [
  { id: "1", name: "서울특별시" },
  { id: "2", name: "부산광역시" },
  { id: "3", name: "대구광역시" },
  { id: "4", name: "인천광역시" },
  { id: "5", name: "광주광역시" },
  { id: "6", name: "대전광역시" },
  { id: "7", name: "울산광역시" },
  { id: "8", name: "세종특별자치시" },
  { id: "9", name: "경기도" },
  { id: "10", name: "충청북도" },
  { id: "11", name: "경상북도" },
  { id: "12", name: "전라남도" },
  { id: "13", name: "경상남도" },
  { id: "14", name: "제주특별자치시" },
  { id: "15", name: "강원특별자치도" },
  { id: "16", name: "전북특별자치도" },
];

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const [subRegion1, setSubRegion1] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [subRegion2, setSubRegion2] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [selectSubRegion1, setSelectSubRegion1] = useState({
    regionId: "",
    name: "",
  });
  const [selectSubRegion2, setSelectSubRegion2] = useState({
    regionId: "",
    name: "",
  });

  // 표시 네임, 아이디를 선택
  const [signupFormData, setsignupFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    regionId1: "",
    regionId2: "",
    profileImageUrl: "",
  });

  const [signupErrors, setsignupErrors] = useState<SignupErrors>({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    regionId1: "",
    regionId2: "",
    profileImageUrl: "",
  });

  const [file, setFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setsignupFormData({ ...signupFormData, [field]: value });
    };

  // 폼 필수
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

    if (!signupFormData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(signupFormData.password)
    ) {
      newErrors.password = "비밀번호는 특수문자, 영어, 숫자를 포함해야 합니다.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setsignupErrors(newErrors);
    return valid;
  };

  // 이메일 입력
  const checkEmail = useMutation({
    mutationFn: async (email: string) => {
      if (!email) {
        throw new Error("이메일을 입력해주세요.");
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        throw new Error("이메일 주소에 '@'을 포함해주세요.");
      }

      // 이메일 중복확인
      const response = await axiosInstance.get<Signup[]>(
        "/api/auth/check-email",
        {
          params: { email },
        },
      );

      if (response.status === 200) {
        return true;
      } else {
        throw new Error("이메일 이미 존재합니다.");
      }
    },
    onSuccess: () => {
      setIsEmailAvailable(true);
      alert("이메일 사용 가능합니다.");
    },
    onError: (error) => {
      setIsEmailAvailable(false);
      alert(error.message);
    },
  });

  // 닉네임
  const checkNickname = useMutation<boolean, Error, string>({
    mutationFn: async (nickname: string) => {
      if (!nickname) {
        throw new Error("닉네임을 입력해주세요.");
      }

      // 닉네임 중복확인
      const response = await axiosInstance.get("/api/auth/check-nickname", {
        params: { nickname },
      });
      if (response.status === 200) {
        return true;
      } else {
        throw new Error("닉네임 이미 존재합니다.");
      }
    },
    onSuccess: () => {
      setIsNicknameAvailable(true);
      alert("닉네임 사용 가능합니다.");
    },
    onError: (error) => {
      setIsNicknameAvailable(false);
      alert(error.message);
    },
  });

  // 프로필 이미지
  const handleButtonClick = () => {
    fileInputRef.current?.click(); // useRef를 사용하여 파일 입력 요소 클릭
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImg = await S3ImageUrl(
        e.target.files[0].name,
        e.target.files[0],
        "members",
      );
      setFile(newImg.toString());
    }
  };

  // 회원가입
  const handleSignupSubmit = useMutation({
    mutationFn: async () => {
      if (!isEmailAvailable || !isNicknameAvailable) {
        throw new Error("중복확인을 해주세요.");
      }

      if (validateForm()) {
        setLoading(true);

        try {
          const response = await axiosInstance.post<Signup[]>(
            "/api/auth/sign-up",
            signupFormData,
          );

          if (response.status === 200) {
            const emailResponse = await axiosInstance.post(
              "/api/auth/send-verification-email",
              null,
              { params: { email: signupFormData.email } },
            );

            if (emailResponse.status === 200) {
              alert(
                "이메일 인증 링크가 전송되었습니다. 이메일을 통해 인증해주세요",
              );
              router.push("/login");
            } else {
              throw new Error("링크 전송 X");
            }
          } else {
            throw new Error("회원가입 실패");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("회원가입에 실패했습니다.");
        }
      }
    },
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      setLoading(false);
      console.error("Error:", error);
    },
  });

  // 관심지역 1
  const handleChangeSubRegionId1 = async (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectSubRegion1({ regionId: e.target.value, name: "" });
    setsignupFormData({ ...signupFormData, regionId1: e.target.value });
    console.log("id:" + selectSubRegion1.regionId);
  };

  const handleChangeRegionId1 = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId1 = e.target.value;
    setsignupFormData({ ...signupFormData, regionId1: selectedRegionId1 });

    if (selectedRegionId1) {
      try {
        const response = await axiosInstance.get<
          { regionId: string; name: string }[]
        >(`/api/regions?name=${selectedRegionId1}`);
        if (response) {
          const regionsData = response.data.map((data) => ({
            id: data.regionId,
            name: data.name,
          }));
          setSubRegion1(regionsData);
        }
      } catch (error) {
        console.error("API 호출에 실패했습니다.", error);
      }
    }
  };

  // 관심지역2
  const handleChangeSubRegionId2 = async (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectSubRegion2({ regionId: e.target.value, name: "" });
    setsignupFormData({ ...signupFormData, regionId2: e.target.value });
    console.log("id:" + selectSubRegion2.regionId);
  };

  const handleChangeRegionId2 = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId2 = e.target.value;
    setsignupFormData({ ...signupFormData, regionId2: selectedRegionId2 });

    if (selectedRegionId2) {
      try {
        const response = await axiosInstance.get<
          { regionId: string; name: string }[]
        >(`/api/regions?name=${selectedRegionId2}`);
        if (response) {
          const regionsData = response.data.map((data) => ({
            id: data.regionId,
            name: data.name,
          }));
          setSubRegion2(regionsData);
        }
      } catch (error) {
        console.error("API 호출에 실패했습니다.", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex max-w-4xl rounded-l-lg shadow-lg">
        <Image
          src={form}
          alt="Login Image"
          width={600}
          height={400}
          className="h-[40rem] w-[18rem] rounded-l-xl object-cover"
        />
      </div>
      <div className="flex items-center justify-center rounded-r-xl bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignupSubmit.mutate();
          }}
          className="h-[40rem] w-[40rem] max-w-md space-y-2 rounded-r-xl border-b-2 border-r-2 border-t-2 border-gray-200 p-8"
        >
          <h2 className="text-center text-2xl font-semibold">회원가입</h2>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
              <div className="text-3xl text-gray-700">Loading..</div>
            </div>
          )}
          {file ? (
            <>
              <div className="relative ml-auto mr-auto flex h-[80px] w-[80px] justify-center overflow-hidden rounded-[100%] border border-gray-300">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    다시 선택
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    id="file-input"
                    name="file-input"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="relative ml-auto mr-auto flex h-[110px] w-[110px] justify-center overflow-hidden rounded-[100%] border border-gray-300">
              <div className="h-21 flex w-60 items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  id="file-input"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="file-input"
                  className="flex cursor-pointer flex-col items-center justify-center text-gray-600"
                >
                  <span className="text-4xl text-green-500">+</span>
                  <span className="mt-2 text-sm font-semibold">
                    {"프로필 사진"}
                  </span>
                </label>
              </div>
            </div>
          )}

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
            <div className="flex-1">
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
              onClick={() => checkEmail.mutate(signupFormData.email)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
              disabled={isEmailAvailable}
            >
              {isEmailAvailable ? "사용 가능" : "중복확인"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <SignupInput
                type="text"
                placeholder="닉네임"
                value={signupFormData.nickname}
                onChange={handleSignupChange("nickname")}
                errorMessage={signupErrors.nickname}
              />
            </div>
            <button
              type="button"
              onClick={() => checkNickname.mutate(signupFormData.nickname)}
              className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
              disabled={isNicknameAvailable}
            >
              {isNicknameAvailable ? "사용 가능" : "중복확인"}
            </button>
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

          <div className="flex space-x-4 text-gray-400">
            <div className="flex-1">
              <select
                value={signupFormData.regionId1}
                onChange={handleChangeRegionId1}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {/* 아이디 값을 보냄 */}
                <option value="">지역 선택1</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <select
                value={selectSubRegion1.regionId}
                onChange={handleChangeSubRegionId1}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">세부 지역 선택1</option>
                {subRegion1?.map((subRegion) => (
                  <option key={subRegion.name} value={subRegion.id}>
                    {subRegion.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 text-gray-400">
            <div className="flex-1">
              <select
                value={signupFormData.regionId2}
                onChange={handleChangeRegionId2}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                {/* 아이디 값을 보냄 */}
                <option value="">지역 선택2</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <select
                value={selectSubRegion2.regionId}
                onChange={handleChangeSubRegionId2}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">세부 지역 선택2</option>
                {subRegion2?.map((subRegion) => (
                  <option key={subRegion.name} value={subRegion.id}>
                    {subRegion.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-500 py-2 text-white"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

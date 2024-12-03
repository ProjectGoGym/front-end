'use client';
import axiosInstance from '@/api/axiosInstance';
import Image from 'next/image';
import { useRef, useState } from 'react';

const SignupInput: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  disabled,
  onChange,
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border border-gray-300"
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

interface InputProps {
  type: string;
  name?: string;
  placeholder: string;
  disabled: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChangeProfile() {
  const [file, setFile] = useState<File>();
  const [values, setValues] = useState({
    nickname: '',
    phone: '',
    password: '',
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // useRef를 사용하여 파일 입력 요소 클릭
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 백엔드 연동시 파일자체 보내기
      setFile(e.target.files[0]);
    }
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: [e.target.value] });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string); // value는 string 타입으로 가정
    });

    // 파일 추가
    if (file) {
      formData.append('profileImageUrl', file); // 파일 추가
    }

    try {
      const response = await axiosInstance.put('/api/members/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 space-y-3 overflow-y-auto"
    >
      <h2 className="text-2xl font-semibold text-center">프로필 수정</h2>
      {file ? (
        <>
          <div className=" relative flex justify-center w-[240px] h-[240px] ml-auto mr-auto border border-gray-300 rounded-[100%] overflow-hidden">
            <Image
              src={URL.createObjectURL(file as File)}
              alt="헬스장 이미지"
              className="rounded-lg"
              layout="fill"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleButtonClick} // 클릭 핸들러 호출
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              다시 선택
            </button>

            <input
              type="file"
              accept="image/*"
              id="file-input"
              name="file-input"
              onChange={handleFileSelect}
              ref={fileInputRef} // ref 연결
              style={{ display: 'none' }} // 숨김
            />
          </div>
        </>
      ) : (
        <div className=" relative flex justify-center w-[240px] h-[240px] ml-auto mr-auto border border-gray-300 rounded-[100%] overflow-hidden">
          <div className="flex justify-center items-center w-60 h-56">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center cursor-pointer text-gray-600"
            >
              <span className="text-4xl text-green-500">+</span>
              <span className="mt-2 text-sm font-semibold">
                {'프로필 사진 선택하세요'}
              </span>
            </label>
          </div>
        </div>
      )}

      <div>
        <SignupInput type="text" placeholder="이름 고정" disabled={true} />
      </div>

      <div className="flex items-center space-x-2">
        <div>
          <SignupInput type="text" placeholder="이메일 고정" disabled={true} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div>
          <SignupInput
            type="text"
            placeholder="닉네임"
            disabled={false}
            name="nickname"
            onChange={handleChangeValue}
          />
        </div>
      </div>

      <div>
        <SignupInput
          type="text"
          placeholder="핸드폰 번호 ex)010-0000-0000"
          disabled={false}
          name="phone"
          onChange={handleChangeValue}
        />
      </div>

      <div>
        <SignupInput
          type="password"
          placeholder="비밀번호"
          disabled={false}
          name="password"
          onChange={handleChangeValue}
        />
      </div>

      <div className="flex space-x-4">
        <div className="w-full">
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
            <option value="">관심지역</option>
          </select>
        </div>

        <div className="w-full">
          <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mb-3">
            <option value="">관심지역2</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          수정하기
        </button>
      </div>
    </form>
  );
}

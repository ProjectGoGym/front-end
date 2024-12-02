'use client';

import { useState } from 'react';
import PortOne from '@portone/browser-sdk/v2';
import axiosInstance from '@/api/axiosInstance';

export default function ChargePay() {
  const [money, setMoney] = useState(0);

  const paymentId = `${crypto.randomUUID()}`;
  const data = {
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    paymentId,
    orderName: '짐페이 충전',
    totalAmount: money,
    currency: 'KRW',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNAL_KEY,
    payMethod: 'CARD',
    //customer는 동적으로 받을 예정
    customer: {
      fullName: '전민혁',
      phoneNumber: '010-7634-7212',
      email: 'mari394337@gmail.com',
    },
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    setMoney((prevMoney) => (prevMoney || 0) + +target.value);
  };

  const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoney(+e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (money < 1000) {
      alert('1000원 이상 입력해주세요');
      return;
    }

    async function requestPayment() {
      if (data) {
        const response = await PortOne.requestPayment(data);
        console.log(response);
      }
    }

    requestPayment();
  };

  return (
    <div className=" flex justify-center w-[75%]">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-12 mt-8 p-4 w-[480px] border-2 border-blue-300 rounded-lg"
      >
        <p className=" font-bold">Gym Pay 충전하기</p>
        <div className=" flex flex-col items-center">
          <input
            type="number"
            placeholder="충전할 금액을 입력해주세요"
            className=" p-2 w-96 border border-gray-300 focus:outline-none"
            onChange={handleChangeMoney}
            value={money}
          />
          <div className=" flex justify-between w-[75%] mt-8 mb-8">
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={1000}
            >
              +1000원
            </button>
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={5000}
            >
              +5000원
            </button>
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={10000}
            >
              +10000원
            </button>
          </div>
        </div>
        <button
          type="submit"
          className=" p-1 bg-blue-400 rounded-lg text-white text-sm font-bold hover:bg-blue-500 transition-all"
        >
          충전하기
        </button>
      </form>
    </div>
  );
}

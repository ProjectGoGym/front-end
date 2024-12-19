"use client";

import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function ChatPostDetail({
  onOpenModal,
}: {
  onOpenModal: () => void;
}) {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [amount, setAmount] = useState("");

  const { mutate: paystart } = useMutation({
    mutationKey: ["start"],
    mutationFn: async () =>
      await axiosInstance.post("/api/safe-payments/1", {
        responderId: "1",
        amount: 10000,
      }),
    onSuccess: () => alert("결제를 요청했습니다."),
  });

  const handleClick = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const realAmount = +amount.replace(/,/g, "");

    paystart();
    console.log(realAmount);
    setModal(false);
  };

  return (
    <div className="absolute left-0 right-0 top-0 z-30 flex min-h-32 flex-col gap-2 border-b-2 bg-white p-4 pb-1">
      <button className="btn w-[30%] sm:hidden" onClick={onOpenModal}>
        채팅방
      </button>
      <div className="flex gap-4">
        <select className="font-semibold focus:outline-none">
          <option>게시중</option>
          <option>구매완료</option>
          <option>판매완료</option>
        </select>
        <p className="text-sm font-bold text-gray-500">제목이요</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">10,000원</p>
        <div className="flex items-center gap-2">
          <AiOutlineExclamationCircle
            size={18}
            color="#999999"
            onMouseOver={() => setModal1(true)}
            onMouseOut={() => setModal1(false)}
          />
          {modal1 && (
            <div className="absolute translate-x-0 translate-y-10 rounded-xl bg-gray-100 p-2 text-xs font-bold text-gray-500 shadow-lg">
              <p>거래 일정을 등록하면 </p>
              <p>예상 출발시간에 채팅을 보내드려요!</p>
            </div>
          )}
          <button
            onClick={handleClick}
            className="btn btn-active border-blue-500 bg-white hover:bg-blue-500 hover:text-white"
          >
            거래 일정 잡기
          </button>
        </div>
      </div>
      {modal && (
        <div className="animate-slide-down">
          <form onSubmit={handleSubmit} className="mt-8 flex">
            <div className="flex flex-col gap-2">
              <label
                htmlFor={"expirationDate"}
                className="text-sm text-gray-500"
              >
                거래일정
              </label>
              <input
                type="date"
                className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
                name={"expirationDate"}
                id={"expirationDate"}
                // onChange={handleValues}
                // value={values.expirationDate}
                placeholder="ex) 2025/02/24"
              />
              <button className="btn" type="submit">
                요청
              </button>
            </div>
          </form>
          <div className="flex w-full justify-center">
            <button>
              <kbd
                onClick={handleClose}
                className="kbd border-none bg-white text-gray-500"
              >
                ▲
              </kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

'use client';
import Link from 'next/link';

export default function GympayBox() {
  return (
    <div className=" flex flex-col p-4 max-w-[660px] bg-blue-300 text-white rounded-md">
      <div className=" flex justify-between">
        <p>Gym Pay</p>
        <p>10,000원</p>
      </div>
      <Link href={'/mypage/addGymPay'} className=" ml-auto">
        <button>충전</button>
      </Link>
    </div>
  );
}

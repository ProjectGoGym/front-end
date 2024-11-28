
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubblesOutline } from 'react-icons/io5';
import profile from '../../public/default_profile.png';
import Link from 'next/link';


interface PostType {
  id: string;
  authorNickName: string;
  created_at: string;
  gymName: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostItem({
  id,
  authorNickName,
  created_at,
  gymName,
  imageUrl1,
  postStatus,
  title,
  wishCount,
}: PostType) {
  let postStatusKo = postStatus === "PENDING" && "판매중";

  return (
    <Link href={`/community/${id}`}>
      <div className=" w-80 h-48 rounded-lg border border-[#ccc] shadow cursor-pointer">
        <div>
          <div className=" flex justify-between m-2">
            <p className=" text-gray-500 text-sm font-bold">{postStatusKo}</p>
            <p className=" text-gray-500 text-xs">{timeAgo(created_at)}</p>
          </div>
          <div className=" flex justify-between ml-1 pb-1 mr-2 h-28 border-b border-[#ccc]">
            <Image
              src={imageUrl1}
              alt="헬스장 사진"
              width={200}
              height={64}
              className=" rounded-md"
              priority
            />

            <div className=" flex flex-col justify-between items-end">
              <p>{title}</p>
              <p className=" flex gap-2 items-center text-gray-500 text-sm font-bold">
                <Image src={profile} alt="profile" width={24} priority />
                {authorNickName}
              </p>
            </div>
          </div>
        </div>
        <div className=" flex justify-between mt-2 ml-2 mr-2">
          <div className=" flex items-center gap-4  ">
            <div className=" flex items-center">
              <FaHeart color="#DC7D7D" />{' '}
              <span className=" ml-1 text-gray-500 text-sm font-normal">
                {wishCount}
              </span>
            </div>
            <div className=" flex items-center">
              <IoChatbubblesOutline size={24} />{' '}
              <span className=" ml-1 text-gray-500 text-sm font-normal">
                100
              </span>
            </div>

          </div>
          <p>{gymName}</p>
        </div>
      </div>
    </Link>
  );
}

function timeAgo(pastDate: string) {
  const now = new Date(); // 현재 시간
  const past = new Date(pastDate); // 주어진 날짜

  const diffInMilliseconds = now.getTime() - past.getTime(); // 두 날짜의 차이 (밀리초)
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // 차이를 분으로 변환
  const diffInHours = Math.floor(diffInMilliseconds / 3600000); // 차이를 시간으로 변환

  if (diffInMinutes < 60) {
    // 분 단위로 표현
    if (diffInMinutes < 1) {
      return "방금 전";
    }
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    // 시간 단위로 표현
    return `${diffInHours}시간 전`;
  } else {
    // 하루 이상 차이 나는 경우, 날짜로 표시
    const diffInDays = Math.floor(diffInMilliseconds / 86400000); // 차이를 일로 변환
    return `${diffInDays}일 전`;
  }
}

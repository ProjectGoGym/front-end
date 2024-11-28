import PostList from '@/components/Post/PostList';
import Slider from '@/components/UI/Slider';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Slider />
      <div className=" w-[80%] m-auto">
        <p className="mt-20  ml-8 text-4xl">가장 인기있는 게시물</p>
        <div className=" flex w-100 mb-20 mt-8 min-h-96 ">
          <PostList />
        </div>
      </div>
    </>
  );
}

'use client';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import workoutImg from '../../public/womanworkingout.jpg';

import Link from 'next/link';
import Image from 'next/image';

const Slider = () => {
  const items = [
    {
      name: 'workout',
      title: '최고의 헬스장 멤버십 거래',
      text: '저렴한 가격으로 다양한 헬스장 멤버십을 거래하고, 더 나은 건강을 시작하세요.',
      img: workoutImg,
    },
    {
      name: 'workout',
      title: '디지털 시대의 스마트한 거래',
      text: '온라인에서 간편하게 헬스장 회원권을 사고 팔 수 있습니다. 언제 어디서나 쉽고 빠르게!',
      img: workoutImg,
    },
    {
      name: 'workout',
      title: '다양한 선택지, 나에게 맞는 헬스장',
      text: '여러 헬스장 회원권을 비교하고, 나에게 가장 적합한 헬스장을 찾으세요.',
      img: workoutImg,
    },
  ];
  interface ISliderItem {
    readonly name: string;
    readonly title: string;
    readonly text: string;
    readonly img: any;
  }

  const CustomPrevArrow = (onClickHandler: () => void) => (
    <button
      type="button"
      onClick={onClickHandler}
      className="absolute left-2 top-1/2 z-10"
    >
      <span className="text-white text-2xl font-bold">{'<'} </span>
    </button>
  );

  const CustomNextArrow = (onClickHandler: () => void) => (
    <button
      type="button"
      onClick={onClickHandler}
      className="absolute right-8 top-1/2 z-10"
    >
      <span className="text-white text-2xl font-bold"> {'>'}</span>
    </button>
  );

  return (
    <Carousel
      autoPlay
      showThumbs={false}
      interval={6000}
      showStatus={false}
      infiniteLoop={true}
      renderArrowPrev={(onClickHandler) => CustomPrevArrow(onClickHandler)}
      renderArrowNext={(onClickHandler) => CustomNextArrow(onClickHandler)}
      className="carousel-container"
    >
      {items.map((item: ISliderItem) => {
        return (
          <div key={item.name} className="carousel-slide h-96">
            <div className="carousel-description z-50 absolute left-auto right-auto bottom-1/3 mb-10 text-left w-full lg:container px-4 md:px-10">
              <h2 className="text-2xl lg:text-4xl font-bold text-white font-serif">
                {item.title}
              </h2>
              <p className="my-2 text-white font-serif">{item.text}</p>
              <Link
                href={`/`}
                className=" bg-blue-400 p-2 rounded-md text-white text-sm hover:bg-blue-500 transition-all"
              >
                바로가기
              </Link>
            </div>
            <Image src={item.img} alt={item.name} priority />
          </div>
        );
      })}
    </Carousel>
  );
};

export default Slider;

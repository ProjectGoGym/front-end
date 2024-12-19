"use client";

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
} from "@/constants/category";
import { FilterCategory } from "./FilterCategory";
import { ChangeEvent, useEffect, useState } from "react";
import QuillEditor from "./QuillEditor";
import ImageSelect from "./ImageSelect";
import Image from "next/image";
import SearchKakaoMap from "./SearchKaKaoMap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAccessToken } from "@/api/api";
import axiosInstance from "@/api/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import S3ImageUrl from "@/hooks/S3ImageUrl";

interface PostType {
  postId: string;
  authorNickname: string;
  authorId: number;
  amount: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  gymKakaoUrl: string;
  createdAt: string;
  gymName: string;
  postType: "default" | "SELL" | "BUY";
  membershipType:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
  expirationDate: string;
  remainingSessions: number;
  status: string;
  title: string;
  wishCount: number;
  content: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
}

interface categoryStateType {
  postType: "default" | "SELL" | "BUY";
  status: "default" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "HIDDEN";
  membershipType:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
}

export default function ModifiedPost() {
  const params = useParams();
  const router = useRouter();

  //status 추가하기

  const [values, setValues] = useState({
    title: "",
    content: "",
    expirationDate: "",
    remainingSessions: 0,
    amount: "",
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapValue, setMapValue] = useState({
    latitude: 0,
    longitude: 0,
    gymKakaoUrl: "",
    gymName: "",
  });
  //<Record<string, string | File | null>> 백엔드 연동시 타입추가
  const [preview, setPreview] = useState<Record<string, File | null>>({
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
  });
  const [images, setImages] = useState<Record<string, string | null>>({
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
  });

  const [categoryValue, setCategoryValue] = useState<categoryStateType>({
    postType: "default",
    status: "PENDING",
    membershipType: "default",
  });

  const { data } = useQuery({
    queryKey: ["postDetail", params.postid],
    queryFn: async () => {
      const response: PostType = await axiosInstance.get(
        `/api/posts/details/${params.postid}`,
      );
      return response;
    },
    staleTime: 1000,
  });

  const { mutate, isPending } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (jsonData: Record<string, any>) =>
      await axiosInstance.put(`/api/posts/${params.postid}`, jsonData),
    onSuccess: (data) => {
      alert("게시글이 수정되었습니다.");
      console.log(data);
      router.push("/community");
    },
    onError: () => {
      alert("게시글이 수정되지않았습니다.");
    },
  });

  //토큰발급

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getToken = async () => {
        const response = await getAccessToken();
        if (response) {
          sessionStorage.setItem("accessToken", response);
        }
      };

      getToken();
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      setValues({
        title: data.title,
        content: "",
        expirationDate: data.expirationDate,
        remainingSessions: data.remainingSessions,
        amount: data.amount,
      });
      setMapValue({
        latitude: data.latitude,
        longitude: data.longitude,
        gymKakaoUrl: data.gymKakaoUrl,
        gymName: data.gymName,
      });
      setImages({
        imageUrl1: data.imageUrl1 || "",
        imageUrl2: data.imageUrl2 || "",
        imageUrl3: data.imageUrl3 || "",
      });
      setCategoryValue({
        ...categoryValue,
        postType: data.postType,
        membershipType: data.membershipType,
      });
    }
  }, [data]);

  const handleValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleContent = (value: string) => {
    setValues({
      ...values,
      content: value,
    });
  };

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue({
      ...categoryValue,
      [e.target.name === "post-type" ? "postType" : "membershipType"]:
        e.target.value,
    });
  };

  const handleFileSelect = async (key: string, img: File) => {
    // 백엔드 연동시 파일자체 보내기
    setPreview({
      ...preview,
      [key]: img,
    });
    const newImg = await S3ImageUrl(img.name, img, "posts");
    if (newImg) {
      setImages((prevImages) => ({
        ...prevImages,
        [key]: newImg.toString(),
      }));
    }
  };

  const handleDeleteImage = (el: string) => {
    setImages({ ...images, [el]: "" });
  };

  const handleClickGym = (
    latitude: number,
    longitude: number,
    gymKakaoUrl: string,
    gymName: string,
  ) => {
    setMapValue({
      latitude,
      longitude,
      gymKakaoUrl,
      gymName,
    });
    setIsMapOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mapValue.gymName.trim().length === 0) {
      alert("헬스장을 선택해주세요");
      return;
    }

    if (Object.values(categoryValue).find((status) => status === "default")) {
      alert("카테고리를 선택해주세요");
      return;
    }

    if (values.expirationDate.trim().length === 0) {
      alert("회원권의 기간과 가격을 입력해주세요");
      return;
    }

    if (Number.isNaN(+values.amount.replace(/,/g, ""))) {
      alert("숫자만 입력해주세요");
      return;
    }

    if (values.remainingSessions < 0 || +values.amount.replace(/,/g, "") < 0) {
      alert("가격과 PT횟수는 0 이상으로 입력해주세요");
      return;
    }

    if (
      values.title.trim().length === 0 ||
      values.content.trim().length === 0
    ) {
      alert("제목과 내용을 입력해주세요");
      return;
    }

    // const formData = new FormData();

    // // values 추가
    // // number가 있기때문에 toString()을 사용해 타입 고정
    // for (const key in values) {
    //   formData.append(key, values[key as keyof typeof values].toString());
    // }

    // // mapValue 추가
    // for (const key in mapValue) {
    //   formData.append(key, mapValue[key as keyof typeof mapValue].toString());
    // }

    // // images 추가
    // for (const key in images) {
    //   if (images[key]) {
    //     formData.append(key, images[key] as File);
    //   }
    // }

    // // categoryValue 추가
    // for (const key in categoryValue) {
    //   formData.append(key, categoryValue[key as keyof typeof categoryValue]);
    // }

    // const data: Record<string, string> = {};
    // formData.forEach((value, key) => {
    //   data[key] = value as string; // 값이 string 타입으로 추론되도록 처리
    // });

    mutate({
      ...values,
      ...images,
      ...categoryValue,
      [values.amount]: +values.amount.replace(/,/g, ""),
    });
  };

  if (isPending) {
    return <p>게시글 작성중입니다 ...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[75%] p-8 pt-12">
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor={"expirationDate"} className="text-sm text-gray-500">
            헬스장 찾기
          </label>
          <input
            type="button"
            className="h-12 w-fit min-w-48 cursor-pointer rounded-md border border-gray-400 pl-2 pr-2 text-gray-500 focus:outline-blue-400"
            onClick={() => {
              setIsMapOpen(true);
            }}
            value={mapValue.gymName}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor={"expirationDate"} className="text-sm text-gray-500">
              회원권 마감 날짜
            </label>
            <input
              type="date"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"expirationDate"}
              id={"expirationDate"}
              onChange={handleValues}
              value={values.expirationDate}
              placeholder="ex) 2025/02/24"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor={"remainingSessions"}
              className="text-sm text-gray-500"
            >
              PT횟수
            </label>
            <input
              type="number"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"remainingSessions"}
              id={"remainingSessions"}
              value={values.remainingSessions}
              onChange={handleValues}
              placeholder="ex) 25"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={"amount"} className="text-sm text-gray-500">
              가격
            </label>
            <input
              type="text"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"amount"}
              id={"amount"}
              value={formatNumber(values.amount.toString())}
              onChange={handleValues}
              placeholder="ex) 250000"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4 border-b border-gray-400 pb-8">
          {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
            <FilterCategory
              key={category.label}
              {...category}
              onSelect={handleSelectOptions}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            className="mb-4 mt-4 h-24 w-[100%] max-w-[1200px] rounded-lg border-2 border-blue-300 pl-4 text-4xl font-bold focus:outline-blue-300"
            placeholder="제목을 입력하세요"
            value={values.title}
            name="title"
            onChange={handleValues}
          />
          <div className="h-[400px] w-[100%] max-w-[1200px]">
            <QuillEditor onChange={handleContent} />
          </div>
          <div className="flex w-[100%] max-w-[1200px] items-center justify-between">
            {Object.keys(preview).map((el) =>
              preview[el] ? (
                <div
                  key={el}
                  className="relative flex h-56 min-w-60 items-center justify-center"
                >
                  <button
                    type="button"
                    className="absolute right-0 top-[-20px]"
                    onClick={() => handleDeleteImage(el)}
                  >
                    ❌
                  </button>
                  <Image
                    // json서버 사용시까진 blob url
                    // src={images[el] as string}
                    src={URL.createObjectURL(preview[el]!)}
                    width={224}
                    height={15}
                    alt="헬스장 이미지"
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <ImageSelect key={el} name={el} onChange={handleFileSelect} />
              ),
            )}
            <button
              type="submit"
              className="rounded-lg bg-blue-300 p-1 pl-6 pr-6 text-xl text-white transition-all hover:bg-blue-500"
            >
              수정하기
            </button>
          </div>
        </div>
      </form>
      {isMapOpen && (
        <SearchKakaoMap
          onClick={handleClickGym}
          onClose={() => {
            setIsMapOpen(false);
          }}
        />
      )}
    </>
  );
}

const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

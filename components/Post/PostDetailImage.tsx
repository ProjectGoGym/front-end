import Image from 'next/image';

interface propsType {
  imageUrl: string;
  onClick: () => void;
}
export default function PostDetailImage({ imageUrl, onClick }: propsType) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="헬스장 이미지"
          className="rounded-lg"
          width={240}
          height={240}
        />
      ) : (
        ''
      )}
    </div>
  );
}

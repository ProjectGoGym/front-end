import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/sigs/:path*", // 클라이언트에서 요청하는 경로
        destination: "https://sgisapi.kostat.go.kr/:path*", // 실제 API 요청을 보낼 URL
      },
      {
        source: "/backend/:path*", // Local API

        destination: "https://253e-119-196-107-204.ngrok-free.app/:path*",

        // destination: "https://go-gym.site/:path*",
      },
      {
        source: "/chat/:path*", // Local API
        destination: "https://f98c-1-240-3-56.ngrok-free.app/:path*",
      },
    ];
  },

  images: {
    domains: ["example-s3-bucket.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 데이터 URI를 허용
      },
    ],
  },
};

export default nextConfig;

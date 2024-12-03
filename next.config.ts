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
        destination: "http://3.36.198.162:8080/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 데이터 URI를 허용
      },
    ],
  },
};

export default nextConfig;

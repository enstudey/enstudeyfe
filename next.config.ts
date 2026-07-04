import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: false,
      },
      {
        source: "/speaking",
        destination: "/",
        permanent: false,
      },
      {
        source: "/mistake-bank",
        destination: "/",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/",
        permanent: false,
      },
      {
        source: "/oauth2/:path*",
        destination: "/",
        permanent: false,
      },
      // Redirects cho các bài blog cũ sang category mới
      {
        source: "/blog/spaced-repetition-hoc-tu-vung",
        destination: "/blog/skills/spaced-repetition-hoc-tu-vung",
        permanent: true,
      },
      {
        source: "/blog/5-meo-tranh-bay-part-1-toeic",
        destination: "/blog/toeic/5-meo-tranh-bay-part-1-toeic",
        permanent: true,
      },
      {
        source: "/blog/cach-phan-bo-thoi-gian-reading-ielts",
        destination: "/blog/skills/cach-phan-bo-thoi-gian-reading-ielts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

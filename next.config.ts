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
      {
        protocol: "https",
        hostname: "salt.tikicdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const defaultRedirects = [
      // Redirects cho các bài blog cũ sang category mới
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
      {
        source: "/exams",
        destination: "/exam",
        permanent: true,
      },
      {
        source: "/exams/:path*",
        destination: "/exam/:path*",
        permanent: true,
      },
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
      {
        source: "/chinh-sach-bao-mat",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/dieu-khoan-dich-vu",
        destination: "/terms-of-service",
        permanent: true,
      },
      {
        source: "/gioi-thieu",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/speaking",
        destination: "/luyen-noi",
        permanent: true,
      },
      {
        source: "/flashcards",
        destination: "/the-ghi-nho",
        permanent: true,
      },
      {
        source: "/analytics",
        destination: "/thong-ke",
        permanent: true,
      },
      {
        source: "/roadmap",
        destination: "/lo-trinh",
        permanent: true,
      },
      {
        source: "/roadmap/survey",
        destination: "/lo-trinh/khao-sat",
        permanent: true,
      },
      {
        source: "/mistake-bank",
        destination: "/ngan-hang-cau-sai",
        permanent: true,
      },
      {
        source: "/practice",
        destination: "/luyen-de",
        permanent: true,
      },
      {
        source: "/practice/grammar-swipe",
        destination: "/luyen-de/luyen-ngu-phap",
        permanent: true,
      },
      {
        source: "/practice/session",
        destination: "/luyen-de/lam-bai",
        permanent: true,
      },
    ];

    return defaultRedirects;
  },
};

export default nextConfig;

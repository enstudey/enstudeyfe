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

    return defaultRedirects;
  },
};

export default nextConfig;

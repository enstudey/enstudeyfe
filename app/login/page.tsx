import { Metadata } from "next";
import { getGoogleLoginUrl } from "@/lib/api/client";
import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Đăng nhập - EnStudey",
  description: "Đăng nhập vào hệ thống học tập EnStudey bằng Google.",
};

export default function LoginPage() {
  const googleLoginUrl = getGoogleLoginUrl();

  return <LoginClient googleLoginUrl={googleLoginUrl} />;
}

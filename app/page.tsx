import { Metadata } from "next";
import { cookies } from "next/headers";
import GuestLandingPage from "@/components/home/GuestLandingPage";
import UserDashboard from "@/components/home/UserDashboard";

export const metadata: Metadata = {
  title: "EnStudey - Nền tảng Luyện thi TOEIC Online chuẩn ETS 2026",
  description: "Trang chủ luyện thi thử TOEIC Reading & Listening 500-750+ chuẩn ETS 2026 với 10 câu trắc nghiệm chọn lọc mỗi ngày và tự động lưu câu sai.",
};

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  isAnonymous: boolean;
  avatarColor: string | null;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: UserDto | null = null;
  let isGuest = !token;

  if (token) {
    try {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        user = userData.data as UserDto;
      } else if (userRes.status === 401) {
        isGuest = true;
      }
    } catch (error) {
      console.error("Failed to fetch user data, fallback to guest mode", error);
      isGuest = true;
    }
  }

  return (
    <main className="py-6 md:py-10 flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-8">
      {isGuest ? (
        <GuestLandingPage />
      ) : (
        <UserDashboard userFullName={user?.fullName} token={token} />
      )}
    </main>
  );
}

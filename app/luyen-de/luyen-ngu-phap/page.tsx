import { Metadata } from "next";
import { cookies } from "next/headers";
import GrammarSwipeContainer from "@/components/practice/GrammarSwipeContainer";

export const metadata: Metadata = {
  title: "Grammar Swipe - Vuốt Thẻ Luyện Ngữ Pháp | EnStudey",
  description: "Trò chơi vuốt thẻ Tinder-style giúp nhận diện lỗi ngữ pháp tiếng Anh nhanh chóng và tích lũy điểm kinh nghiệm XP.",
};

export default async function GrammarSwipePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl =
    process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL ||
    "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="flex-grow flex flex-col bg-[#FAFAFA] dark:bg-black bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.03),transparent_60%)]">
      <GrammarSwipeContainer 
        isGuest={isGuest} 
        googleLoginUrl={googleLoginUrl} 
        token={token} 
      />
    </main>
  );
}

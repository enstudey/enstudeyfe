import Link from "next/link";
import { Metadata } from "next";
import ErrorReportForm from "@/components/error-report-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Trang này đi đâu mất rồi - EnStudey",
  description: "Tụi mình không tìm thấy trang bạn yêu cầu rồi á.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-accent">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Ơ, trang trốn đâu mất rồi...</h1>
        <p className="mt-6 text-base leading-7 text-zinc-500 max-w-md mx-auto">
          Tụi mình không tìm thấy trang bạn đang tìm kiếm. Đường dẫn có thể bị nhầm một xíu hoặc trang đã được dời đi chỗ khác rồi á.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="font-semibold cursor-pointer">
            <Link href="/" id="btn-go-home">
              Về trang chủ nha
            </Link>
          </Button>
        </div>
        <ErrorReportForm errorCode="404" errorMessage="Page not found" />
      </div>
    </div>
  );
}

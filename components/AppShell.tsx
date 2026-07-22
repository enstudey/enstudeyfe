"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";

export default function AppShell({
  token,
  children,
}: {
  token?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isIsolated =
    pathname.startsWith("/quiz") ||
    pathname.includes("/exam/session/");

  if (isIsolated) {
    return <>{children}</>;
  }

  return (
    <>
      <Header token={token} />
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 flex-grow flex flex-col">
        {children}
      </div>
      <Footer />
      <BottomTabBar />
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toggleAnonymous } from "@/lib/api/streak";

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  isAnonymous: boolean;
  avatarColor: string | null;
}

interface UserProfileDropdownProps {
  user: UserDto;
  token: string;
}

export default function UserProfileDropdown({ user, token }: UserProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnon, setIsAnon] = useState(user.isAnonymous);
  const [localAvatarColor, setLocalAvatarColor] = useState(user.avatarColor);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const nextVal = !isAnon;
    setIsAnon(nextVal); // Optimistic UI update
    try {
      const res = await toggleAnonymous(token, nextVal);
      if (res && res.data) {
        setIsAnon(res.data.isAnonymous);
        setLocalAvatarColor(res.data.avatarColor);
        router.refresh(); // Refresh page to reload Server Component data (leaderboard, etc.)
      }
    } catch (error) {
      console.error("Failed to toggle anonymous mode", error);
      setIsAnon(!nextVal); // Revert on failure
    }
  };

  const suffix = user.id.substring(Math.max(0, user.id.length - 4));
  const displayName = isAnon ? `Người học ẩn danh #${suffix}` : user.fullName;


  return (
    <div className="relative" ref={dropdownRef} data-testid="user-profile-dropdown">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200 flex items-center justify-center focus:outline-none"
      >
        {isAnon ? (
          <div
            className="w-full h-full flex items-center justify-center text-sm font-bold text-white uppercase select-none"
            style={{ backgroundColor: localAvatarColor || "#6B7280" }}
          >
            Ẩ
          </div>
        ) : user.avatarUrl ? (

          <Image
            src={user.avatarUrl}
            alt={user.fullName}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 text-sm font-bold uppercase select-none">
            {user.fullName.charAt(0)}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="px-4 pb-2 border-b border-slate-50 space-y-0.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tài khoản</p>
            <p className="font-bold text-slate-800 text-sm truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">Chế độ ẩn danh</p>
              <p className="text-[10px] text-slate-400 leading-normal max-w-[150px]">
                Ẩn thông tin cá nhân trên Bảng xếp hạng.
              </p>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAnon ? "bg-blue-600" : "bg-slate-200"
                }`}
              data-testid="toggle-anonymous-mode"
              aria-label="Toggle anonymous mode"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isAnon ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          <div className="px-2 pt-2">
            <a
              href="/api/auth/logout"
              className="flex w-full items-center px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition duration-150"
            >
              Đăng xuất
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

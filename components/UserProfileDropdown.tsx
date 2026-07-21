"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleAnonymous } from "@/lib/api/streak";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [isAnon, setIsAnon] = useState(user.isAnonymous);
  const [localAvatarColor, setLocalAvatarColor] = useState(user.avatarColor);

  const handleToggle = async () => {
    const nextVal = !isAnon;
    setIsAnon(nextVal);
    try {
      const res = await toggleAnonymous(token, nextVal);
      if (res && res.data) {
        setIsAnon(res.data.isAnonymous);
        setLocalAvatarColor(res.data.avatarColor);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle anonymous mode", error);
      setIsAnon(!nextVal);
    }
  };

  const suffix = user.id.substring(Math.max(0, user.id.length - 4));
  const displayName = isAnon ? `Người học ẩn danh #${suffix}` : user.fullName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer group rounded-full" data-testid="user-profile-dropdown">
        <Avatar className="w-9 h-9 border border-slate-200 transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-500">
          {isAnon ? (
            <AvatarFallback
              className="text-sm font-bold text-white uppercase"
              style={{ backgroundColor: localAvatarColor || "#6B7280" }}
            >
              Ẩ
            </AvatarFallback>
          ) : (
            <>
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
              <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-bold uppercase">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-xl">
        <div className="px-3 py-2 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tài khoản</p>
          <p className="font-bold text-slate-800 text-sm truncate">{displayName}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <div className="px-3 py-2 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800">Chế độ ẩn danh</p>
            <p className="text-[10px] text-slate-400 leading-normal max-w-[140px]">
              Ẩn thông tin cá nhân trên Bảng xếp hạng.
            </p>
          </div>
          <Switch
            checked={isAnon}
            onCheckedChange={handleToggle}
            data-testid="toggle-anonymous-mode"
            aria-label="Toggle anonymous mode"
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => { window.location.href = "/api/auth/logout"; }}
          className="focus:bg-rose-50 cursor-pointer rounded-xl text-xs font-bold text-rose-600 px-3 py-2"
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

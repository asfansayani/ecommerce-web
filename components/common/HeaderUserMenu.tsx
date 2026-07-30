"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LogOut, UserRound } from "lucide-react";
import userIcon from "@/public/assets/images/user.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

export default function HeaderUserMenu() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !token) {
    return (
      <Link href="/sign-in">
        <Image src={userIcon} alt="User" />
      </Link>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/sign-in");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu closeParentOnEsc>
      <DropdownMenuTrigger className="outline-none">
        <Image src={userIcon} alt="User menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <UserRound />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOut />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

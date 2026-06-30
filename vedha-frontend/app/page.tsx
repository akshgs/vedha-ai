// app/page.tsx — Root redirect
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function Home() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "company")       router.push("/company");
      else if (user.role === "employee") router.push("/employee");
      else                               router.push("/student");
    } else {
      router.push("/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <p>Loading Vedha AI...</p>
    </div>
  );
}
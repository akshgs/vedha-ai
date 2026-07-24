import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import StudentLayout from "./StudentLayout";
import CompanyLayout from "./CompanyLayout";
import AdminLayout from "./AdminLayout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (user?.role === "company") {
    return <CompanyLayout>{children}</CompanyLayout>;
  }

  // Fallback to Student Layout
  return <StudentLayout>{children}</StudentLayout>;
}
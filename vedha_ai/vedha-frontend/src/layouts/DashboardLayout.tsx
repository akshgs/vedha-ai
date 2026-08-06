import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import StudentLayout from "./StudentLayout";
import CompanyLayout from "./CompanyLayout";
import AdminLayout from "./AdminLayout";
import EmployeeLayout from "./EmployeeLayout";
import MentorLayout from "./MentorLayout";
import RecruiterLayout from "./RecruiterLayout";
import UniversityLayout from "./UniversityLayout";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  switch (user?.role) {
    case "admin":
      return <AdminLayout>{children}</AdminLayout>;
    case "company":
      return <CompanyLayout>{children}</CompanyLayout>;
    case "employee":
      return <EmployeeLayout>{children}</EmployeeLayout>;
    case "mentor":
      return <MentorLayout>{children}</MentorLayout>;
    case "recruiter":
      return <RecruiterLayout>{children}</RecruiterLayout>;
    case "university":
      return <UniversityLayout>{children}</UniversityLayout>;
    default:
      return <StudentLayout>{children}</StudentLayout>;
  }
}
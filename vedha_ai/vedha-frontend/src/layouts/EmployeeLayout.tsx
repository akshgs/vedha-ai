import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function EmployeeLayout({ children }: Props) {
  return <PortalLayout role="employee">{children}</PortalLayout>;
}

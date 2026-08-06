import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return <PortalLayout role="admin">{children}</PortalLayout>;
}

import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function CompanyLayout({ children }: Props) {
  return <PortalLayout role="company">{children}</PortalLayout>;
}

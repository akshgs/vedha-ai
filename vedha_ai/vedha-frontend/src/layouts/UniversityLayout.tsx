import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function UniversityLayout({ children }: Props) {
  return <PortalLayout role="university">{children}</PortalLayout>;
}

import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function StudentLayout({ children }: Props) {
  return <PortalLayout role="student">{children}</PortalLayout>;
}

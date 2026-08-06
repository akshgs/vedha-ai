import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function MentorLayout({ children }: Props) {
  return <PortalLayout role="mentor">{children}</PortalLayout>;
}

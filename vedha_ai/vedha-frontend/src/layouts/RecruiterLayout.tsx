import type { ReactNode } from "react";
import PortalLayout from "./PortalLayout";

type Props = {
  children: ReactNode;
};

export default function RecruiterLayout({ children }: Props) {
  return <PortalLayout role="recruiter">{children}</PortalLayout>;
}

import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Apply() {
  return (
    <div className="section-wrapper apply-page">
      <div className="apply-logo">
        <Logo color="white" size={48} strokeWidth={16} />
      </div>
      <h1 className="apply-title">Applications open soon</h1>
      <p className="apply-sub">
        We&apos;re not quite ready yet, but when we are, this is where
        you&apos;ll apply to join the team.
      </p>
      <Link href="/#about" className="apply-back">
        &larr; Back to About
      </Link>
    </div>
  );
}

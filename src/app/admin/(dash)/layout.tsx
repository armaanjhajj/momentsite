import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";

// Guards every page in the (dash) route group. The login page lives at
// /admin/login (outside this group) so it stays reachable.
export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}

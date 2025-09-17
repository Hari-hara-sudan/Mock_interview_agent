import { cookies } from "next/headers";
import HeaderClient from "@/components/vox/layout/HeaderClient";

export default async function HeaderWrapper() {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("session")?.value;
  return <HeaderClient isAuthenticated={hasSession} />;
}

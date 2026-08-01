import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomeContent } from "@/components/dashboard/HomeContent";
import { GUEST_COOKIE } from "@/lib/auth/guest";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function HomePage() {
  const [user, cookieStore] = await Promise.all([getCurrentUser(), cookies()]);
  const isGuest = cookieStore.get(GUEST_COOKIE)?.value === "1";

  if (!user && !isGuest) redirect("/login");

  return <HomeContent />;
}

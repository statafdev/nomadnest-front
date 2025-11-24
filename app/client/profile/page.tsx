import { getSession } from "@/lib/session";
import ProfilePage from "./Profile";

export default async function page() {
  const session = await getSession();
  console.log("Session dans profile page:", session);
  return <ProfilePage session={session} />;
}

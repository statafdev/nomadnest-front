import { getSession } from "@/lib/session";
import ListingsGrid from "./ListingsGrid";

export default async function page() {
  const session = await getSession();
  console.log("Session dans profile page:", session);
  return <ListingsGrid session={session} />;
}

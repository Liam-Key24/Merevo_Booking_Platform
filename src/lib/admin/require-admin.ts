import "server-only";

import { redirect } from "next/navigation";
import {
  getAuthSnapshot,
  type AuthSnapshot,
} from "@/lib/auth/business-context";

export type MeridianAdminContext = AuthSnapshot & {
  isMerevoAdmin: true;
};

export async function requireMeridianAdmin(): Promise<MeridianAdminContext> {
  const snapshot = await getAuthSnapshot();
  if (!snapshot) {
    redirect("/login?next=/admin");
  }
  if (!snapshot.isMerevoAdmin) {
    redirect("/admin");
  }
  return snapshot as MeridianAdminContext;
}

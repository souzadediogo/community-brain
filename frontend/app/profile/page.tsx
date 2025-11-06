import { redirect } from "next/navigation"

export default function ProfileRedirect() {
  // Redirect to the current user's profile (u1 as default)
  redirect("/profile/u1")
}

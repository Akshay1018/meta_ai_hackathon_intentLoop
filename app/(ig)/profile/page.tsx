import { ProfileHome } from "@/components/ig/ProfileHome";
import profile from "@/mock/profile.json";

export default function ProfilePage() {
  return <ProfileHome data={profile} />;
}

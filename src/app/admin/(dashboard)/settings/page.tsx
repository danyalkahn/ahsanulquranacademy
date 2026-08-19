import { getSiteSettings } from "@/lib/site-settings";
import ChangePasswordForm from "@/components/admin/change-password-form";
import BrandingForm from "@/components/admin/branding-form";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold">Settings</h1>
      <BrandingForm initial={settings} />
      <ChangePasswordForm />
    </div>
  );
}

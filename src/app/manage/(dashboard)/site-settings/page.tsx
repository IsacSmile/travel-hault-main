import { redirect } from 'next/navigation';

export default function SiteSettingsRedirectPage() {
  redirect('/manage/settings');
}

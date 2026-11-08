import { Metadata } from 'next';
import SettingsForm from '@/components/admin/SettingsForm';
import { settingsRepository } from '@/lib/repositories/settings.repository';
import { logBlobConfigStatus } from '@/lib/blob/check-blob-config';
import { requireAdminPage } from '@/lib/auth/requireAdminPage';

export const metadata: Metadata = {
  title: 'Site Settings - Admin Dashboard',
};

export default async function SettingsPage() {
  await requireAdminPage();
  
  // Check blob configuration on the server side
  logBlobConfigStatus();
  
  // Get all settings
  const settings = await settingsRepository.getAll();
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage general settings and SEO for your blog
        </p>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
import { settingsRepository } from '../src/lib/repositories/settings.repository';

async function initializeSettings() {
  try {
    await settingsRepository.initialize();
    console.log('Settings initialized successfully');
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
  process.exit(0);
}

initializeSettings();
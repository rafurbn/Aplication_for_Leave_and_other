import { SavedApplication } from '../types';

const STORAGE_KEY_APPLICATIONS = 'bengali_app_writer_saved_apps';
const STORAGE_KEY_ANON_TOKEN = 'bengali_app_writer_anon_token';

/**
 * Gets or initializes an anonymous persistent UUID for the user
 */
export function getOrCreateAnonymousToken(): string {
  try {
    let token = localStorage.getItem(STORAGE_KEY_ANON_TOKEN);
    if (!token) {
      token = 'user-' + Math.random().toString(36).substring(2, 12) + '-' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_ANON_TOKEN, token);
    }
    return token;
  } catch {
    return 'user-temp-' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * Retrieves all locally saved applications
 */
export function getSavedApplications(): SavedApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved applications from localStorage', err);
    return [];
  }
}

/**
 * Saves a new application to local storage
 */
export function saveApplicationLocally(app: Omit<SavedApplication, 'id' | 'createdAt'>): SavedApplication {
  const existing = getSavedApplications();
  const newApp: SavedApplication = {
    ...app,
    id: 'app-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: Date.now(),
  };

  const updated = [newApp, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save application to localStorage', err);
  }
  return newApp;
}

/**
 * Deletes an application from local storage
 */
export function deleteSavedApplication(id: string): SavedApplication[] {
  const existing = getSavedApplications();
  const updated = existing.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete application', err);
  }
  return updated;
}

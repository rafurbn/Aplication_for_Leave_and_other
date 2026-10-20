import { SavedApplication } from '../types';

const STORAGE_KEY_APPLICATIONS = 'bengali_app_writer_saved_apps';
const STORAGE_KEY_ANON_TOKEN = 'bengali_app_writer_anon_token';
const STORAGE_SCHEMA_VERSION = 1;

function createId(prefix: string): string {
  const randomId = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${randomId || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}`;
}

function isSavedApplication(value: unknown): value is SavedApplication {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SavedApplication>;
  return typeof candidate.id === 'string'
    && typeof candidate.formatId === 'string'
    && typeof candidate.createdAt === 'number'
    && !!candidate.data;
}

export function getOrCreateAnonymousToken(): string {
  try {
    let token = localStorage.getItem(STORAGE_KEY_ANON_TOKEN);
    if (!token) {
      token = createId('user');
      localStorage.setItem(STORAGE_KEY_ANON_TOKEN, token);
    }
    return token;
  } catch {
    return createId('user-temp');
  }
}

export function getSavedApplications(): SavedApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedApplication);
  } catch (error) {
    console.error('Failed to parse saved applications from localStorage', error);
    return [];
  }
}

export function saveApplicationLocally(app: Omit<SavedApplication, 'id' | 'createdAt'>): SavedApplication {
  const newApp: SavedApplication = {
    ...app,
    id: createId('app'),
    createdAt: Date.now(),
  };
  const updated = [newApp, ...getSavedApplications()];
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
    localStorage.setItem(`${STORAGE_KEY_APPLICATIONS}:schema`, String(STORAGE_SCHEMA_VERSION));
  } catch (error) {
    console.error('Failed to save application to localStorage', error);
  }
  return newApp;
}

export function deleteSavedApplication(id: string): SavedApplication[] {
  const updated = getSavedApplications().filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete application', error);
  }
  return updated;
}

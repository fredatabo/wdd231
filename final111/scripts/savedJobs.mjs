// savedJobs.mjs — ES module. Wraps all localStorage access for the
// "save this role" feature so the rest of the app never touches
// localStorage directly.

const STORAGE_KEY = 'waypoint_saved_jobs';

export function getSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read saved jobs from localStorage:', err);
    return [];
  }
}

export function isSaved(id) {
  return getSavedIds().includes(id);
}

export function toggleSaved(id) {
  const ids = getSavedIds();
  const index = ids.indexOf(id);

  if (index === -1) {
    ids.push(id);
  } else {
    ids.splice(index, 1);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids.includes(id);
}

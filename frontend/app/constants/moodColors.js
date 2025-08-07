// Mood color mapping (should match MoodPalette)
export const MOOD_COLORS = {
  energised: "#D2F5E3",
  sleepy: "#E6EAF4",
  focused: "#D6E4F0",
  calm: "#E6F4F1",
  anxious: "#F4E6E6",
  happy: "#FFF9D6",
  sad: "#F4E6F1",
  irritable: "#F9E7D6",
  satisfied: "#E6F4E6",
  sluggish: "#F4F1E6",
  guilty: "#E6D3E6",
  craving_more: "#E2DDE6",
};

// Helper to get mood colors for an array of moods
export function getMoodColors(moods) {
  if (!Array.isArray(moods)) return [];
  return moods.map((m) => MOOD_COLORS[m] || "#fff");
}

// Helper to get mood colors from mood scores (prioritized by score)
export function getMoodColorsFromScores(moodScores) {
  if (!Array.isArray(moodScores)) return [];

  // Sort by score (highest first) and get colors
  return moodScores
    .sort((a, b) => b.score - a.score)
    .map((ms) => MOOD_COLORS[ms.mood] || "#fff");
}

// Helper to get mood colors with fallback to legacy moods
export function getMoodColorsWithFallback(log) {
  if (log.mood_scores && log.mood_scores.length > 0) {
    return getMoodColorsFromScores(log.mood_scores);
  }

  // Fallback to legacy moods array
  const moods = log.moods || (log.mood ? [log.mood] : []);
  return getMoodColors(moods);
}

// Default export for Expo Router compatibility
export default {
  MOOD_COLORS,
  getMoodColors,
  getMoodColorsFromScores,
  getMoodColorsWithFallback,
};

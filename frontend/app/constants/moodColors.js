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
};

// Helper to get mood colors for an array of moods
export function getMoodColors(moods) {
  if (!Array.isArray(moods)) return [];
  return moods.map((m) => MOOD_COLORS[m] || "#fff");
}

// Default export for Expo Router compatibility
export default { MOOD_COLORS, getMoodColors };

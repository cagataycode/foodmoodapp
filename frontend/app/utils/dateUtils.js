// Helper to get day label (Today, Yesterday, or day name)
export function getDayLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

// Helper to group logs by day
export function groupLogsByDay(logs) {
  const groups = {};
  logs.forEach((log) => {
    const label = getDayLabel(log.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(log);
  });
  return groups;
}

// Helper to format time
export function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Default export for Expo Router compatibility
export default { getDayLabel, groupLogsByDay, formatTime };

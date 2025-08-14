export const INSIGHTS_STORIES = [
  {
    title: "Snapshot",
    subtitle: "Between Aug 1 – Aug 7",
    bullets: [
      "You logged 18 times",
      "By meal: 6 breakfast • 6 lunch • 6 dinner",
      "Most logged: oatmeal with berries, avocado toast & eggs, yogurt parfait, sushi/poke/buddha bowls, salmon/veggie stir-fry",
    ],
    chart: {
      type: "donut",
      data: [
        { label: "Breakfast", value: 6, color: "#9FA8B3" },
        { label: "Lunch", value: 6, color: "#C9D1D9" },
        { label: "Dinner", value: 6, color: "#E6ECF2" },
      ],
      centerLabel: "Logs by meal",
    },
    secondaryChart: {
      type: "barRow",
      data: [
        { label: "Oatmeal w/ berries", value: 3 },
        { label: "Avocado toast & eggs", value: 3 },
        { label: "Yogurt parfait", value: 3 },
      ],
    },
    caption: "Donut chart shows normalized percentages (6/18 ≈ 33% each).",
    caption_science:
      "Small, frequent logs reveal trends over days—not single meals.",
    palette: { background: "#F6F8FA", text: "#2c3e50", accent: "#95A5A6" },
  },
  {
    title: "What lifted you up",
    subtitle: "Your best energy and focus",
    bullets: [
      "Breakfasts like parfait, avocado toast, and PB‑banana toast often paired with energized or happy.",
      "Lunch bowls (sushi, poke, buddha) frequently matched calm and focused.",
      "Dinners with lean protein + veggies (salmon, stir‑fry) linked to satisfied and calm/energized.",
    ],
    chart: {
      type: "stackedBar",
      categories: ["Breakfast", "Lunch", "Dinner"],
      series: [
        { name: "energised", color: "#4ADE80", data: [4, 1, 2] },
        { name: "happy", color: "#60A5FA", data: [3, 1, 1] },
        { name: "calm", color: "#34D399", data: [1, 3, 1] },
        { name: "focused", color: "#22D3EE", data: [0, 3, 0] },
      ],
    },
    chips: [
      { label: "Parfait", sublabel: "→ energized/happy" },
      { label: "Bowls", sublabel: "→ calm/focused" },
      { label: "Salmon/stir‑fry", sublabel: "→ satisfied/calm" },
    ],
    caption: "Stacked bars show distribution of positive moods by meal.",
    caption_science:
      "Low‑GI carbs + protein can support steadier focus and calm.",
    palette: { background: "#F0FAF7", text: "#0F172A", accent: "#10B981" },
  },
  {
    title: "What slowed you down",
    subtitle: "Things that drained you",
    bullets: [
      "Heavier/oilier dinner (shrimp fried rice) showed satisfied but sometimes sluggish.",
      "Refined‑carb breakfast (bagel w/ cream cheese) appeared with sleepy.",
    ],
    chart: {
      type: "singleItemDonut",
      dataTitle: "Bagel with cream cheese",
      data: [
        { label: "sleepy 😴", value: 3, color: "#F59E0B" },
        { label: "other", value: 1, color: "#FFE8BF" },
      ],
    },
    secondaryChart: {
      type: "barRow",
      title: "Shrimp fried rice — mood split",
      data: [
        { label: "satisfied 😌", value: 3 },
        { label: "sluggish 🐢", value: 2 },
      ],
    },
    caption:
      "Single‑item donut shows proportion of sleepy for bagel breakfasts.",
    caption_science:
      "Bigger or oilier meals slow digestion—'food coma' can happen.",
    palette: { background: "#FFF8ED", text: "#7C3A00", accent: "#F59E0B" },
  },
  {
    title: "Simple rhythms",
    subtitle: "Your helpful rhythms",
    bullets: [
      "On days with a logged breakfast, afternoons leaned calm or focused (bowls, sandwiches).",
      "Protein + fiber patterns (yogurt + granola; bowls w/ greens/edamame) lined up with steadier focus/energy.",
    ],
    chart: {
      type: "trendMini",
      data: [
        { date: "2025-08-01", value: 0.6, group: "With breakfast" },
        { date: "2025-08-02", value: 0.55, group: "With breakfast" },
        { date: "2025-08-03", value: 0.62, group: "With breakfast" },
        { date: "2025-08-04", value: 0.58, group: "With breakfast" },
        { date: "2025-08-05", value: 0.65, group: "With breakfast" },
        { date: "2025-08-06", value: 0.6, group: "With breakfast" },
        { date: "2025-08-07", value: 0.63, group: "With breakfast" },
        { date: "2025-08-01", value: 0.38, group: "Without breakfast" },
        { date: "2025-08-02", value: 0.4, group: "Without breakfast" },
        { date: "2025-08-03", value: 0.35, group: "Without breakfast" },
        { date: "2025-08-04", value: 0.42, group: "Without breakfast" },
        { date: "2025-08-05", value: 0.39, group: "Without breakfast" },
        { date: "2025-08-06", value: 0.36, group: "Without breakfast" },
        { date: "2025-08-07", value: 0.41, group: "Without breakfast" },
      ],
      groups: [
        { name: "With breakfast", color: "#60A5FA" },
        { name: "Without breakfast", color: "#A78BFA" },
      ],
    },
    chips: [
      { label: "Yogurt + granola", sublabel: "→ focused/energized" },
      { label: "Bowls + greens/edamame", sublabel: "→ calm/focused" },
      { label: "Salmon/chicken", sublabel: "→ steady energy" },
    ],
    caption: "Two tiny trend lines: afternoon calm/focused rate.",
    caption_science:
      "Protein and fiber boost fullness signals (PYY, CCK, leptin).",
    palette: {
      background: "#F0F7FF",
      text: "#0F172A",
      accent: "#60A5FA",
      gradient: ["#EEF2FF", "#E0F2FE"],
    },
  },
];

export default INSIGHTS_STORIES;

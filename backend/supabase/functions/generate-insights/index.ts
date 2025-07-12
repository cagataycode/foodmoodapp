import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FoodLog {
  id: string;
  food_name: string;
  food_id?: string;
  moods: string[];
  meal_time: string;
  portion_size?: string;
  notes?: string;
}

interface Insight {
  insight_type: "weekly" | "monthly";
  title: string;
  description: string;
  data: {
    statistics: Record<string, any>;
    patterns: Record<string, any>;
    educational: Record<string, any>;
    trends?: Record<string, any>;
  };
  period_start: string;
  period_end: string;
}

// Educational content about common food-mood patterns
const educationalInsights = {
  sleepy: {
    title: "Feeling sleepy after eating? That's normal!",
    description:
      "It's normal to feel sleepy after eating, especially after a big lunch or dinner. That's why people talk about 'food comas'; your body is busy digesting, and you just want to take a nap. This is especially common with high-carb meals or large portions.",
    reason: "digestion_energy",
  },
  energised: {
    title: "Foods that energize you",
    description:
      "Feeling energized after eating is a great sign! This often happens with foods rich in protein, complex carbs, or natural sugars. Your body is getting the fuel it needs to power through your day.",
    reason: "nutrient_rich",
  },
  satisfied: {
    title: "The satisfaction factor",
    description:
      "Feeling satisfied after a meal means you've found foods that truly nourish you. This feeling of contentment is important for maintaining healthy eating habits and avoiding overeating later.",
    reason: "nourishment",
  },
  focused: {
    title: "Foods that boost focus",
    description:
      "Certain foods can help improve your concentration and mental clarity. This often includes foods rich in omega-3s, antioxidants, or steady-release energy sources that keep your brain fueled without crashes.",
    reason: "brain_fuel",
  },
  calm: {
    title: "Foods that promote calmness",
    description:
      "Feeling calm after eating can indicate foods that help regulate your nervous system. This might include foods rich in magnesium, tryptophan, or other nutrients that support relaxation.",
    reason: "nervous_system",
  },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user from JWT
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, period } = await req.json();

    switch (action) {
      case "generate_weekly_insights":
        return await generateWeeklyInsights(supabaseClient, user.id, period);

      case "generate_monthly_insights":
        return await generateMonthlyInsights(supabaseClient, user.id, period);

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function generateWeeklyInsights(
  supabase: any,
  userId: string,
  weekStart: string
) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const { data: foodLogs, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("meal_time", weekStart)
    .lt("meal_time", weekEnd.toISOString())
    .order("meal_time", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch food logs");
  }

  if (!foodLogs || foodLogs.length < 3) {
    return new Response(
      JSON.stringify({
        message:
          "Not enough data for weekly insights. Log at least 3 meals this week.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Generate comprehensive weekly insight
  const allMoods = foodLogs.flatMap((log) => log.moods);
  const moodStats = getMoodStatistics(allMoods);
  const mostCommonMood = findMostCommonMood(allMoods);

  // Generate patterns
  const patterns = generatePatterns(foodLogs, allMoods);

  // Generate educational content based on their most common moods
  const educational = generateEducationalContent(moodStats);

  // Generate statistics
  const statistics = {
    total_meals: foodLogs.length,
    total_mood_entries: allMoods.length,
    mood_statistics: moodStats,
    most_common_mood: mostCommonMood,
    average_moods_per_meal: (allMoods.length / foodLogs.length).toFixed(1),
    days_logged: new Set(foodLogs.map((log) => log.meal_time.split("T")[0]))
      .size,
    meal_timing: analyzeMealTiming(foodLogs),
  };

  const insight: Insight = {
    insight_type: "weekly",
    title: `Week of ${new Date(weekStart).toLocaleDateString()}`,
    description: `You logged ${foodLogs.length} meals this week. You felt ${mostCommonMood} most often (${moodStats[mostCommonMood]} times). ${patterns.summary}`,
    data: {
      statistics,
      patterns,
      educational,
    },
    period_start: weekStart,
    period_end: weekEnd.toISOString().split("T")[0],
  };

  // Save insight to database
  await supabase.from("insights").insert({
    user_id: userId,
    ...insight,
  });

  return new Response(JSON.stringify({ insight }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function generateMonthlyInsights(
  supabase: any,
  userId: string,
  monthStart: string
) {
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  const { data: foodLogs, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("meal_time", monthStart)
    .lt("meal_time", monthEnd.toISOString())
    .order("meal_time", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch food logs");
  }

  if (!foodLogs || foodLogs.length < 10) {
    return new Response(
      JSON.stringify({
        message:
          "Not enough data for monthly insights. Log at least 10 meals this month.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Generate comprehensive monthly insight
  const allMoods = foodLogs.flatMap((log) => log.moods);
  const moodStats = getMoodStatistics(allMoods);
  const mostCommonMood = findMostCommonMood(allMoods);

  // Generate patterns
  const patterns = generatePatterns(foodLogs, allMoods);

  // Generate educational content
  const educational = generateEducationalContent(moodStats);

  // Generate trends (compare first and second half of month)
  const trends = generateTrends(foodLogs);

  // Generate statistics
  const statistics = {
    total_meals: foodLogs.length,
    total_mood_entries: allMoods.length,
    mood_statistics: moodStats,
    most_common_mood: mostCommonMood,
    average_moods_per_meal: (allMoods.length / foodLogs.length).toFixed(1),
    days_logged: new Set(foodLogs.map((log) => log.meal_time.split("T")[0]))
      .size,
    consistency_score: calculateConsistencyScore(foodLogs),
    meal_timing: analyzeMealTiming(foodLogs),
  };

  const insight: Insight = {
    insight_type: "monthly",
    title: `Monthly Summary - ${new Date(monthStart).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    )}`,
    description: `You logged ${foodLogs.length} meals this month with ${statistics.consistency_score}% consistency. You felt ${mostCommonMood} most often. ${patterns.summary} ${trends.summary}`,
    data: {
      statistics,
      patterns,
      educational,
      trends,
    },
    period_start: monthStart,
    period_end: monthEnd.toISOString().split("T")[0],
  };

  // Save insight to database
  await supabase.from("insights").insert({
    user_id: userId,
    ...insight,
  });

  return new Response(JSON.stringify({ insight }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getMoodStatistics(allMoods: string[]): Record<string, number> {
  const moodCounts: Record<string, number> = {};

  allMoods.forEach((mood) => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  return moodCounts;
}

function findMostCommonMood(allMoods: string[]): string {
  const moodCounts = getMoodStatistics(allMoods);
  return Object.entries(moodCounts).reduce((a, b) =>
    moodCounts[a[0]] > moodCounts[b[0]] ? a : b
  )[0];
}

function generatePatterns(
  foodLogs: FoodLog[],
  allMoods: string[]
): Record<string, any> {
  const patterns: Record<string, any> = {};

  // Mood combination patterns
  const moodCombinations: Record<string, number> = {};
  foodLogs.forEach((log) => {
    if (log.moods.length > 1) {
      const sortedMoods = log.moods.sort().join(" + ");
      moodCombinations[sortedMoods] = (moodCombinations[sortedMoods] || 0) + 1;
    }
  });

  const mostCommonCombination = Object.entries(moodCombinations).reduce(
    (a, b) => (moodCombinations[a[0]] > moodCombinations[b[0]] ? a : b)
  );

  if (mostCommonCombination && mostCommonCombination[1] >= 2) {
    patterns.mood_combinations = {
      most_common: mostCommonCombination[0],
      count: mostCommonCombination[1],
      all_combinations: moodCombinations,
    };
  }

  // Food-mood correlation patterns
  const foodMoodMap: Record<string, string[]> = {};
  foodLogs.forEach((log) => {
    if (!foodMoodMap[log.food_name]) {
      foodMoodMap[log.food_name] = [];
    }
    foodMoodMap[log.food_name].push(...log.moods);
  });

  const foodPatterns: Record<string, any> = {};
  for (const [food, allFoodMoods] of Object.entries(foodMoodMap)) {
    if (allFoodMoods.length >= 3) {
      const moodStats = getMoodStatistics(allFoodMoods);
      const mostCommonMood = findMostCommonMood(allFoodMoods);
      const percentage =
        (moodStats[mostCommonMood] / allFoodMoods.length) * 100;

      if (percentage >= 60) {
        foodPatterns[food] = {
          mood: mostCommonMood,
          count: moodStats[mostCommonMood],
          total: allFoodMoods.length,
          percentage: Math.round(percentage),
        };
      }
    }
  }

  if (Object.keys(foodPatterns).length > 0) {
    patterns.food_mood_correlations = foodPatterns;
  }

  // Generate summary
  let summary = "";
  if (patterns.mood_combinations) {
    summary += `You often feel ${patterns.mood_combinations.most_common.replace(
      " + ",
      " and "
    )} together. `;
  }
  if (patterns.food_mood_correlations) {
    const topFood = Object.entries(patterns.food_mood_correlations)[0];
    summary += `${topFood[0]} often makes you feel ${topFood[1].mood}. `;
  }

  patterns.summary = summary.trim();

  return patterns;
}

function generateEducationalContent(
  moodStats: Record<string, number>
): Record<string, any> {
  const educational: Record<string, any> = {};

  // Get top 3 most common moods
  const sortedMoods = Object.entries(moodStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [mood, count] of sortedMoods) {
    if (educationalInsights[mood as keyof typeof educationalInsights]) {
      const insight =
        educationalInsights[mood as keyof typeof educationalInsights];
      educational[mood] = {
        title: insight.title,
        description: insight.description,
        reason: insight.reason,
        frequency: count,
      };
    }
  }

  return educational;
}

function generateTrends(foodLogs: FoodLog[]): Record<string, any> {
  const trends: Record<string, any> = {};

  // Compare first and second half of the month
  const midPoint = Math.floor(foodLogs.length / 2);
  const firstHalf = foodLogs.slice(0, midPoint);
  const secondHalf = foodLogs.slice(midPoint);

  const firstHalfMoods = firstHalf.flatMap((log) => log.moods);
  const secondHalfMoods = secondHalf.flatMap((log) => log.moods);

  const firstHalfStats = getMoodStatistics(firstHalfMoods);
  const secondHalfStats = getMoodStatistics(secondHalfMoods);

  // Compare positive vs negative mood trends
  const positiveMoods = ["energised", "focused", "happy", "satisfied", "calm"];
  const negativeMoods = ["sleepy", "anxious", "sad", "irritable", "sluggish"];

  const firstHalfPositive = Object.entries(firstHalfStats)
    .filter(([mood]) => positiveMoods.includes(mood))
    .reduce((sum, [, count]) => sum + count, 0);

  const secondHalfPositive = Object.entries(secondHalfStats)
    .filter(([mood]) => positiveMoods.includes(mood))
    .reduce((sum, [, count]) => sum + count, 0);

  const firstHalfTotal = Object.values(firstHalfStats).reduce(
    (sum, count) => sum + count,
    0
  );
  const secondHalfTotal = Object.values(secondHalfStats).reduce(
    (sum, count) => sum + count,
    0
  );

  const firstHalfPercentage =
    firstHalfTotal > 0 ? (firstHalfPositive / firstHalfTotal) * 100 : 0;
  const secondHalfPercentage =
    secondHalfTotal > 0 ? (secondHalfPositive / secondHalfTotal) * 100 : 0;

  const difference = secondHalfPercentage - firstHalfPercentage;

  if (Math.abs(difference) > 10) {
    const trend = difference > 0 ? "improved" : "declined";
    trends.mood_trend = {
      direction: trend,
      first_half_percentage: Math.round(firstHalfPercentage),
      second_half_percentage: Math.round(secondHalfPercentage),
      difference: Math.round(difference),
    };
    trends.summary = `Your positive mood experiences ${trend} this month.`;
  } else {
    trends.summary = "Your mood patterns remained consistent this month.";
  }

  return trends;
}

function analyzeMealTiming(foodLogs: FoodLog[]): Record<string, any> {
  const mealHours = foodLogs.map((log) => new Date(log.meal_time).getHours());
  const avgHour =
    mealHours.reduce((sum, hour) => sum + hour, 0) / mealHours.length;

  return {
    average_hour: Math.round(avgHour),
    earliest_meal: Math.min(...mealHours),
    latest_meal: Math.max(...mealHours),
    meal_distribution: {
      breakfast: mealHours.filter((h) => h >= 6 && h < 12).length,
      lunch: mealHours.filter((h) => h >= 12 && h < 17).length,
      dinner: mealHours.filter((h) => h >= 17 && h < 22).length,
      late_night: mealHours.filter((h) => h >= 22 || h < 6).length,
    },
  };
}

function calculateConsistencyScore(foodLogs: FoodLog[]): number {
  const daysWithLogs = new Set(
    foodLogs.map((log) => log.meal_time.split("T")[0])
  ).size;
  const totalDays = 30; // Assuming monthly analysis

  return Math.round((daysWithLogs / totalDays) * 100);
}

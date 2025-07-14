import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Svg, { G, Path, Circle } from "react-native-svg";
import * as d3Shape from "d3-shape";
import { router } from "expo-router";
import { TopBar } from "../components";

const periodTitle = "This Month";
const insights = [
  {
    type: "surprise",
    text: "Interesting – you felt calm every time you had green tea in the afternoon.",
  },
  {
    type: "surprise",
    text: "Something cool: your mood lifted after every home-cooked dinner this week.",
  },
  { type: "positive", text: "Your breakfasts this week led to happy moods." },
  {
    type: "positive",
    text: "You felt energized 8 out of 10 times after protein meals.",
  },
  { type: "gentle", text: "You logged 'anxious' less often this week." },
  { type: "gentle", text: "Large portions often lead to sluggish feelings." },
];
const moodData = [
  { label: "Happy", value: 14, color: "#f7e07a" },
  { label: "Satisfied", value: 12, color: "#b6e3a8" },
  { label: "Sleepy", value: 23, color: "#b3c7f7" },
  { label: "Calm", value: 21, color: "#a8e6e3" },
  { label: "Irritable", value: 10, color: "#f7b6b6" },
  { label: "Anxious", value: 7, color: "#f7d6b6" },
  { label: "Sad", value: 13, color: "#b6b6f7" },
  { label: "Guilty", value: 5, color: "#E6D3E6" },
  { label: "Craving More", value: 6, color: "#E2DDE6" },
];

const moodDetails = {
  Happy: {
    description: "You felt happy mostly after breakfast and light lunches.",
    foods: ["Oatmeal", "Fruit Bowl", "Grilled Chicken Salad"],
    days: ["Monday", "Thursday", "Saturday"],
    stat: "Happiest at 9am and 1pm.",
  },
  Satisfied: {
    description: "Satisfying meals were often home-cooked dinners.",
    foods: ["Stir Fry", "Pasta", "Veggie Bowl"],
    days: ["Tuesday", "Friday"],
    stat: "Most common at 7pm.",
  },
  Sleepy: {
    description:
      " Large or carbohydrate-heavy meals increase insulin, which helps tryptophan enter the brain. Tryptophan is converted into serotonin and then melatonin, both of which promote sleepiness. Additionally, digestion draws blood to the gut and away from the brain, making you feel drowsy.",
    foods: ["Burger", "Pizza", "Rice Bowl"],
    days: ["Wednesday", "Sunday"],
    stat: "Peaked at 3pm and 9pm.",
  },
  Calm: {
    description: "Calm moods were logged after tea and quiet meals.",
    foods: ["Green Tea", "Soup", "Toast"],
    days: ["Monday", "Thursday"],
    stat: "Most often at 4pm.",
  },
  Irritable: {
    description: "Irritability was linked to skipped meals or rushed snacks.",
    foods: ["None", "Granola Bar"],
    days: ["Friday"],
    stat: "Mostly at 11am.",
  },
  Anxious: {
    description: "Anxious moods followed caffeine or sugary snacks.",
    foods: ["Coffee", "Chocolate"],
    days: ["Tuesday", "Saturday"],
    stat: "Peaked at 2pm.",
  },
  Sad: {
    description:
      "Sadness was more common on rainy days and after heavy dinners.",
    foods: ["Stew", "Lasagna"],
    days: ["Sunday"],
    stat: "Most often at 8pm.",
  },
  Guilty: {
    description:
      "Guilty feelings often followed indulgent snacks or late-night treats.",
    foods: ["Ice Cream", "Chips", "Chocolate"],
    days: ["Friday", "Saturday"],
    stat: "Most common at 10pm.",
  },
  "Craving More": {
    description: "You felt like having more after certain meals or snacks.",
    foods: ["Pizza", "Fries", "Pastries"],
    days: ["Wednesday", "Sunday"],
    stat: "Peaked at 4pm and 9pm.",
  },
};

const PieChart = ({
  data,
  size = 140,
  innerRadius = 0,
  onSlicePress,
  selectedLabel,
}) => {
  const pieGen = d3Shape.pie().value((d) => d.value);
  const arcs = pieGen(data);
  const arcGen = d3Shape
    .arc()
    .outerRadius(size / 2)
    .innerRadius(innerRadius);
  const center = size / 2;
  return (
    <Svg width={size} height={size}>
      <G x={center} y={center}>
        {arcs.map((arc, i) => (
          <Path
            key={i}
            d={arcGen(arc)}
            fill={data[i].color}
            stroke={selectedLabel === data[i].label ? "#222" : "#fff"}
            strokeWidth={selectedLabel === data[i].label ? 3 : 2}
            onPress={() => onSlicePress(data[i].label)}
          />
        ))}
      </G>
    </Svg>
  );
};

const groupLabels = {
  surprise: "Surprising Discoveries",
  positive: "Positive Patterns",
  gentle: "Gentle Observations",
};

const MOOD_EMOJIS = {
  Happy: "😊",
  Satisfied: "😌",
  Sleepy: "😴",
  Calm: "🌿",
  Irritable: "😠",
  Anxious: "😰",
  Sad: "😢",
  Guilty: "😳",
  "Craving More": "🍟",
};

const Insights = () => {
  // Group insights by type
  const grouped = insights.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const [expandedMood, setExpandedMood] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);

  const handleSlicePress = (label) => {
    setExpandedMood((prev) => (prev === label ? null : label));
  };

  // Find the max value for scaling bars
  const maxValue = Math.max(...moodData.map((m) => m.value));

  const PIE_CHART_SIZE = 220;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#f8f9fa" }}>
        <TopBar showBack={true} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Grouped insights at the top */}
        {Object.entries(grouped).map(([type, items]) => (
          <View key={type} style={styles.insightsSection}>
            <Text style={styles.groupLabel}>{groupLabels[type]}</Text>
            {items.map((insight, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.insightText}>{insight.text}</Text>
              </View>
            ))}
          </View>
        ))}
        {/* Mood percentages as horizontal bars */}
        <View style={styles.moodStatsListSection}>
          <Text style={styles.statsTitle}>How you felt this period:</Text>
          {moodData.map((mood, idx) => {
            const percent = mood.value;
            const barRatio = mood.value / maxValue;
            const barWidth = `${barRatio * 100}%`;
            const moodKey = mood.label;
            const isHovered = hoveredMood === moodKey;
            const isDimmed = hoveredMood && !isHovered;
            const showTextInside = barRatio > 0.4;
            return (
              <View key={moodKey} style={styles.moodBarRow}>
                <View style={styles.moodBarEmojiCol}>
                  <Text style={styles.moodBarEmoji}>
                    {MOOD_EMOJIS[moodKey] || ""}
                  </Text>
                </View>
                <View style={styles.moodBarBarColFlex}>
                  <View
                    style={[
                      styles.moodBar,
                      {
                        backgroundColor: mood.color,
                        width: barWidth,
                        opacity: isDimmed ? 0.4 : 1,
                      },
                      isHovered && styles.moodBarHovered,
                    ]}
                    onMouseEnter={() => setHoveredMood(moodKey)}
                    onMouseLeave={() => setHoveredMood(null)}
                    onTouchStart={() => setHoveredMood(moodKey)}
                    onTouchEnd={() => setHoveredMood(null)}
                  >
                    {isHovered && showTextInside && (
                      <Text style={styles.moodBarHoveredText}>
                        {moodKey} {percent}%
                      </Text>
                    )}
                  </View>
                  {isHovered && !showTextInside && (
                    <View style={styles.moodBarOutsideTextWrapFlex}>
                      <Text style={styles.moodBarOutsideText}>
                        {moodKey} {percent}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        {/* Large, visually separated pie chart */}
        <View style={styles.pieChartSection}>
          <PieChart
            data={moodData}
            onSlicePress={handleSlicePress}
            selectedLabel={expandedMood}
            size={PIE_CHART_SIZE}
          />
        </View>
        {/* Expandable section for mood details */}
        {expandedMood && (
          <View style={styles.expandedSection}>
            <Text style={styles.expandedTitle}>{expandedMood}</Text>
            <Text style={styles.expandedDesc}>
              {moodDetails[expandedMood].description}
            </Text>
            <Text style={styles.expandedSubhead}>Common foods:</Text>
            <View style={styles.expandedListRow}>
              {moodDetails[expandedMood].foods.map((food, idx) => (
                <Text key={food} style={styles.expandedListItem}>
                  {food}
                  {idx < moodDetails[expandedMood].foods.length - 1 ? ", " : ""}
                </Text>
              ))}
            </View>
            <Text style={styles.expandedSubhead}>Days:</Text>
            <View style={styles.expandedListRow}>
              {moodDetails[expandedMood].days.map((day, idx) => (
                <Text key={day} style={styles.expandedListItem}>
                  {day}
                  {idx < moodDetails[expandedMood].days.length - 1 ? ", " : ""}
                </Text>
              ))}
            </View>
            <Text style={styles.expandedStat}>
              {moodDetails[expandedMood].stat}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#3498db",
    fontWeight: "bold",
  },
  periodTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7f8c8d",
    marginBottom: 6,
    marginTop: 18,
  },
  insightsSection: {
    marginBottom: 8,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 18,
    color: "#7f8c8d",
    marginRight: 8,
    marginTop: 2,
  },
  insightText: {
    fontSize: 15,
    color: "#2c3e50",
    flex: 1,
    lineHeight: 21,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  moodStatsSection: {
    marginLeft: 18,
    flex: 1,
    justifyContent: "center",
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  moodStatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  moodStatText: {
    fontSize: 15,
    color: "#2c3e50",
    marginLeft: 8,
  },
  moodStatPercent: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statsSubtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 8,
  },
  expandedSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  expandedDesc: {
    fontSize: 15,
    color: "#2c3e50",
    marginBottom: 8,
  },
  expandedSubhead: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 6,
    marginBottom: 2,
  },
  expandedListRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  expandedListItem: {
    fontSize: 14,
    color: "#2c3e50",
  },
  expandedStat: {
    fontSize: 14,
    color: "#3498db",
    marginTop: 8,
    fontStyle: "italic",
  },
  moodStatsListSection: {
    marginTop: 18,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pieChartSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  moodBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    minHeight: 32,
  },
  moodBarEmojiCol: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  moodBarBarCol: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  moodBar: {
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
  },
  moodBarHovered: {
    height: 34,
    zIndex: 2,
  },
  moodBarHoveredText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  moodBarOutsideTextWrap: {
    position: "absolute",
    left: "100%",
    top: 0,
    height: 34,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 8,
    backgroundColor: "#2c3e50",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 80,
    maxWidth: 120,
    zIndex: 10,
  },
  moodBarOutsideTextWrapLeft: {
    left: undefined,
    right: "100%",
    marginLeft: 0,
    marginRight: 8,
    alignItems: "flex-end",
  },
  moodBarOutsideText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    maxWidth: 200,
  },
  moodBarPercentCol: {
    width: 48,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  moodBarPercent: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 8,
  },
  moodBarEmoji: {
    fontSize: 20,
  },
  moodBarBarColFlex: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  moodBarOutsideTextWrapFlex: {
    marginLeft: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 80,
    maxWidth: 200,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Insights;

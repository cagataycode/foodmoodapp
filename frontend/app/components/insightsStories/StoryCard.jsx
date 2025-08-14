import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import DonutChart from "./charts/DonutChart";
import StackedBar from "./charts/StackedBar";
import SingleItemDonut from "./charts/SingleItemDonut";
import TrendMini from "./charts/TrendMini";
import BarRow from "./BarRow";
import Chips from "./Chips";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ChartRenderer = ({ chart, secondaryChart, fullscreen }) => {
  const renderChart = () => {
    switch (chart?.type) {
      case "donut":
        return (
          <DonutChart
            data={chart.data}
            centerLabel={chart.centerLabel}
            size={fullscreen ? Math.min(SCREEN_WIDTH - 80, 260) : 200}
          />
        );
      case "stackedBar":
        return (
          <StackedBar categories={chart.categories} series={chart.series} />
        );
      case "singleItemDonut":
        return (
          <SingleItemDonut
            title={chart.dataTitle}
            data={chart.data}
            size={fullscreen ? Math.min(SCREEN_WIDTH - 80, 220) : undefined}
          />
        );
      case "trendMini":
        return <TrendMini data={chart.data} groups={chart.groups} />;
      default:
        return null;
    }
  };

  return (
    <View style={fullscreen ? styles.chartSectionFullscreen : null}>
      {renderChart()}
      {secondaryChart?.type === "barRow" && (
        <BarRow title={secondaryChart.title} data={secondaryChart.data} />
      )}
    </View>
  );
};

const BulletPoints = ({ bullets, fullscreen }) => (
  <View style={fullscreen ? styles.bulletsFullscreen : styles.bullets}>
    {bullets?.slice(0, 3).map((b, idx) => (
      <View key={idx} style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text
          style={fullscreen ? styles.bulletTextFullscreen : styles.bulletText}
        >
          {b}
        </Text>
      </View>
    ))}
  </View>
);

const CaptionSection = ({ caption, caption_science, fullscreen }) => (
  <>
    {caption && (
      <Text style={fullscreen ? styles.captionFullscreen : styles.caption}>
        {caption}
      </Text>
    )}
    {caption_science && (
      <Text
        style={
          fullscreen ? styles.captionScienceFullscreen : styles.captionScience
        }
      >
        {caption_science} (See: SCIENTIFIC BREAKDOWN.PDF)
      </Text>
    )}
  </>
);

const StoryCard = ({ page, fullscreen = false }) => {
  const palette = page?.palette || {};
  const isFullscreen = fullscreen;

  return (
    <View
      style={[
        isFullscreen ? styles.fullscreen : styles.card,
        { backgroundColor: palette.background || "#fff" },
      ]}
    >
      {isFullscreen ? (
        <View style={styles.innerFullscreen}>
          <View style={styles.headerSection}>
            <Text
              style={[
                styles.titleFullscreen,
                { color: palette.text || "#0F172A" },
              ]}
            >
              {page.title}
            </Text>
            {page.subtitle && (
              <Text
                style={[
                  styles.subtitleFullscreen,
                  { color: palette.text || "#0F172A" },
                ]}
              >
                {page.subtitle}
              </Text>
            )}
            <BulletPoints bullets={page.bullets} fullscreen={true} />
          </View>

          <ChartRenderer
            chart={page.chart}
            secondaryChart={page.secondaryChart}
            fullscreen={true}
          />

          <View style={styles.footerSection}>
            {page.chips?.length > 0 && <Chips items={page.chips} />}
            <CaptionSection
              caption={page.caption}
              caption_science={page.caption_science}
              fullscreen={true}
            />
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.title, { color: palette.text || "#0F172A" }]}>
            {page.title}
          </Text>
          {page.subtitle && (
            <Text
              style={[styles.subtitle, { color: palette.text || "#0F172A" }]}
            >
              {page.subtitle}
            </Text>
          )}
          <BulletPoints bullets={page.bullets} fullscreen={false} />
          <ChartRenderer
            chart={page.chart}
            secondaryChart={page.secondaryChart}
            fullscreen={false}
          />
          {page.chips?.length > 0 && <Chips items={page.chips} />}
          <CaptionSection
            caption={page.caption}
            caption_science={page.caption_science}
            fullscreen={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  fullscreen: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 0,
    paddingTop: 88,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  innerFullscreen: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    flex: 1,
  },
  headerSection: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "800" },
  titleFullscreen: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 13, opacity: 0.8, marginTop: 2, marginBottom: 8 },
  subtitleFullscreen: {
    fontSize: 14,
    opacity: 0.85,
    marginTop: 4,
    marginBottom: 10,
  },
  bullets: { marginVertical: 8 },
  bulletsFullscreen: { marginTop: 8, marginBottom: 12 },
  bulletRow: { flexDirection: "row", marginBottom: 6 },
  bulletDot: { marginRight: 6, color: "#6B7280" },
  bulletText: { flex: 1, color: "#111827" },
  bulletTextFullscreen: {
    flex: 1,
    color: "#111827",
    fontSize: 16,
    lineHeight: 22,
  },
  chartSectionFullscreen: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  footerSection: { marginTop: 10 },
  caption: { fontSize: 11, color: "#6B7280", marginTop: 10 },
  captionFullscreen: { fontSize: 12, color: "#4B5563", marginTop: 12 },
  captionScience: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  captionScienceFullscreen: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 6,
    fontStyle: "italic",
  },
});

export default StoryCard;

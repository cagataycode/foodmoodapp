import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import DonutChart from "./charts/DonutChart";
import StackedBar from "./charts/StackedBar";
import SingleItemDonut from "./charts/SingleItemDonut";
import TrendMini from "./charts/TrendMini";
import BarRow from "./BarRow";
import Chips from "./Chips";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const StoryCard = ({ page, fullscreen = false }) => {
  const palette = page?.palette || {};
  return (
    <View
      style={[
        fullscreen ? styles.fullscreen : styles.card,
        { backgroundColor: palette.background || "#fff" },
      ]}
    >
      {fullscreen ? (
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
            {page.subtitle ? (
              <Text
                style={[
                  styles.subtitleFullscreen,
                  { color: palette.text || "#0F172A" },
                ]}
              >
                {page.subtitle}
              </Text>
            ) : null}
            <View style={styles.bulletsFullscreen}>
              {page.bullets?.slice(0, 3).map((b, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletTextFullscreen}>{b}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.chartSectionFullscreen}>
            {page.chart?.type === "donut" && (
              <DonutChart
                data={page.chart.data}
                centerLabel={page.chart.centerLabel}
                size={Math.min(SCREEN_WIDTH - 80, 260)}
              />
            )}
            {page.chart?.type === "stackedBar" && (
              <StackedBar
                categories={page.chart.categories}
                series={page.chart.series}
              />
            )}
            {page.chart?.type === "singleItemDonut" && (
              <SingleItemDonut
                title={page.chart.dataTitle}
                data={page.chart.data}
                size={Math.min(SCREEN_WIDTH - 80, 220)}
              />
            )}
            {page.chart?.type === "trendMini" && (
              <TrendMini data={page.chart.data} groups={page.chart.groups} />
            )}
            {page.secondaryChart?.type === "barRow" && (
              <BarRow
                title={page.secondaryChart.title}
                data={page.secondaryChart.data}
              />
            )}
          </View>

          <View style={styles.footerSection}>
            {page.chips?.length ? <Chips items={page.chips} /> : null}
            {page.caption ? (
              <Text style={styles.captionFullscreen}>{page.caption}</Text>
            ) : null}
            {page.caption_science ? (
              <Text style={styles.captionScienceFullscreen}>
                {page.caption_science} (See: SCIENTIFIC BREAKDOWN.PDF)
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.title, { color: palette.text || "#0F172A" }]}>
            {page.title}
          </Text>
          {page.subtitle ? (
            <Text
              style={[styles.subtitle, { color: palette.text || "#0F172A" }]}
            >
              {page.subtitle}
            </Text>
          ) : null}
          <View style={styles.bullets}>
            {page.bullets?.slice(0, 3).map((b, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
          {page.chart?.type === "donut" && (
            <DonutChart
              data={page.chart.data}
              centerLabel={page.chart.centerLabel}
              size={200}
            />
          )}
          {page.chart?.type === "stackedBar" && (
            <StackedBar
              categories={page.chart.categories}
              series={page.chart.series}
            />
          )}
          {page.chart?.type === "singleItemDonut" && (
            <SingleItemDonut
              title={page.chart.dataTitle}
              data={page.chart.data}
            />
          )}
          {page.chart?.type === "trendMini" && (
            <TrendMini data={page.chart.data} groups={page.chart.groups} />
          )}
          {page.secondaryChart?.type === "barRow" &&
          page.secondaryChart?.data?.length ? (
            <BarRow
              title={page.secondaryChart.title}
              data={page.secondaryChart.data}
            />
          ) : null}
          {page.chips?.length ? <Chips items={page.chips} /> : null}
          {page.caption ? (
            <Text style={styles.caption}>{page.caption}</Text>
          ) : null}
          {page.caption_science ? (
            <Text style={styles.captionScience}>
              {page.caption_science} (See: SCIENTIFIC BREAKDOWN.PDF)
            </Text>
          ) : null}
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
  headerSection: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  titleFullscreen: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: 2,
    marginBottom: 8,
  },
  subtitleFullscreen: {
    fontSize: 14,
    opacity: 0.85,
    marginTop: 4,
    marginBottom: 10,
  },
  bullets: {
    marginVertical: 8,
  },
  bulletsFullscreen: {
    marginTop: 8,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletDot: {
    marginRight: 6,
    color: "#6B7280",
  },
  bulletText: {
    flex: 1,
    color: "#111827",
  },
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
  footerSection: {
    marginTop: 10,
  },
  caption: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 10,
  },
  captionFullscreen: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 12,
  },
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

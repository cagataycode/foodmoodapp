import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";
import * as d3Shape from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { format } from "d3-format";

const DEFAULT_COLORS = [
  "#60A5FA",
  "#34D399",
  "#F59E0B",
  "#A78BFA",
  "#22D3EE",
  "#F472B6",
];

const DonutChart = ({
  data,
  size = 200,
  innerRadius = 70,
  centerLabel,
  colors = DEFAULT_COLORS,
  showLegend = false,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const center = size / 2;

  const colorScale = scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(colors);

  const pieGen = d3Shape
    .pie()
    .sort(null)
    .padAngle((Math.PI / 180) * 2)
    .value((d) => d.value);
  const arcs = pieGen(data);

  const arcGen = d3Shape
    .arc()
    .outerRadius(size / 2)
    .innerRadius(innerRadius)
    .cornerRadius(6);

  const percent = (v) => format(".0%")((v || 0) / total);

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        <G x={center} y={center}>
          {arcs.map((arc, i) => (
            <Path
              key={data[i].label + i}
              d={arcGen(arc)}
              fill={data[i].color || colorScale(data[i].label)}
              stroke="#fff"
              strokeWidth={1.5}
            />
          ))}
          <Circle cx={0} cy={0} r={innerRadius - 2} fill="#fff" />
          {centerLabel ? (
            <SvgText
              x={0}
              y={-2}
              fill="#111827"
              fontSize={13}
              fontWeight="700"
              textAnchor="middle"
            >
              {centerLabel}
            </SvgText>
          ) : null}
          {data && data.length > 0 ? (
            <SvgText
              x={0}
              y={16}
              fill="#6B7280"
              fontSize={11}
              textAnchor="middle"
            >
              {`${percent(data[0].value)} ${data[0].label}`}
            </SvgText>
          ) : null}
        </G>
      </Svg>
      {showLegend && (
        <View style={styles.legendWrap}>
          {data.map((d) => (
            <View key={d.label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  { backgroundColor: d.color || colorScale(d.label) },
                ]}
              />
              <Text style={styles.legendText} numberOfLines={1}>
                {d.label} {percent(d.value)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  legendWrap: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
  },
  legendSwatch: { width: 10, height: 10, borderRadius: 2, marginRight: 6 },
  legendText: { fontSize: 12, color: "#374151", maxWidth: 120 },
});

export default DonutChart;

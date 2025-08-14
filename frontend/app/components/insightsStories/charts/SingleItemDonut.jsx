import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";
import * as d3Shape from "d3-shape";
import { format } from "d3-format";

const SingleItemDonut = ({
  data = [],
  size = 160,
  innerRadius = 54,
  title,
}) => {
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
  const center = size / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const fmt = format(".0%");
  const primary = data[0];

  return (
    <View style={[styles.container, { paddingHorizontal: 8 }]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Svg width={size} height={size}>
        <G x={center} y={center}>
          {arcs.map((arc, i) => (
            <Path
              key={i}
              d={arcGen(arc)}
              fill={data[i].color || "#60A5FA"}
              stroke="#fff"
              strokeWidth={1.5}
            />
          ))}
          <Circle cx={0} cy={0} r={innerRadius - 2} fill="#fff" />
          <SvgText
            x={0}
            y={-2}
            fill="#111827"
            fontSize={14}
            fontWeight="700"
            textAnchor="middle"
          >
            {primary ? fmt(primary.value / total) : fmt(0)}
          </SvgText>
          <SvgText
            x={0}
            y={16}
            fill="#6B7280"
            fontSize={11}
            textAnchor="middle"
          >
            {primary?.label || ""}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "600",
  },
});

export default SingleItemDonut;

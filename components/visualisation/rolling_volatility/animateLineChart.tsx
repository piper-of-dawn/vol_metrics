'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useSpring, animated } from "@react-spring/web";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
import { RollingVolData } from "../../../typing/linechart";
import { Yaldevi } from "next/font/google";
import { calculateStatistics } from "@/scripts/get_box_plot_stats";

type LineChartProps = {
  width: number;
  height: number;
  data: RollingVolData[];

};

export const LineChart = ({
  width,
  height,
  data,

}: LineChartProps) => {
  const x = data.map((d) => d.date);
  const y = data.map((d) => d.rolling_vol);
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, Math.max(...y)]).range([boundsHeight, 0]);
  }, [data, height]);

  const xScale = useMemo(() => {
    return d3.scaleTime().domain([Math.min(...x.map(date => +date)), Math.max(...x.map(date => +date))]).range([0, boundsWidth]);
  }, [data, width]);


  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  const lineBuilder = d3
    .line<RollingVolData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.rolling_vol));
  
  
    const linePath = lineBuilder(data);

  if (!linePath) {
    return null;
  }

  return (
    <div>
      <svg width={width} height={height}>
        {/* first group is lines */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <LineItem
            path={linePath}
            color="#000000"
                     
          />
        </g>
        {/* Second is for the axes */}
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};

type LineItemProps = {
  path: string;
  color: string;
};

function LineItem({ path, color }: LineItemProps) {
    const springProps = useSpring({
        to: {
            path,
            color,
        },
        config: {
            friction: 100,
        },
    });

    return (
        <animated.path
            d={springProps.path}
            fill={"none"}
            stroke={color}
            strokeWidth={2} />
    );
}

import React from "react"; // {{ edit_1 }}
import {useMemo} from "react";
import * as d3 from "d3";
import {addLine, addText, AxisBottom} from '../visualisation_utils/shapes';
import '../../public/styles.css';


type DataPoint = { x: number; y: number };
type SparkLineProps = {
  width: number;
  height: number;
  data: DataPoint[];
};

export const SparkLine = ({ width, height, data}: SparkLineProps) => {
  const boundsWidth = width 
  const boundsHeight = height

  
  // Y axis
  const [min, max] = d3.extent(data, (d) => d.y);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.x) as [number, number];
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin || 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y)).curve(d3.curveCatmullRom.alpha(0.5));
  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg border bg-card text-card-foreground shadow-sm p-4 h-fit">
      <h1 className="ml-7">Title</h1>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1d" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <g
          width={boundsWidth}
          height={boundsHeight}
        >
       <path
  d={`
    ${linePath} 
    L ${xScale(data[data.length - 1].x)}, ${yScale(0)} 
    L ${xScale(data[0].x)}, ${yScale(0)} 
    Z
  `}
  fill="url(#lineGradient)"
  strokeOpacity={0.0}
/>

    <path
        d={linePath}
        stroke="#221f21"
        strokeWidth={0.75}
        fill="none"
      />
    

        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
        />
      </svg>

    </div>
  );
};

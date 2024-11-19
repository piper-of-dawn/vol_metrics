import {useMemo} from "react";
import * as d3 from "d3";
import {addLine, addText, AxisBottom} from '../visualisation_utils/shapes';
import '../../public/styles.css';
const MARGIN = { top: 28, right: 28, bottom: 50, left: 50 };

type DataPoint = { x: number; y: number };
type LineChartProps = {
  width: number;
  height: number;
  last_5_days_vol: number[];
  data: DataPoint[];
};

export const LineChart = ({ width, height, data, last_5_days_vol}: LineChartProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  
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
    <div className="w-1/2">
      <h1 className="ml-7">Title</h1>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1d" stopOpacity={0.8} />
            <stop offset="70%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <path
            d={linePath}
            fillOpacity={0.3}
            fill="url(#lineGradient)"
            stroke="#221f21"
            strokeWidth={0.75}
            strokeOpacity={1.0}
          />
          {
          last_5_days_vol.map((vol, i) => (
            <>
              {addLine({key: `Line ${i}`, x1: xScale(vol), x2: xScale(vol), y1: 0, y2: boundsHeight, stroke: "#1b222c", opacity: (i + 1) / 5, strokeWidth: 0.5})}
              {i === last_5_days_vol.length-1 && addText({x: xScale(vol), y:  -5, content: "We are here", color: "#1b222c", textAnchor: 'middle', fontSize: 10})}
            </>
          ))
          
          }
            <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom
            xScale={xScale}
            pixelsPerTick={40}
            height={boundsHeight}
          />
        </g>
  

        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
               transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>

    </div>
  );
};

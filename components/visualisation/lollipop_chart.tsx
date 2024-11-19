import * as d3 from 'd3';
import { useMemo } from 'react';
import {addCircle, addLine, addText, addYGrid} from '../visualisation_utils/shapes';
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short'
  }).replace(' ', '-');
};

interface DataPoint {
  date: Date;
  vol: number;  // or whatever properties you have
}

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
type LollipopProps = {
  width: number;
  height: number;
  data: DataPoint[];
};


export const Lollipop = ({ width, height, data }: LollipopProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const x = data.sort((a: DataPoint, b: DataPoint) => a.date.getTime() - b.date.getTime());


  const xScale = useMemo(() => {
    return d3.scaleBand().domain(data.map(d => d.date.toISOString())).range([0, boundsWidth]);
  }, [data, width]);

  const yScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d: DataPoint) => d.vol));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([boundsHeight, 0]);
  }, [data, height]);


  const opacityScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d: DataPoint) => d.vol));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0.7, 1]);
  }, [data, height]);


  for (const dataPoint in data) {

  }

  const allShapes = data.map((d: DataPoint, i) => {
    const xValue = xScale(d.date.toISOString());
    const x = xValue !== undefined ? xValue + xScale.bandwidth() / 2 : 0;
    return (
      <g key={i}>
        {addLine({
          key: `line-${i}`,
          x1: x,
          y1: yScale(d.vol),
          y2: boundsHeight,
          x2: x,
          opacity: opacityScale(d.vol),
          stroke: "#221f21",
          strokeWidth: 0.75
        })}
        {addCircle({
          x: x,
          y: yScale(d.vol),
          color: "#221f21",
          radius: 1,
          opacity: opacityScale(d.vol),
        })}

        { i > data.length - 5 && addText({
            x: x + 3,
            y: yScale(d.vol),
            content: formatDate(d.date),
            color : "#bbbbbb",
            textAnchor: 'start',
            fontSize: 8,
          }) }
            
      </g>
    );
  });


  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >

          {addYGrid({
            ticksCount: 7,
            scale: yScale,
            boundsWidth: boundsWidth
          })}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
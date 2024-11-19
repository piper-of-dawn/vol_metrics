import { useMemo } from 'react';
import { ScaleLinear } from 'd3';

export function addCircle({
  x,
  y,
  radius = 3,
  color = "#1b222c",
  opacity = 1,
  strokeWidth = 1,
}: {
  x: number;
  y: number;
  radius?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      opacity={opacity}
      stroke={color}
      fill={color}
      strokeWidth={strokeWidth}
      r={radius}
    />
  );
}

export function addLine({
    key,
  x1,
  y1,
  y2,
  x2,
  opacity = 1,
  stroke = "#1b222c",
  strokeWidth = 1,
}: {
    key: string;
  x1: number;
  y1: number;
  y2: number;
  x2: number;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}) {``
  return (
    <line
    key = {key}
      x1={x1}
      y1={y1}
      y2={y2}
      x2={x2}
      opacity={opacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export function addText({
  x,
  y,
  content,
  textAnchor = 'end',
  fontSize = 10,
  fontFamily = 'monospace',
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
  color = '#000000',
}: {
  x: number;
  y: number;
  content: string;
  textAnchor?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  color?: string;
}) {
  return (
    <text
      x={x + offsetX}  // Adjusted for offsetX
      y={y + offsetY}  
      textAnchor={textAnchor}
      fontSize={fontSize}
      fontFamily={fontFamily}
      transform={`rotate(${rotation}, ${x}, ${y})`}
      fill={color}
    >
      {content}
    </text>
  );
}

export function addYGrid({
    scale,
    boundsWidth,
    ticksCount = 5,
    color = "#808080",
    stroke = "#808080",
    opacity = 0.2,
    fontSize = 9,
    textOffset = 10,
  }: {
    scale: d3.ScaleLinear<number, number>;
    boundsWidth: number;
    ticksCount?: number;
    color?: string;
    stroke?: string;
    opacity?: number;
    fontSize?: number;
    textOffset?: number;
  }) {
    return scale.ticks(ticksCount).slice(1).map((value, i) => (
      <g key={i}>
        <line
          x1={0}
          x2={boundsWidth}
          y1={scale(value)}
          y2={scale(value)}
          stroke={stroke}
          opacity={opacity}
        />
        <text
          y={scale(value)}
          x={boundsWidth + textOffset}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={fontSize}
          color={color}
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));
  }




type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  height: number;
};

// tick length
const TICK_LENGTH = 4;

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  height,
}: AxisBottomProps) => {
  const range = xScale.range();
  const width = range[1] - range[0];

  const ticks = useMemo(() => {
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale]);

  return (
    <>
      <line
        y1={0}
        y2={0}
        x1={0}
        x2={width}
        stroke="#D2D7D3"
        strokeWidth={0.5}
        shapeRendering={'crispEdges'}
      />
      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line
            y1={0}
            y2={TICK_LENGTH}
            stroke="#D2D7D3"
            strokeWidth={0.5}
            shapeRendering={'crispEdges'}
          />

          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
              fill: 'black',
              
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

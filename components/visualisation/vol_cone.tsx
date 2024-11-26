"use client"
import React from 'react';
import { useMemo } from 'react';
import * as d3 from "d3";
import { Group } from '@visx/group';
import { ViolinPlot, BoxPlot } from '@visx/stats';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Stats } from '@visx/mock-data/lib/generators/genStats';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@visx/pattern';
import '../../public/styles.css';


// const DATA = await getDataPayloadFromFirebase('aapl');





// accessors
const x = (d: Stats) => d.boxPlot.x;
const min = (d: Stats) => d.boxPlot.min;
const max = (d: Stats) => d.boxPlot.max;
const median = (d: Stats) => d.boxPlot.median;
const firstQuartile = (d: Stats) => d.boxPlot.firstQuartile;
const thirdQuartile = (d: Stats) => d.boxPlot.thirdQuartile;
const outliers = (d: Stats) => d.boxPlot.outliers;

interface TooltipData {
  name?: string;
  min?: number;
  median?: number;
  max?: number;
  firstQuartile?: number;
  thirdQuartile?: number;
}

export type StatsPlotProps = {
  width: number;
  height: number;
  data: Stats[];
};

export default withTooltip<StatsPlotProps, TooltipData>(
  ({
    width,
    height,
    data,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    showTooltip,
    hideTooltip,
  }: StatsPlotProps & WithTooltipProvidedProps<TooltipData>) => {
    // bounds
    const xMax = width;
    const yMax = height - 120;

    // scales
    const xScale = scaleBand<string>({
      range: [0, xMax],
      round: true,
      domain: data.map(x),
      padding: 0.4,
    });

    const values = data.reduce((allValues, { boxPlot }) => {
      allValues.push(boxPlot.min, boxPlot.max);
      return allValues;
    }, [] as number[]);
    const minYValue = Math.min(...values);
    const maxYValue = Math.max(...values);

    const yScale = scaleLinear<number>({
      range: [yMax, 0],
      round: true,
      domain: [minYValue, maxYValue],
    });

    const boxWidth = xScale.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);

    return width < 10 ? null : (
      <div style={{ position: 'relative' }} >
        <svg width={width} height={height} className='glassmorphic'>
          {/* <LinearGradient id="statsplot" to="#ffffff" from="#000000" /> */}
          <rect x={0} y={0} width={width} height={height} fill="url(#statsplot)" rx={14} />
          <PatternLines
            id="hViolinLines"
            height={3}
            width={3}
            stroke="#D3D3D3"
            strokeWidth={1}
            orientation={['horizontal']}
          />
          <Group top={40}>
            {data.map((d: Stats, i) => (
              <g key={i}>
                <ViolinPlot
                  data={d.binData}
                  stroke="#D3D3D3"
                  left={xScale(x(d))!}
                  width={constrainedWidth}
                  valueScale={yScale}
                  fill="url(#hViolinLines)"
                />
                <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  left={xScale(x(d))! + 0.3 * constrainedWidth}
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={constrainedWidth * 0.4}
                  fill="#A8A9AF"
                  fillOpacity={0.3}
                  stroke="#A8A9AF"
                  strokeWidth={2}
                  valueScale={yScale}
                  outliers={outliers(d)}
                  minProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(min(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          min: min(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  maxProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(max(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          max: max(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  boxProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(median(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          ...d.boxPlot,
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                  medianProps={{
                    style: {
                      stroke: "#A8A9AF",
                    },
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(median(d)) ?? 0 + 40,
                        tooltipLeft: xScale(x(d))! + constrainedWidth + 5,
                        tooltipData: {
                          median: median(d),
                          name: x(d),
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                />
              </g>
            ))}
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
          >
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {tooltipData.max && <div>max: {tooltipData.max}</div>}
              {tooltipData.thirdQuartile && <div>third quartile: {tooltipData.thirdQuartile}</div>}
              {tooltipData.median && <div>median: {tooltipData.median}</div>}
              {tooltipData.firstQuartile && <div>first quartile: {tooltipData.firstQuartile}</div>}
              {tooltipData.min && <div>min: {tooltipData.min}</div>}
            </div>
          </Tooltip>
        )}
      </div>
    );
  },
);

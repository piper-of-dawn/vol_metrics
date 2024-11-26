// Import d3-array for efficient statistical calculations
import { deviation } from 'd3-array';
import { TEST_DATA } from "../testing/test_data.mjs";
import { sum } from 'd3'
import { dataPayload, VolatilityMeasure } from '@/typing/firebase';
import { calculateStatistics } from "@/scripts/get_box_plot_stats";
import genStats, { Stats } from '@visx/mock-data/lib/generators/genStats';
import * as d3 from 'd3';
type APIPayload = {
    date: string;
    annualized_volatility: number;
    quantile: number;
}

export function construct_rolling_vol_array (data: APIPayload[], window_size: number) {
    const vol_array = TEST_DATA.map(d => d.annualized_volatility);
    const rolling_vol = rollingStdDevTyped(vol_array, window_size);
    return data.map((d, i) => ({
        'date': new Date(d.date),
        'rolling_vol': rolling_vol[i] !== null ? rolling_vol[i] : 0
    }));
}

/**
 * Calculates rolling standard deviation for an array with given window size
 * @param {number[]} data - Input array of numbers
 * @param {number} windowSize - Size of the rolling window
 * @returns {(number|null)[]} Array of rolling standard deviations
 */

export function rollingStdDevTyped(data: number [], windowSize: number) {
    const result = new Float64Array(data.length); // Fill with -1 by default
    const window = new Float64Array(windowSize);

    for (let i = 0; i < windowSize; i++) {
        if (i < data.length) {
            window[i] = data[i];
        }
    }

    for (let i = windowSize - 1; i < data.length; i++) {
        result[i] = deviation(window) || 0.0;
        if (i < data.length - 1) {
            window.copyWithin(0, 1);
            window[windowSize - 1] = data[i + 1];
        }
    }

    return result;
}




export function stdForWindow(array: number[] , windowSize: number ): Float64Array {
    const result = new Float64Array(array.length);
    const window = new Float64Array(windowSize);
    const variance = array.map(x => x * x);
  
    for (let i = 0; i < windowSize; i++) {
        if (i < variance.length) {
            window[i] = variance[i];
        }
    }
  
    for (let i = windowSize - 1; i < variance.length; i++) {
        result[i] = Math.sqrt(sum(window)) || 0.0;
        if (i < variance.length - 1) {
            window.copyWithin(0, 1);
            window[windowSize - 1] = variance[i + 1];
        }
    }
    return result.filter(Boolean);
  }



export function getCleanedDataForVolCone (DATA: dataPayload) {
    const array = DATA.vol_array.data.map((d: VolatilityMeasure) => d.annualized_volatility);
    const windowSizes = [5, 25, 60, 90, 150];
    const memoizedRollingVolArrays = () => {
        return windowSizes.map(size => Array.from(stdForWindow(array, size)) as number[]);
    }; 
  
    const processBinnedData = (dataArray: any[]) => {
        const std = d3.deviation(dataArray) as number;
        const bin1 = d3.bin().thresholds(12);
        const binnedData = bin1(dataArray).map(d => ({ "value": d.x0 || 0, "count": d.length }));
  
        // Calculate min and max from the original dataArray
        const min = d3.min(dataArray) as number;
        const max = d3.max(dataArray) as number;
  
        // Pad with min - std and max + std
        const paddedData = [
            { "value": min - std, "count": 0 },
            ...binnedData,
            { "value": max + std, "count": 0 }
        ];
  
        return paddedData;
    };
  const t = memoizedRollingVolArrays();
  const data: Stats[]= t.map((d,i)=>({'boxPlot': calculateStatistics(d, `Statistics ${i}`),'binData': processBinnedData(d)}));
  return data;
  }
  
'use client'
import { useMemo, useState } from "react";
import { TEST_DATA } from "../../../testing/test_data.mjs";
import { LineChart } from "./animateLineChart";
import { rollingStdDevTyped } from '../../../scripts/stats'
import { RollingVolData } from "../../../typing/linechart";
const BUTTONS_HEIGHT = 50;

type LineChartDatasetTransitionProps = {
  width: number;
  height: number;
};

type APIPayload = {
    date: string;
    annualized_volatility: number;
    quantile: number;
}

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "4px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};

function construct_rolling_vol_array (data: APIPayload[], window_size: number) {
    const vol_array = TEST_DATA.map(d => d.annualized_volatility);
    const rolling_vol = rollingStdDevTyped(vol_array, window_size);
    return data.map((d, i) => ({
        'date': new Date(d.date),
        'rolling_vol': rolling_vol[i] !== null ? rolling_vol[i] : 0
    }));
}

export function RollingVolDataLineChart({
    width, height,
}: LineChartDatasetTransitionProps) {
    const windowSizes = [5, 10, 20, 25]; // Define the array of window sizes
    const memoizedRollingVolArrays = useMemo(() => {
        return windowSizes.map(size => construct_rolling_vol_array(TEST_DATA, size));
    }, []); // Memoize only on the first render

    const [array, setArray] = useState<RollingVolData[]>(memoizedRollingVolArrays[0]); // Initialize with the first array
    

    return (
        <div>
            <div style={{ height: BUTTONS_HEIGHT }}>
                <button style={buttonStyle} onClick={() => setArray(
                    memoizedRollingVolArrays[0]
                )}>
                    5
                </button>
                <button style={buttonStyle} onClick={() => setArray(
                    memoizedRollingVolArrays[1]
                )}>
                10
                </button>
                <button style={buttonStyle} onClick={() => setArray(
                    memoizedRollingVolArrays[2]
                )}>
                20
                </button>
                <button style={buttonStyle} onClick={() => setArray(
                    memoizedRollingVolArrays[3]
                )}>
                25
                </button>
            </div>
            <LineChart
                width={width}
                height={height - BUTTONS_HEIGHT}
                data={array ?? []}
     />
        </div>
    );
}

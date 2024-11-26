type Statistics = {
  x: string;
  min: number;
  firstQuartile: number;
  median: number;
  thirdQuartile: number;
  max: number;
  outliers: number[];
};

export function calculateStatistics(arr: number[], label: string = "Statistics 0"): Statistics {
  if (arr.length === 0) {
    throw new Error("Array cannot be empty.");
  }

  // Sort the array
  const sorted = [...arr].sort((a, b) => a - b);

  // Helper function to calculate percentiles
  const percentile = (data: number[], p: number): number => {
    const index = (data.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (lower === upper) return data[lower];
    return data[lower] * (1 - weight) + data[upper] * weight;
  };

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const firstQuartile = percentile(sorted, 0.25);
  const median = percentile(sorted, 0.5);
  const thirdQuartile = percentile(sorted, 0.75);

  // Interquartile range (IQR)
  const iqr = thirdQuartile - firstQuartile;
  const lowerFence = firstQuartile - 1.5 * iqr;
  const upperFence = thirdQuartile + 1.5 * iqr;

  // Identify outliers
  const outliers = arr.filter((value) => value < lowerFence || value > upperFence);

  return {
    x: label,
    min,
    firstQuartile,
    median,
    thirdQuartile,
    max,
    outliers,
  };
}



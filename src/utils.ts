export function calculateMovingAverage(
  prices: number[],
  window: number
): number[] {
  if (window > prices.length) {
    throw new Error(
      'Window size cannot be larger than the length of the price array.'
    );
  }

  const movingAverages: number[] = [];

  for (let i = window - 1; i < prices.length; i++) {
    const sum = prices
      .slice(i - window + 1, i + 1)
      .reduce((acc, cur) => acc + cur, 0);
    const movingAverage = sum / window;
    movingAverages.push(movingAverage);
  }

  for (let i = 0; i < window; i++) {
    // @ts-ignore
    movingAverages.unshift(undefined);
  }

  return movingAverages;
}

export function calculateRSI(prices: number[], window: number): number[] {
  const gains: number[] = [];
  const losses: number[] = [];
  let rsis: number[] = [];

  // Calculate the gains and losses for each day
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      gains.push(diff);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(diff));
    }
  }

  // Calculate the average gains and losses for the window period
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < window; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  avgGain /= window;
  avgLoss /= window;

  // Calculate the initial RSI value
  let rs = avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);
  rsis.push(rsi);

  // Calculate the subsequent RSI values
  for (let i = window; i < prices.length; i++) {
    const prevGain = gains[i - 1];
    const prevLoss = losses[i - 1];
    const currGain = gains[i];
    const currLoss = losses[i];
    avgGain = ((window - 1) * avgGain + currGain) / window;
    avgLoss = ((window - 1) * avgLoss + currLoss) / window;
    rs = avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);
    rsis.push(rsi);
  }

  for (let i = 0; i < window; i++) {
    // @ts-ignore
    rsis.unshift(undefined);
  }

  return rsis;
}

export function calculateDailyBalance(
  start: number,
  end: number,
  prices: number[],
  initialBalance: number,
  leverage = 1
) {
  const dailyBalances: number[] = [initialBalance];
  let j = 1;

  for (let i = start + 1; i < end; i++) {
    const dailyReturn = calculateReturn(prices[i - 1], prices[i]);
    const previousBalance = dailyBalances[j - 1];
    j++;
    const currentBalance = previousBalance * (1 + dailyReturn * leverage);
    dailyBalances.push(currentBalance);
  }

  return dailyBalances;
}

export function findClosestDateIndex(
  dates: string[],
  targetDate: string
): number | null {
  // Convert target date to a Date object
  const targetDateTime = new Date(targetDate).getTime();

  // Initialize closest date index and difference to Infinity
  let closestIndex = null;
  let closestDiff = Infinity;

  // Loop through dates and find closest date
  for (let i = 0; i < dates.length; i++) {
    // Convert current date to a Date object
    const currentDateTime = new Date(dates[i]).getTime();

    // Calculate difference between target and current date
    const diff = Math.abs(targetDateTime - currentDateTime);

    // Update closest date index and difference if necessary
    if (diff < closestDiff) {
      closestIndex = i;
      closestDiff = diff;
    }
  }

  // Return closest date index
  return closestIndex;
}

export function calculateReturn(previousPrice: number, currentPrice: number) {
  return (currentPrice - previousPrice) / previousPrice;
}

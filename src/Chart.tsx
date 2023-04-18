import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  calculateDailyBalance,
  calculateMovingAverage,
  calculateRSI,
  findClosestDateIndex,
} from './utils';
import { stockData } from './sp500_data';
import { algo } from './algos';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SP500Graph: React.FC = () => {
  const initialBalance = 30000;
  const dates = stockData.map((s) => s.date);

  const sp500Prices = stockData.map((s) => s.sp500);
  const bonds = stockData.map((s) => s.bond);

  const start = findClosestDateIndex(dates, '1/11/1990') as number;
  const end = findClosestDateIndex(dates, '10/11/1995') as number;

  const buyHold = calculateDailyBalance(
    start,
    end,
    sp500Prices,
    initialBalance
  );

  const leverage = 2.6;

  const buyHold2x = calculateDailyBalance(
    start,
    end,
    sp500Prices,
    initialBalance,
    leverage
  );

  const leveragedPrices = calculateDailyBalance(
    0,
    sp500Prices.length,
    sp500Prices,
    sp500Prices[0],
    leverage
  );

  const algoBalances = algo(
    start,
    end,
    sp500Prices,
    bonds,
    initialBalance,
    leverage
  );

  const sharedDatasetConfig = {
    borderWidth: 1,
    pointRadius: 0,
    tension: 0.1,
    fill: false,
  };

  return (
    <div>
      <h2>ALGOS</h2>
      <Line
        data={{
          labels: dates.slice(start, end),
          datasets: [
            {
              ...sharedDatasetConfig,
              label: 'BUY HOLD',
              data: buyHold,
              borderColor: 'rgb(75, 192, 192)',
            },
            {
              ...sharedDatasetConfig,
              label: 'ALGO',
              data: algoBalances,
              borderColor: 'rgb(143, 12, 104)',
            },
            {
              ...sharedDatasetConfig,
              label: 'BUY HOLD 2x',
              data: buyHold2x,
              borderColor: 'rgb(85, 154, 66)',
            },
          ],
        }}
      />
      <Line
        data={{
          labels: dates.slice(start, end),
          datasets: [
            {
              ...sharedDatasetConfig,
              label: 'Price',
              data: sp500Prices.slice(start, end),
              borderColor: 'rgb(75, 192, 192)',
            },
            {
              ...sharedDatasetConfig,
              label: '200MA',
              data: calculateMovingAverage(sp500Prices, 200).slice(start, end),
              borderColor: 'rgb(143, 12, 104)',
            },
            {
              ...sharedDatasetConfig,
              label: '20MA',
              data: calculateMovingAverage(sp500Prices, 20).slice(start, end),
              borderColor: 'rgb(120, 233, 27)',
            },
          ],
        }}
      />

      <Line
        data={{
          labels: dates.slice(start, end),
          datasets: [
            {
              ...sharedDatasetConfig,
              label: 'Price',
              data: leveragedPrices.slice(start, end),
              borderColor: 'rgb(75, 192, 192)',
            },
            {
              ...sharedDatasetConfig,
              label: '200MA',
              data: calculateMovingAverage(leveragedPrices, 200).slice(
                start,
                end
              ),
              borderColor: 'rgb(143, 12, 104)',
            },
            {
              ...sharedDatasetConfig,
              label: '20MA',
              data: calculateMovingAverage(leveragedPrices, 20).slice(
                start,
                end
              ),
              borderColor: 'rgb(120, 233, 27)',
            },
          ],
        }}
      />

      <Line
        data={{
          labels: dates.slice(start, end),
          datasets: [
            {
              ...sharedDatasetConfig,
              label: '20MA',
              data: bonds.slice(start, end),
              // data: calculateRSI(bonds, 10).slice(start, end),
              borderColor: 'rgb(78, 17, 106)',
            },
          ],
        }}
      />
    </div>
  );
};

export default SP500Graph;

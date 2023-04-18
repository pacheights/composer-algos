import {
  calculateMovingAverage,
  calculateRSI,
  calculateDailyBalance,
  calculateReturn,
} from './utils';

export const algo = (
  start: number,
  end: number,
  sp500: number[],
  bonds: number[],
  initialBalance = 10000,
  leverage = 1
) => {
  const dailyBalances: number[] = [initialBalance];
  let j = 1;

  const movingAverages = calculateMovingAverage(sp500, 200);
  const twentyDayMovingAverages = calculateMovingAverage(sp500, 20);
  const rsis = calculateRSI(sp500, 10);
  const bondRSIs = calculateRSI(bonds, 10);
  const buyHold2x = calculateDailyBalance(
    0,
    sp500.length,
    sp500,
    sp500[0],
    leverage
  );
  const leveragedMovingAverages = calculateMovingAverage(buyHold2x, 200);
  const leveragedTwentyDayMovingAverages = calculateMovingAverage(
    buyHold2x,
    20
  );
  const leveragedRSIs = calculateRSI(buyHold2x, 10);

  for (let i = start + 1; i < end; i++) {
    const twoHundredDayMA = movingAverages[i - 1];
    const twentyDayMA = twentyDayMovingAverages[i - 1];
    const sp500RSI = rsis[i - 1];
    const sp500Price = sp500[i - 1];

    const bondRSI = bondRSIs[i - 1];
    const leveragedRSI = leveragedRSIs[i - 1];

    const leveragedTwoHundredDayMA = leveragedMovingAverages[i - 1];
    const leveragedTwentyDayMA = leveragedTwentyDayMovingAverages[i - 1];
    const leveragedPrice = buyHold2x[i - 1];

    const dailyReturn = calculateReturn(sp500[i - 1], sp500[i]);
    const bondReturn = calculateReturn(bonds[i - 1], bonds[i]);
    const inverseReturn = -1 * dailyReturn;
    let algoReturn: number = dailyReturn;

    if (leveragedPrice > leveragedTwoHundredDayMA) {
      if (sp500RSI > 79) {
        algoReturn = 0;
      } else {
        if (bondRSI > sp500RSI) {
          algoReturn = dailyReturn;
        } else {
          algoReturn = bondReturn;
        }
      }
    } else {
      if (sp500RSI < 30) {
        algoReturn = dailyReturn;
      } else {
        if (leveragedRSI < 30) {
          algoReturn = dailyReturn;
        } else {
          if (leveragedPrice > leveragedTwentyDayMA) {
            algoReturn = dailyReturn;
          } else {
            if (bondRSI > 100 - sp500RSI) {
              algoReturn = inverseReturn;
            } else {
              algoReturn = bondReturn;
            }
          }
        }
      }
    }

    // if (leveragedPrice > leveragedTwoHundredDayMA) {
    //   if (sp500RSI > 79) {
    //     algoReturn = bondReturn;
    //   } else {
    //     if (bondRSI > sp500RSI) {
    //       algoReturn = dailyReturn;
    //     } else {
    //       algoReturn = bondReturn;
    //     }
    //   }
    // } else {
    //   if (sp500RSI < 30) {
    //     algoReturn = dailyReturn;
    //   } else {
    //     if (leveragedRSI < 30) {
    //       algoReturn = dailyReturn;
    //     } else {
    //       if (leveragedPrice > leveragedTwentyDayMA) {
    //         if (bondRSI > 100 - sp500RSI) {
    //           algoReturn = inverseReturn;
    //         } else {
    //           algoReturn = bondReturn;
    //         }
    //       } else {
    //         algoReturn = bondReturn;
    //       }
    //     }
    //   }
    // }

    const previousBalance = dailyBalances[j - 1];
    j++;
    const currentBalance = previousBalance * (1 + algoReturn * leverage);
    dailyBalances.push(currentBalance);
  }

  return dailyBalances;
};

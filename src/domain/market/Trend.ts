/** 価格推移の期間変化率（(末-初)/初）。初値が0/空なら0。 */
export const changeRate = (history: number[]): number =>
  history.length && history[0]
    ? (history[history.length - 1] - history[0]) / history[0]
    : 0;

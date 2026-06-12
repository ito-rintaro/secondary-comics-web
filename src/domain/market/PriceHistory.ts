/**
 * 価格推移（時系列）に対する集計ヘルパー。
 * hobipedia と同じ思想で、状態別の系列を潰さずそのまま保持する前提。
 */
export const currentPrice = (history: number[]): number =>
  history.length ? history[history.length - 1] : 0;

export const minPrice = (history: number[]): number =>
  history.length ? Math.min(...history) : 0;

export const maxPrice = (history: number[]): number =>
  history.length ? Math.max(...history) : 0;

import type { MarketRecord } from './MarketRecord';

/** マーケット全体のサマリー（デモの market summary カード相当）。 */
export interface MarketSummary {
  count: number; // 出品数
  topPrice: number; // 最高額の出品
  avgPrice: number; // 平均出品価格
  avgChange: number; // 値上がり率（平均・直近12ヶ月）
}

export const summarizeMarket = (records: MarketRecord[]): MarketSummary => {
  if (records.length === 0) {
    return { count: 0, topPrice: 0, avgPrice: 0, avgChange: 0 };
  }
  const count = records.length;
  const topPrice = Math.max(...records.map((m) => m.price));
  const avgPrice = records.reduce((s, m) => s + m.price, 0) / count;
  const avgChange = records.reduce((s, m) => s + m.change, 0) / count;
  return { count, topPrice, avgPrice, avgChange };
};

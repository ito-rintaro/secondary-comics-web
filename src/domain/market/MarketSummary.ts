import type { MarketListing } from './MarketListing';

/** マーケット全体のサマリー（デモの market summary カード相当）。 */
export interface MarketSummary {
  count: number; // 出品数
  topPrice: number; // 最高額の出品
  avgPrice: number; // 平均出品価格
  avgChange: number; // 値上がり率（平均・直近12ヶ月）
}

export const summarizeMarket = (listings: MarketListing[]): MarketSummary => {
  if (listings.length === 0) {
    return { count: 0, topPrice: 0, avgPrice: 0, avgChange: 0 };
  }
  const count = listings.length;
  const topPrice = Math.max(...listings.map((m) => m.price));
  const avgPrice = listings.reduce((s, m) => s + m.price, 0) / count;
  const avgChange = listings.reduce((s, m) => s + m.change, 0) / count;
  return { count, topPrice, avgPrice, avgChange };
};

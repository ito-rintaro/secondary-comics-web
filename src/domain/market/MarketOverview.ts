import type { MarketSummary } from './MarketSummary';

/**
 * マーケット全体の概況（相場サマリ一覧の上に出す 4 枚のカード相当）。
 * catalog 単位の相場サマリ（MarketSummary[]）から Presentation の派生状態として算出する。
 */
export interface MarketOverview {
  count: number; // 相場のある作品数（catalog 件数）
  topPrice: number; // 最高相場
  avgPrice: number; // 平均相場
  avgChange: number; // 値上がり率（平均）
}

export const summarizeMarket = (summaries: MarketSummary[]): MarketOverview => {
  if (summaries.length === 0) {
    return { count: 0, topPrice: 0, avgPrice: 0, avgChange: 0 };
  }
  const count = summaries.length;
  const topPrice = Math.max(...summaries.map((m) => m.price));
  const avgPrice = summaries.reduce((s, m) => s + m.price, 0) / count;
  const avgChange = summaries.reduce((s, m) => s + m.change, 0) / count;
  return { count, topPrice, avgPrice, avgChange };
};

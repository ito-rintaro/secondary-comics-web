import type { CollectionItem } from './CollectionItem';
import { acquisitionCost, evaluation } from './ProfitLoss';

/** コレクション全体のサマリー（資産管理の中核指標）。 */
export interface CollectionSummary {
  count: number; // 登録点数（所有数の合計）
  totalCost: number; // 総取得額
  totalValue: number; // 現在評価額
  pl: number; // 含み損益（評価額 - 取得額）
}

export const summarize = (items: CollectionItem[]): CollectionSummary => {
  let count = 0;
  let totalCost = 0;
  let totalValue = 0;
  for (const it of items) {
    count += it.qty;
    totalCost += acquisitionCost(it);
    totalValue += evaluation(it);
  }
  return { count, totalCost, totalValue, pl: totalValue - totalCost };
};

/** マーケット一覧の検索・ソート条件（デモの mkSearch / mkSort 相当）。 */
export type MarketSort =
  | 'priceDesc' // 価格が高い順
  | 'trendDesc' // 値上がり率が高い順
  | 'newest'; // 新着順

export interface MarketQuery {
  search: string;
  sort: MarketSort;
}

export const DEFAULT_MARKET_QUERY: MarketQuery = {
  search: '',
  sort: 'priceDesc',
};

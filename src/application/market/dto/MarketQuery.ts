/** マーケット相場一覧の検索・ソート条件。 */
export type MarketSort =
  | 'priceDesc' // 現在価格が高い順
  | 'trendDesc' // 値上がり率が高い順
  | 'recent'; // 直近成約が新しい順（lastSoldAt）

export interface MarketQuery {
  search: string;
  sort: MarketSort;
}

export const DEFAULT_MARKET_QUERY: MarketQuery = {
  search: '',
  sort: 'priceDesc',
};

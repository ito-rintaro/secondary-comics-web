import type { MarketRecord } from '../../domain/market/MarketRecord';
import type { MarketQuery } from './dto/MarketQuery';

/**
 * 検索・ソートを適用した一覧を返す純関数（副作用なし）。
 * デモ renderMarket() のフィルタ/ソートをそのまま移植。
 */
export const applyMarketQuery = (
  items: MarketRecord[],
  query: MarketQuery,
): MarketRecord[] => {
  const q = query.search.trim().toLowerCase();

  const filtered = items.filter((m) => {
    if (!q) return true;
    return `${m.title} ${m.author} ${m.seller}`.toLowerCase().includes(q);
  });

  return [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'trendDesc':
        return b.change - a.change;
      case 'newest':
        return b.listedAt - a.listedAt;
      default:
        return b.price - a.price;
    }
  });
};

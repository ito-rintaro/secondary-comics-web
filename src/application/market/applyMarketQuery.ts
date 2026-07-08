import type { MarketSummary } from '../../domain/market/MarketSummary';
import type { MarketQuery } from './dto/MarketQuery';

/**
 * 検索・ソートを適用した相場サマリ一覧を返す純関数（副作用なし）。
 * サマリは catalog 単位のため出品者（seller）は持たない → 検索はタイトル・著者のみ。
 * 新着（listedAt）は廃止し、直近成約日（lastSoldAt）で新しい順を表現する。
 */
export const applyMarketQuery = (
  items: MarketSummary[],
  query: MarketQuery,
): MarketSummary[] => {
  const q = query.search.trim().toLowerCase();

  const filtered = items.filter((m) => {
    if (!q) return true;
    return `${m.title} ${m.author}`.toLowerCase().includes(q);
  });

  return [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'trendDesc':
        return b.change - a.change;
      case 'recent':
        return b.lastSoldAt.localeCompare(a.lastSoldAt);
      default:
        return b.price - a.price;
    }
  });
};

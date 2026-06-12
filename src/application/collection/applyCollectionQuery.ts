import type { CollectionItem } from '../../domain/collection/CollectionItem';
import { profitLoss } from '../../domain/collection/ProfitLoss';
import type { CollectionQuery } from './dto/CollectionQuery';

/**
 * 検索・フィルタ・ソートを適用した一覧を返す純関数（副作用なし）。
 * デモ render() のフィルタ/ソートロジックをそのまま移植。テスト可能。
 */
export const applyCollectionQuery = (
  items: CollectionItem[],
  query: CollectionQuery,
): CollectionItem[] => {
  const q = query.search.trim().toLowerCase();

  const filtered = items.filter((it) => {
    if (q) {
      const hay = `${it.title} ${it.author} ${it.publisher}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    const pl = profitLoss(it);
    switch (query.filter) {
      case 'firstEd':
        return it.flags.firstEd;
      case 'obi':
        return it.flags.obi;
      case 'special':
        return it.flags.special;
      case 'profit':
        return pl > 0;
      case 'loss':
        return pl < 0;
      default:
        return true;
    }
  });

  return [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'marketDesc':
        return b.market - a.market;
      case 'plDesc':
        return profitLoss(b) - profitLoss(a);
      case 'titleAsc':
        return a.title.localeCompare(b.title, 'ja');
      default:
        return (b.updatedAt || 0) - (a.updatedAt || 0);
    }
  });
};

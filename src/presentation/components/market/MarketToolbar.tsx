import type {
  MarketQuery,
  MarketSort,
} from '../../../application/market/dto/MarketQuery';

interface MarketToolbarProps {
  query: MarketQuery;
  onChange: (query: MarketQuery) => void;
}

/** マーケットの検索・ソートツールバー（デモの mkSearch / mkSort 相当）。 */
export function MarketToolbar({ query, onChange }: MarketToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <input
          type="text"
          placeholder="🔍 出品を検索（タイトル・著者・出品者）"
          value={query.search}
          onChange={(e) => onChange({ ...query, search: e.target.value })}
        />
      </div>
      <select
        value={query.sort}
        onChange={(e) =>
          onChange({ ...query, sort: e.target.value as MarketSort })
        }
      >
        <option value="priceDesc">価格が高い順</option>
        <option value="trendDesc">値上がり率が高い順</option>
        <option value="newest">新着順</option>
      </select>
    </div>
  );
}

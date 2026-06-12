import type {
  CollectionFilter,
  CollectionQuery,
  CollectionSort,
} from '../../../application/collection/dto/CollectionQuery';

interface ToolbarProps {
  query: CollectionQuery;
  onChange: (query: CollectionQuery) => void;
}

/** 検索・フィルタ・ソートのツールバー（デモの toolbar 相当）。 */
export function Toolbar({ query, onChange }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <input
          type="text"
          placeholder="🔍 タイトル・著者・出版社で検索"
          value={query.search}
          onChange={(e) => onChange({ ...query, search: e.target.value })}
        />
      </div>
      <select
        value={query.filter}
        onChange={(e) =>
          onChange({ ...query, filter: e.target.value as CollectionFilter })
        }
      >
        <option value="">すべて表示</option>
        <option value="firstEd">初版のみ</option>
        <option value="obi">帯付きのみ</option>
        <option value="special">特装・サイン本のみ</option>
        <option value="profit">含み益のあるもの</option>
        <option value="loss">含み損のあるもの</option>
      </select>
      <select
        value={query.sort}
        onChange={(e) =>
          onChange({ ...query, sort: e.target.value as CollectionSort })
        }
      >
        <option value="updated">更新が新しい順</option>
        <option value="marketDesc">相場が高い順</option>
        <option value="plDesc">損益が大きい順</option>
        <option value="titleAsc">タイトル順</option>
      </select>
    </div>
  );
}

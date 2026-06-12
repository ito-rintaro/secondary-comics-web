/** 一覧の検索・フィルタ・ソート条件（デモの toolbar 相当）。 */
export type CollectionFilter =
  | '' // すべて表示
  | 'firstEd'
  | 'obi'
  | 'special'
  | 'profit' // 含み益のあるもの
  | 'loss'; // 含み損のあるもの

export type CollectionSort =
  | 'updated' // 更新が新しい順
  | 'marketDesc' // 相場が高い順
  | 'plDesc' // 損益が大きい順
  | 'titleAsc'; // タイトル順

export interface CollectionQuery {
  search: string;
  filter: CollectionFilter;
  sort: CollectionSort;
}

export const DEFAULT_COLLECTION_QUERY: CollectionQuery = {
  search: '',
  filter: '',
  sort: 'updated',
};

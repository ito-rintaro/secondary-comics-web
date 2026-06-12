import { useCallback, useEffect, useMemo, useState } from 'react';
import { collectionUseCases } from '../../config/container';
import { applyCollectionQuery } from '../../application/collection/applyCollectionQuery';
import type { CollectionItemInput } from '../../application/collection/dto/CollectionItemInput';
import type { CollectionQuery } from '../../application/collection/dto/CollectionQuery';
import { DEFAULT_COLLECTION_QUERY } from '../../application/collection/dto/CollectionQuery';
import type { CollectionItem } from '../../domain/collection/CollectionItem';
import { summarize } from '../../domain/collection/CollectionSummary';

/**
 * コレクション画面の状態とユースケース呼び出しをまとめる薄い React 適合層。
 * リポジトリ読込はマウント時とデータ変更時のみ（all が source of truth）。
 * 検索/フィルタ/ソートと集計は all から派生（純関数）で算出し、再読込しない。
 */
export function useCollection() {
  const [all, setAll] = useState<CollectionItem[]>([]);
  const [query, setQuery] = useState<CollectionQuery>(DEFAULT_COLLECTION_QUERY);

  const load = useCallback(async () => {
    setAll(await collectionUseCases.list.execute());
  }, []);

  useEffect(() => {
    // 外部システム（リポジトリ）からの初回ロード。以後の更新は各操作が明示的に load する。
    // setState は await 後（非同期）に行われるため同期的なカスケード再描画にはならない。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const items = useMemo(() => applyCollectionQuery(all, query), [all, query]);
  const summary = useMemo(() => summarize(all), [all]);

  const save = useCallback(
    async (input: CollectionItemInput) => {
      await collectionUseCases.save.execute(input);
      await load();
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      await collectionUseCases.remove.execute(id);
      await load();
    },
    [load],
  );

  const exportAll = useCallback(() => collectionUseCases.exportAll.execute(), []);

  const importAll = useCallback(
    async (data: unknown) => {
      const count = await collectionUseCases.importAll.execute(data);
      await load();
      return count;
    },
    [load],
  );

  return {
    query,
    setQuery,
    items,
    summary,
    total: all.length,
    save,
    remove,
    exportAll,
    importAll,
  };
}

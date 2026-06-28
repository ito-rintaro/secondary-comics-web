import { useCallback, useEffect, useState } from 'react';
import { catalogUseCases } from '../../config/container';
import type { Catalog } from '../../domain/catalog/Catalog';

/**
 * 新規作成モーダル用にカタログ（書誌マスタ）を読み込む薄い適合層。
 * catalogId 選択のために GET /catalogs を取得する。検索・絞り込みは
 * 呼び出し側（モーダル）で all から派生させる。
 */
export function useCatalogs() {
  const [all, setAll] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAll(await catalogUseCases.list.execute());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'カタログの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 外部システム（リポジトリ）からの初回ロード。setState は await 後で非同期。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { catalogs: all, loading, error, reload: load };
}

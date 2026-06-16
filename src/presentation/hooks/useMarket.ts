import { useCallback, useEffect, useMemo, useState } from 'react';
import { marketUseCases } from '../../config/container';
import { applyMarketQuery } from '../../application/market/applyMarketQuery';
import type { MarketQuery } from '../../application/market/dto/MarketQuery';
import { DEFAULT_MARKET_QUERY } from '../../application/market/dto/MarketQuery';
import type { MarketRecord } from '../../domain/market/MarketRecord';
import { summarizeMarket } from '../../domain/market/MarketSummary';

/**
 * マーケット画面の状態とユースケース呼び出しをまとめる薄い React 適合層。
 * 検索/ソートと集計は all から派生（純関数）で算出する。
 */
export function useMarket() {
  const [all, setAll] = useState<MarketRecord[]>([]);
  const [query, setQuery] = useState<MarketQuery>(DEFAULT_MARKET_QUERY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAll(await marketUseCases.list.execute());
    } catch (e) {
      // API 失敗（未認証・通信不可など）。空表示にせず原因を画面に出す。
      setError(e instanceof Error ? e.message : 'マーケットの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 外部システム（リポジトリ）からの初回ロード。setState は await 後で非同期。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const records = useMemo(() => applyMarketQuery(all, query), [all, query]);
  const summary = useMemo(() => summarizeMarket(all), [all]);

  return {
    query,
    setQuery,
    records,
    summary,
    total: all.length,
    loading,
    error,
    reload: load,
  };
}

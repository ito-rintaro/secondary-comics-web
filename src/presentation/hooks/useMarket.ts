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

  const load = useCallback(async () => {
    setAll(await marketUseCases.list.execute());
  }, []);

  useEffect(() => {
    // 外部システム（リポジトリ）からの初回ロード。setState は await 後で非同期。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const records = useMemo(() => applyMarketQuery(all, query), [all, query]);
  const summary = useMemo(() => summarizeMarket(all), [all]);

  return { query, setQuery, records, summary, total: all.length };
}

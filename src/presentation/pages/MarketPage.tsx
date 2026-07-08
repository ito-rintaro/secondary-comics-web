import { useState } from 'react';
import type { MarketSummary } from '../../domain/market/MarketSummary';
import { useMarket } from '../hooks/useMarket';
import { MarketSummaryCards } from '../components/market/MarketSummaryCards';
import { MarketToolbar } from '../components/market/MarketToolbar';
import { MarketCard } from '../components/market/MarketCard';
import { MarketDetailModal } from '../components/market/MarketDetailModal';

export function MarketPage() {
  const { query, setQuery, records, summary, total, loading, error, reload } =
    useMarket();
  const [selected, setSelected] = useState<MarketSummary | null>(null);

  const openDetail = (catalogId: string) =>
    setSelected(records.find((m) => m.catalogId === catalogId) ?? null);

  return (
    <div className="wrap">
      <MarketSummaryCards summary={summary} />
      <MarketToolbar query={query} onChange={setQuery} />

      {error ? (
        <div className="empty">
          {error}
          <div style={{ marginTop: 12 }}>
            <button className="ghost" onClick={() => void reload()}>
              再読み込み
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="empty">読み込み中…</div>
      ) : total === 0 ? (
        <div className="empty">マーケットのデータがありません。</div>
      ) : (
        <div className="grid">
          {records.map((record) => (
            <MarketCard
              key={record.catalogId}
              record={record}
              onOpen={openDetail}
            />
          ))}
        </div>
      )}

      {selected && (
        <MarketDetailModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

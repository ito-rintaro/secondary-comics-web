import { useState } from 'react';
import type { MarketRecord } from '../../domain/market/MarketRecord';
import { useMarket } from '../hooks/useMarket';
import { MarketSummaryCards } from '../components/market/MarketSummaryCards';
import { MarketToolbar } from '../components/market/MarketToolbar';
import { MarketCard } from '../components/market/MarketCard';
import { MarketDetailModal } from '../components/market/MarketDetailModal';

export function MarketPage() {
  const { query, setQuery, records, summary, total, loading, error, reload } =
    useMarket();
  const [selected, setSelected] = useState<MarketRecord | null>(null);

  const openDetail = (id: string) =>
    setSelected(records.find((m) => m.id === id) ?? null);

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
            <MarketCard key={record.id} record={record} onOpen={openDetail} />
          ))}
        </div>
      )}

      {selected && (
        <MarketDetailModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

import { useState } from 'react';
import type { MarketRecord } from '../../domain/market/MarketRecord';
import { useMarket } from '../hooks/useMarket';
import { MarketSummaryCards } from '../components/market/MarketSummaryCards';
import { MarketToolbar } from '../components/market/MarketToolbar';
import { MarketCard } from '../components/market/MarketCard';
import { MarketDetailModal } from '../components/market/MarketDetailModal';

export function MarketPage() {
  const { query, setQuery, records, summary } = useMarket();
  const [selected, setSelected] = useState<MarketRecord | null>(null);

  const openDetail = (id: string) =>
    setSelected(records.find((m) => m.id === id) ?? null);

  return (
    <div className="wrap">
      <MarketSummaryCards summary={summary} />
      <MarketToolbar query={query} onChange={setQuery} />

      <div className="grid">
        {records.map((record) => (
          <MarketCard key={record.id} record={record} onOpen={openDetail} />
        ))}
      </div>

      {selected && (
        <MarketDetailModal record={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

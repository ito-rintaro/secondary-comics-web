import { useState } from 'react';
import type { MarketListing } from '../../domain/market/MarketListing';
import { useMarket } from '../hooks/useMarket';
import { MarketSummaryCards } from '../components/market/MarketSummaryCards';
import { MarketToolbar } from '../components/market/MarketToolbar';
import { MarketCard } from '../components/market/MarketCard';
import { MarketDetailModal } from '../components/market/MarketDetailModal';

export function MarketPage() {
  const { query, setQuery, listings, summary } = useMarket();
  const [selected, setSelected] = useState<MarketListing | null>(null);

  const openDetail = (id: string) =>
    setSelected(listings.find((m) => m.id === id) ?? null);

  return (
    <div className="wrap">
      <MarketSummaryCards summary={summary} />
      <MarketToolbar query={query} onChange={setQuery} />

      <div className="grid">
        {listings.map((listing) => (
          <MarketCard key={listing.id} listing={listing} onOpen={openDetail} />
        ))}
      </div>

      {selected && (
        <MarketDetailModal listing={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

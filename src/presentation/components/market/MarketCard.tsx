import type { MarketListing } from '../../../domain/market/MarketListing';
import { formatPercent, formatYen, trendClass } from '../../format';
import { Sparkline } from './Sparkline';
import { avatarHue } from './avatar';

interface MarketCardProps {
  listing: MarketListing;
  onOpen: (id: string) => void;
}

/** マーケットの出品/相場カード（デモの market grid item 相当）。 */
export function MarketCard({ listing, onOpen }: MarketCardProps) {
  const hue = avatarHue(listing.seller);
  const meta = [
    listing.author,
    listing.volume,
    `コンディション${listing.condition}`,
  ]
    .filter(Boolean)
    .join(' ・ ');

  return (
    <div
      className="item"
      style={{ cursor: 'pointer' }}
      onClick={() => onOpen(listing.id)}
    >
      <div className="thumb">
        <span className="ph">📕</span>
        <div className="badges">
          {listing.flags.firstEd && <span className="badge hot">初版</span>}
          {listing.flags.obi && <span className="badge">帯</span>}
          {listing.flags.special && <span className="badge">サイン</span>}
        </div>
      </div>
      <div className="body">
        <div className="title">{listing.title}</div>
        <div className="meta">{meta}</div>
        <Sparkline data={listing.history} width={240} height={54} className="spark" />
        <div className="nums">
          <div>
            <div className="meta">出品価格</div>
            <div className="market">{formatYen(listing.price)}</div>
          </div>
          <div className={`trend ${trendClass(listing.change)}`}>
            {formatPercent(listing.change)}
            <br />
            <span className="meta">直近12ヶ月</span>
          </div>
        </div>
        <div className="seller">
          <span className="ava" style={{ background: `hsl(${hue} 50% 30%)` }}>
            {listing.seller[0]}
          </span>
          {listing.seller}
        </div>
      </div>
    </div>
  );
}

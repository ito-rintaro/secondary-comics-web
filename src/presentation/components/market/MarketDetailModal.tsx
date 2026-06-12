import type { MarketListing } from '../../../domain/market/MarketListing';
import { maxPrice, minPrice } from '../../../domain/market/PriceHistory';
import { formatPercent, formatYen, trendClass } from '../../format';
import { Modal } from '../common/Modal';
import { Sparkline } from './Sparkline';
import { avatarHue } from './avatar';

interface MarketDetailModalProps {
  listing: MarketListing;
  onClose: () => void;
}

/** マーケット詳細モーダル（デモの openMarketDetail 相当）。 */
export function MarketDetailModal({ listing, onClose }: MarketDetailModalProps) {
  const hue = avatarHue(listing.seller);
  const lo = minPrice(listing.history);
  const hi = maxPrice(listing.history);
  const tCls = trendClass(listing.change);

  return (
    <Modal open onClose={onClose} maxWidth={720}>
      <div id="mkModal">
        <div className="mk-head">
          <div className="pic">📕</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px' }}>{listing.title}</h2>
            <div
              className="meta"
              style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}
            >
              {listing.author} ・ {listing.publisher} ・ {listing.volume}
            </div>
            <div>
              {listing.flags.firstEd && <span className="chip hot">初版</span>}
              {listing.flags.obi && <span className="chip">帯付き</span>}
              {listing.flags.special && <span className="chip">サイン入り</span>}
              <span className="chip">コンディション {listing.condition}</span>
            </div>
            <div className="price-now" style={{ marginTop: 12 }}>
              {formatYen(listing.price)}{' '}
              <span className={`trend ${tCls}`} style={{ fontSize: 15 }}>
                {formatPercent(listing.change)}
              </span>
            </div>
            <div className="seller" style={{ marginTop: 6 }}>
              <span className="ava" style={{ background: `hsl(${hue} 50% 30%)` }}>
                {listing.seller[0]}
              </span>
              出品者：{listing.seller}
            </div>
          </div>
        </div>

        <div
          className="meta"
          style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}
        >
          価格推移（過去12ヶ月）
        </div>
        <div className="chartbox">
          <Sparkline
            data={listing.history}
            width={660}
            height={200}
            pad={18}
            dots
            labels
            className="bigchart"
          />
        </div>

        <div className="stat-row">
          <div className="stat">
            <div className="k">現在価格</div>
            <div className="v">{formatYen(listing.price)}</div>
          </div>
          <div className="stat">
            <div className="k">期間 最安</div>
            <div className="v">{formatYen(lo)}</div>
          </div>
          <div className="stat">
            <div className="k">期間 最高</div>
            <div className="v">{formatYen(hi)}</div>
          </div>
          <div className="stat">
            <div className="k">12ヶ月変動</div>
            <div className={`v ${tCls}`}>{formatPercent(listing.change)}</div>
          </div>
        </div>

        <div className="modal-actions">
          <div className="grow" />
          <button className="ghost" onClick={onClose}>
            閉じる
          </button>
          <button
            className="primary"
            onClick={() => alert('デモ版のため、ウォッチ機能はダミーです。')}
          >
            ウォッチに追加（デモ）
          </button>
        </div>
      </div>
    </Modal>
  );
}

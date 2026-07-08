import { useState } from 'react';
import type { MarketSummary } from '../../../domain/market/MarketSummary';
import { formatPercent, formatYen, trendClass } from '../../format';
import { resolveImageSrc } from '../../imageSrc';
import { Sparkline } from './Sparkline';

interface MarketCardProps {
  record: MarketSummary;
  onOpen: (catalogId: string) => void;
}

/** catalog 単位の相場カード（デモの market grid item 相当）。 */
export function MarketCard({ record, onOpen }: MarketCardProps) {
  const [imgBroken, setImgBroken] = useState(false);
  const src = resolveImageSrc(record.imageUrl);
  const meta = [record.author, record.volume].filter(Boolean).join(' ・ ');

  return (
    <div
      className="item"
      style={{ cursor: 'pointer' }}
      onClick={() => onOpen(record.catalogId)}
    >
      <div className="thumb">
        {src && !imgBroken ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <span className="ph">📕</span>
        )}
        <div className="badges">
          {record.flags.firstEd && <span className="badge hot">初版</span>}
          {record.flags.obi && <span className="badge">帯</span>}
          {record.flags.special && <span className="badge">サイン</span>}
        </div>
      </div>
      <div className="body">
        <div className="title">{record.title}</div>
        <div className="meta">{meta}</div>
        <Sparkline data={record.history} width={240} height={54} className="spark" />
        <div className="nums">
          <div>
            <div className="meta">現在の相場</div>
            <div className="market">{formatYen(record.price)}</div>
          </div>
          <div className={`trend ${trendClass(record.change)}`}>
            {formatPercent(record.change)}
            <br />
            <span className="meta">直近12ヶ月</span>
          </div>
        </div>
        <div className="meta">
          直近成約 {record.lastSoldAt} ・ 成約 {record.sampleCount} 件
        </div>
      </div>
    </div>
  );
}

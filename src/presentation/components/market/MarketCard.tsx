import type { MarketRecord } from '../../../domain/market/MarketRecord';
import { formatPercent, formatYen, trendClass } from '../../format';
import { Sparkline } from './Sparkline';
import { avatarHue } from './avatar';

interface MarketCardProps {
  record: MarketRecord;
  onOpen: (id: string) => void;
}

/** マーケットの出品/相場カード（デモの market grid item 相当）。 */
export function MarketCard({ record, onOpen }: MarketCardProps) {
  const hue = avatarHue(record.seller);
  const meta = [
    record.author,
    record.volume,
    `コンディション${record.condition}`,
  ]
    .filter(Boolean)
    .join(' ・ ');

  return (
    <div
      className="item"
      style={{ cursor: 'pointer' }}
      onClick={() => onOpen(record.id)}
    >
      <div className="thumb">
        <span className="ph">📕</span>
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
            <div className="meta">出品価格</div>
            <div className="market">{formatYen(record.price)}</div>
          </div>
          <div className={`trend ${trendClass(record.change)}`}>
            {formatPercent(record.change)}
            <br />
            <span className="meta">直近12ヶ月</span>
          </div>
        </div>
        <div className="seller">
          <span className="ava" style={{ background: `hsl(${hue} 50% 30%)` }}>
            {record.seller[0]}
          </span>
          {record.seller}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import { CONDITION_LABELS } from '../../../domain/collection/Condition';
import { profitLoss } from '../../../domain/collection/ProfitLoss';
import { formatSignedYen, formatYen, plClass } from '../../format';
import { resolveImageSrc } from '../../imageSrc';

interface ItemCardProps {
  item: CollectionItem;
  onEdit: (id: string) => void;
}

/** 作品カード（デモの grid item 相当）。 */
export function ItemCard({ item, onEdit }: ItemCardProps) {
  const [imgBroken, setImgBroken] = useState(false);
  const src = resolveImageSrc(item.imageUrl);
  const pl = profitLoss(item);
  const meta1 = [item.author, item.volume].filter(Boolean).join(' ・ ') || '—';
  const meta2 = [item.publisher, CONDITION_LABELS[item.condition], item.year]
    .filter(Boolean)
    .join(' ・ ');

  return (
    <div className="item">
      <div className="thumb">
        {src && !imgBroken ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <span className="ph">📖</span>
        )}
        <div className="badges">
          {item.flags.firstEd && <span className="badge hot">初版</span>}
          {item.flags.obi && <span className="badge">帯</span>}
          {item.flags.special && <span className="badge">特装</span>}
        </div>
      </div>
      <div className="body">
        <div className="title">{item.title}</div>
        <div className="meta">{meta1}</div>
        <div className="meta">{meta2}</div>
        <div className="nums">
          <div>
            <div className="meta">現在相場</div>
            <div className="market">{formatYen(item.market)}</div>
          </div>
          <div className={`pl ${plClass(pl)}`}>
            {formatSignedYen(pl)}
            <br />
            <span className="meta">
              {item.qty}点 / 取得 {formatYen(item.cost)}
            </span>
          </div>
        </div>
      </div>
      <div className="acts">
        <button onClick={() => onEdit(item.id)}>編集</button>
      </div>
    </div>
  );
}

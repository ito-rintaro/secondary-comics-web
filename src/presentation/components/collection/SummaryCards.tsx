import type { CollectionSummary } from '../../../domain/collection/CollectionSummary';
import { formatSignedYen, formatYen, plClass } from '../../format';

/** サマリーカード4種：登録点数・総取得額・現在評価額・含み損益。 */
export function SummaryCards({ summary }: { summary: CollectionSummary }) {
  return (
    <div className="cards">
      <div className="card">
        <div className="k">登録点数</div>
        <div className="v">{summary.count}</div>
      </div>
      <div className="card">
        <div className="k">総取得額</div>
        <div className="v">{formatYen(summary.totalCost)}</div>
      </div>
      <div className="card">
        <div className="k">現在評価額</div>
        <div className="v">{formatYen(summary.totalValue)}</div>
      </div>
      <div className="card">
        <div className="k">含み損益</div>
        <div className={`v ${plClass(summary.pl)}`}>
          {formatSignedYen(summary.pl)}
        </div>
      </div>
    </div>
  );
}

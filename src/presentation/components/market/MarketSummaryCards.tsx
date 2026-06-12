import type { MarketSummary } from '../../../domain/market/MarketSummary';
import { formatPercent, formatYen, trendClass } from '../../format';

/** マーケットのサマリーカード4種。 */
export function MarketSummaryCards({ summary }: { summary: MarketSummary }) {
  return (
    <div className="cards">
      <div className="card">
        <div className="k">出品数</div>
        <div className="v">{summary.count}</div>
      </div>
      <div className="card">
        <div className="k">最高額の出品</div>
        <div className="v">{formatYen(summary.topPrice)}</div>
      </div>
      <div className="card">
        <div className="k">平均出品価格</div>
        <div className="v">{formatYen(summary.avgPrice)}</div>
      </div>
      <div className="card">
        <div className="k">値上がり率（平均）</div>
        <div className={`v ${trendClass(summary.avgChange)}`}>
          {summary.count ? formatPercent(summary.avgChange) : '—'}
        </div>
      </div>
    </div>
  );
}

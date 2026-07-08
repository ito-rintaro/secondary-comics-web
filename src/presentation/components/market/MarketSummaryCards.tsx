import type { MarketOverview } from '../../../domain/market/MarketOverview';
import { formatPercent, formatYen, trendClass } from '../../format';

/** マーケット概況のサマリーカード4種。 */
export function MarketSummaryCards({ summary }: { summary: MarketOverview }) {
  return (
    <div className="cards">
      <div className="card">
        <div className="k">相場のある作品数</div>
        <div className="v">{summary.count}</div>
      </div>
      <div className="card">
        <div className="k">最高相場</div>
        <div className="v">{formatYen(summary.topPrice)}</div>
      </div>
      <div className="card">
        <div className="k">平均相場</div>
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

import type { MarketSale } from './MarketSale';
import type { MarketSummary } from './MarketSummary';
import { currentPrice } from './PriceHistory';
import { changeRate } from './Trend';

/** 月バケット数（history の要素数）。末尾＝当月（anchor）。 */
const MONTHS = 12;

/** "YYYY-MM"(-DD) を月の通し番号（year*12 + monthIndex）に変換する。 */
const monthIndex = (yyyymm: string): number => {
  const [y, m] = yyyymm.slice(0, 7).split('-').map(Number);
  return y * 12 + (m - 1);
};

/**
 * 1 つの catalog の成約ログを月次の擬似価格系列に畳む。
 * - anchorMonth（"YYYY-MM"）を末尾（当月）とした直近 12 ヶ月のバケットを作る
 * - 各バケットは、その月の成約価格の平均（四捨五入）
 * - 成約が無い月は直前月の値をキャリー（前方フィル）
 * - 最初の成約より前の月は、最初の非空値でバックフィル
 * → 成約が疎でも 12 点の折れ線が成立する。実測点そのものではない点に留意。
 */
export const foldSalesToHistory = (
  sales: MarketSale[],
  anchorMonth: string,
): number[] => {
  const anchorIdx = monthIndex(anchorMonth);
  const sums = new Array<number>(MONTHS).fill(0);
  const counts = new Array<number>(MONTHS).fill(0);

  for (const s of sales) {
    const diff = anchorIdx - monthIndex(s.soldAt);
    if (diff < 0 || diff >= MONTHS) continue; // 窓の外（未来 / 12ヶ月より前）は畳まない
    const bucket = MONTHS - 1 - diff;
    sums[bucket] += s.price;
    counts[bucket] += 1;
  }

  // 各月の平均（成約が無い月は null）
  const avg = sums.map((sum, i) =>
    counts[i] ? Math.round(sum / counts[i]) : null,
  );
  // 前方フィル：直前の非空値をキャリー
  let last: number | null = null;
  const forward = avg.map((v) => {
    if (v !== null) last = v;
    return last;
  });
  // バックフィル：先頭側の null を最初の非空値で埋める
  const firstVal = forward.find((v): v is number => v !== null) ?? 0;
  return forward.map((v) => v ?? firstVal);
};

/**
 * 1 つの catalog の成約ログ（1 件以上・同一 catalogId）から相場サマリを導出する。
 * サーバー側 GET /market/summary の集計をフロント（デモ）でも再現するための純関数。
 */
export const summaryFromSales = (
  sales: MarketSale[],
  anchorMonth: string,
): MarketSummary => {
  const head = sales[0];
  const history = foldSalesToHistory(sales, anchorMonth);
  const lastSoldAt = sales.reduce(
    (max, s) => (s.soldAt > max ? s.soldAt : max),
    sales[0].soldAt,
  );
  return {
    catalogId: head.catalogId,
    title: head.title,
    author: head.author,
    publisher: head.publisher,
    volume: head.volume,
    flags: head.flags,
    imageUrl: head.imageUrl,
    price: currentPrice(history),
    change: changeRate(history),
    history,
    sampleCount: sales.length,
    lastSoldAt,
  };
};

/**
 * 成約ログ全件を catalog 単位に集計して相場サマリ配列にする。
 * 成約が 1 件以上ある catalog のみが結果に含まれる（GET /market/summary と同じ挙動）。
 */
export const summariesFromSales = (
  sales: MarketSale[],
  anchorMonth: string,
): MarketSummary[] => {
  const byCatalog = new Map<string, MarketSale[]>();
  for (const s of sales) {
    const group = byCatalog.get(s.catalogId);
    if (group) group.push(s);
    else byCatalog.set(s.catalogId, [s]);
  }
  return [...byCatalog.values()].map((group) =>
    summaryFromSales(group, anchorMonth),
  );
};

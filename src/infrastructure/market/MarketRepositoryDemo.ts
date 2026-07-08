import type { MarketSale } from '../../domain/market/MarketSale';
import type { MarketSummary } from '../../domain/market/MarketSummary';
import { summariesFromSales } from '../../domain/market/summaryFromSales';
import type { MarketRepository } from '../../application/market/ports/MarketRepository';
import { marketSeed } from './seed/marketSeed';
import { mulberry32 } from './prng';

const SEED = 20260612; // 固定シード（リロードしても同じ相場になる）

/**
 * 当月（＝ history 末尾のバケット）。実データの soldAt に依存せず再現可能にするため固定。
 * この月を末尾とした直近 12 ヶ月（'2025-08' … '2026-07'）の窓に成約を撒く。
 */
const ANCHOR_MONTH = '2026-07';

/** ANCHOR_MONTH を末尾とした直近 count ヶ月の "YYYY-MM" 列を作る。 */
const recentMonths = (anchor: string, count: number): string[] => {
  const [ay, am] = anchor.split('-').map(Number);
  const base = ay * 12 + (am - 1);
  return Array.from({ length: count }, (_, i) => {
    const idx = base - (count - 1) + i;
    const y = Math.floor(idx / 12);
    const m = (idx % 12) + 1;
    return `${y}-${String(m).padStart(2, '0')}`;
  });
};

/**
 * 1 つの seed から成約イベント列を生成する（デモ genHistory の代替）。
 * 各月に確率的に 1 件の成約を撒き、価格は base + トレンドドリフト + ぶれ。
 * 当月（末尾）は必ず 1 件入れて「現在価格」を成立させる。成約が無い月は
 * サマリ側の前方フィルで補間されるため、疎な系列でも折れ線になる。
 */
const genSales = (
  seed: (typeof marketSeed)[number],
  index: number,
  rng: () => number,
): MarketSale[] => {
  const months = recentMonths(ANCHOR_MONTH, 12);
  const sales: MarketSale[] = [];

  months.forEach((month, m) => {
    const isCurrent = m === months.length - 1;
    if (!isCurrent && rng() < 0.35) return; // 一部の月は成約なし（疎な系列にする）

    const drift = seed.base * seed.trend * (m / (months.length - 1));
    const noise = seed.base * seed.vol * (rng() - 0.5);
    const price = Math.max(500, Math.round((seed.base + drift + noise) / 100) * 100);
    const day = String(1 + Math.floor(rng() * 27)).padStart(2, '0');

    sales.push({
      id: `mk-${index}-${m}`,
      title: seed.title,
      author: seed.author,
      publisher: seed.publisher,
      volume: seed.volume,
      flags: seed.flags,
      imageUrl: '', // デモは画像なし（プレースホルダ表示）
      catalogId: seed.catalogId,
      condition: seed.condition,
      price,
      soldAt: `${month}-${day}`,
      seller: seed.seller,
    });
  });

  return sales;
};

/**
 * デモ実装：擬似生成した成約ログを catalog 単位に畳んだ相場サマリを返す。
 * 生成は構築時に一度だけ行いキャッシュするため、呼び出し間で一貫する。
 * サマリの導出はサーバーと同じ純関数（summariesFromSales）を通す。
 */
export class MarketRepositoryDemo implements MarketRepository {
  private readonly summaries: MarketSummary[];

  constructor() {
    const rng = mulberry32(SEED);
    const sales = marketSeed.flatMap((s, i) => genSales(s, i, rng));
    this.summaries = summariesFromSales(sales, ANCHOR_MONTH);
  }

  async listSummaries(): Promise<MarketSummary[]> {
    return this.summaries;
  }
}

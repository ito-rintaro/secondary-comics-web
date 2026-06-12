import type { MarketListing } from '../../domain/market/MarketListing';
import { currentPrice } from '../../domain/market/PriceHistory';
import { changeRate } from '../../domain/market/Trend';
import type { MarketRepository } from '../../application/market/ports/MarketRepository';
import { marketSeed } from './seed/marketSeed';
import { mulberry32 } from './prng';

const SEED = 20260612; // 固定シード（リロードしても同じチャートになる）

/** 基準価格・トレンド・ぶれから12点の価格推移を生成（デモ genHistory 相当）。 */
const genHistory = (
  base: number,
  trend: number,
  vol: number,
  rng: () => number,
): number[] => {
  const pts: number[] = [];
  for (let i = 0; i < 12; i++) {
    const drift = base * trend * (i / 11);
    const noise = base * vol * (rng() - 0.5);
    pts.push(Math.max(500, Math.round((base + drift + noise) / 100) * 100));
  }
  // 末尾を「現在価格」として整える
  pts[11] = Math.max(500, Math.round((base * (1 + trend)) / 100) * 100);
  return pts;
};

/**
 * デモ実装：擬似生成した相場を返す MarketRepository。
 * 生成は構築時に一度だけ行いキャッシュするため、list の呼び出し間で一貫する。
 */
export class MarketRepositoryDemo implements MarketRepository {
  private readonly listings: MarketListing[];

  constructor() {
    const rng = mulberry32(SEED);
    this.listings = marketSeed.map((s, i) => {
      const history = genHistory(s.base, s.trend, s.vol, rng);
      return {
        id: `mk${i}`,
        title: s.title,
        author: s.author,
        publisher: s.publisher,
        volume: s.volume,
        seller: s.seller,
        condition: s.condition,
        flags: s.flags,
        history,
        price: currentPrice(history),
        change: changeRate(history),
        listedAt: i,
      };
    });
  }

  async list(): Promise<MarketListing[]> {
    return this.listings;
  }
}

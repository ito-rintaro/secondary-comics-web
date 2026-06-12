import type { MarketListing } from '../../../domain/market/MarketListing';

/**
 * マーケット相場取得の出力ポート（境界）。
 * 今は MarketRepositoryDemo（擬似生成）。フェーズ2で MarketRepositoryImpl
 * （04_market_data.md の決定ソース：API or バッチ集計）へ差し替える。
 */
export interface MarketRepository {
  /** 全件取得（検索/ソートは application の applyMarketQuery で適用）。 */
  list(): Promise<MarketListing[]>;
}

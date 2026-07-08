import type { MarketSummary } from '../../../domain/market/MarketSummary';

/**
 * マーケット相場取得の出力ポート（境界）。
 * 相場一覧カード・価格チャートの供給源は catalog 単位の相場サマリ
 * （GET /market/summary）。成約ログ（GET /market）は集計の元データで、
 * 現状フロントの一覧では使わないためポートには載せない。
 */
export interface MarketRepository {
  /** catalog 単位の相場サマリを全件取得（GET /market/summary 相当）。 */
  listSummaries(): Promise<MarketSummary[]>;
}

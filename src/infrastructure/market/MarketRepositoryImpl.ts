import type { MarketSummary } from '../../domain/market/MarketSummary';
import type { MarketRepository } from '../../application/market/ports/MarketRepository';
import { apiGet } from '../http/apiClient';

/**
 * 本番実装：バックエンド API（dev）に接続する MarketRepository。
 * GET /market/summary は catalog 単位に集計済みの相場サマリ配列を返す。
 * price / change / history はサーバーが成約ログ（GET /market）から導出するため、
 * フロントでの畳み込み（Demo）は不要。
 *
 * コレクションと違いユーザー個別ではなくグローバル共通のデータのため、
 * sub での絞り込みは行わない（OpenAPI の listMarketSummary と一致）。
 */
export class MarketRepositoryImpl implements MarketRepository {
  /** GET /market/summary … 相場サマリ（MarketSummary）の全件配列。 */
  async listSummaries(): Promise<MarketSummary[]> {
    return apiGet<MarketSummary[]>('/market/summary');
  }
}

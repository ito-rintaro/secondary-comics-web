import type { MarketRecord } from '../../domain/market/MarketRecord';
import type { MarketRepository } from '../../application/market/ports/MarketRepository';
import { apiGet } from '../http/apiClient';

/**
 * 本番実装：バックエンド API（dev）に接続する MarketRepository。
 * GET /market はマーケット相場レコードの配列を返す。
 *
 * コレクションと違いユーザー個別ではなくグローバル共通のデータのため、
 * sub での絞り込みは行わない（OpenAPI の listMarket と一致）。
 * price / change / history など算出済みの値はサーバーが返すため、
 * フロントでの擬似生成（Demo）は不要。
 */
export class MarketRepositoryImpl implements MarketRepository {
  /** GET /market … マーケット相場レコードの全件配列。 */
  async list(): Promise<MarketRecord[]> {
    return apiGet<MarketRecord[]>('/market');
  }
}

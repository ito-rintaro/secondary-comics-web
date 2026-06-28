import type { Catalog } from '../../domain/catalog/Catalog';
import type { CatalogRepository } from '../../application/catalog/ports/CatalogRepository';
import { apiGet } from '../http/apiClient';

/**
 * 本番実装：バックエンド API（dev）に接続する CatalogRepository。
 * GET /catalogs は書誌マスタ（Catalog）の配列を返す。
 *
 * マーケット同様、全ユーザー共通（グローバル）のデータのため sub での絞り込みはない。
 * 新規作成モーダルでの catalogId 選択に用いる。
 */
export class CatalogRepositoryImpl implements CatalogRepository {
  /** GET /catalogs … カタログの全件配列。 */
  async list(): Promise<Catalog[]> {
    return apiGet<Catalog[]>('/catalogs');
  }
}

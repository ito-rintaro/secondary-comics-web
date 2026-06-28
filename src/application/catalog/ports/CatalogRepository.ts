import type { Catalog } from '../../../domain/catalog/Catalog';

/**
 * カタログ（書誌マスタ）取得の出力ポート（境界）。
 * 実装は infrastructure 側（Impl=API / Demo）。ユースケースはこの抽象だけに依存する。
 * カタログは全ユーザー共通（グローバル）のため sub での絞り込みはない。
 */
export interface CatalogRepository {
  /** 全件取得（GET /catalogs）。 */
  list(): Promise<Catalog[]>;
}

import type { Condition } from '../../../domain/collection/Condition';

/**
 * POST /collection のリクエストボディ（OpenAPI の NewCollectionInput と一致）。
 * 書誌は catalogId で既存 Catalog を参照するため、title 等の書誌は含めない。
 * id / updatedAt / imageUrl はサーバが採番・カタログから合成するため含めない。
 * market / marketSource はマーケットからサーバが導出するため含めない。
 * catalogId と condition のみ必須、他はサーバ側で既定値補完される。
 */
export interface NewCollectionInput {
  catalogId: string; // 参照する Catalog の id（実在必須）
  condition: Condition;
  qty?: number; // 既定 1
  cost?: number; // 既定 0
  purchaseDate?: string; // YYYY-MM-DD。既定 ''
  store?: string; // 既定 ''
  location?: string; // 既定 ''
  memo?: string; // 既定 ''
}

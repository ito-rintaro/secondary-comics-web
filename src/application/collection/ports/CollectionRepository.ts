import type { CollectionItem } from '../../../domain/collection/CollectionItem';

/**
 * コレクション永続化の出力ポート（境界）。
 * 実装は infrastructure 側（Demo / 将来 Impl）。ユースケースはこの抽象だけに依存する。
 * 戻り値はすべて Promise（同期 localStorage でも将来の非同期 API でもシグネチャ不変）。
 */
export interface CollectionRepository {
  /** 全件取得（検索/フィルタ/ソートは application の applyCollectionQuery で適用）。 */
  list(): Promise<CollectionItem[]>;
  getById(id: string): Promise<CollectionItem | null>;
  /** add / update 兼用（upsert）。 */
  save(item: CollectionItem): Promise<void>;
  delete(id: string): Promise<void>;
  /** import 用の全置換。 */
  replaceAll(items: CollectionItem[]): Promise<void>;
}

import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import type { CollectionRepository } from '../ports/CollectionRepository';

/**
 * コレクション全件を取得する。
 * 検索/フィルタ/ソートは純関数 applyCollectionQuery で、集計は summarize で
 * Presentation 側の派生状態として算出する（リポジトリへの再アクセスを伴わない）。
 */
export class ListCollection {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(): Promise<CollectionItem[]> {
    return this.repo.list();
  }
}

import type { Catalog } from '../../../domain/catalog/Catalog';
import type { CatalogRepository } from '../ports/CatalogRepository';

/**
 * カタログ（書誌マスタ）を全件取得する。
 * 新規作成モーダルでの catalogId 選択に用いる。検索・絞り込みは
 * Presentation 側の派生状態として算出する（リポジトリへの再アクセスを伴わない）。
 */
export class ListCatalogs {
  private readonly repo: CatalogRepository;

  constructor(repo: CatalogRepository) {
    this.repo = repo;
  }

  async execute(): Promise<Catalog[]> {
    return this.repo.list();
  }
}

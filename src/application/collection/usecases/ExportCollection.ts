import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import type { CollectionRepository } from '../ports/CollectionRepository';

/** バックアップ書出し用に全件を返す（FR-A7）。シリアライズは Presentation 側。 */
export class ExportCollection {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(): Promise<CollectionItem[]> {
    return this.repo.list();
  }
}

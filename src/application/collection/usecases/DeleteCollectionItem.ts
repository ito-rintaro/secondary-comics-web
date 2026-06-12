import type { CollectionRepository } from '../ports/CollectionRepository';

/** 作品の削除。デモの btnDelete 相当。 */
export class DeleteCollectionItem {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import type { CollectionItemInput } from '../dto/CollectionItemInput';
import { ValidationError } from '../errors';
import { toCollectionItem } from '../toCollectionItem';
import type { CollectionRepository } from '../ports/CollectionRepository';

/** 作品の登録・編集（upsert）。デモの btnSave 相当。 */
export class SaveCollectionItem {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(input: CollectionItemInput): Promise<CollectionItem> {
    if (!input.title.trim()) {
      throw new ValidationError('タイトルを入力してください');
    }
    const item = toCollectionItem(input);
    await this.repo.save(item);
    return item;
  }
}

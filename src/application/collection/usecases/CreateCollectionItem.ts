import type { CollectionItem } from '../../../domain/collection/CollectionItem';
import { CONDITIONS } from '../../../domain/collection/Condition';
import type { NewCollectionInput } from '../dto/NewCollectionInput';
import { ValidationError } from '../errors';
import type { CollectionRepository } from '../ports/CollectionRepository';

/**
 * コレクションへの新規追加（POST /collection 相当）。
 * 書誌は catalogId で既存 Catalog を参照する設計のため、本ユースケースは
 * 所有インスタンス固有の入力のみを受け取り、catalogId と condition の存在だけを
 * 検証する。catalogId の実在チェックや既定値補完はサーバ側で行う。
 */
export class CreateCollectionItem {
  private readonly repo: CollectionRepository;

  constructor(repo: CollectionRepository) {
    this.repo = repo;
  }

  async execute(input: NewCollectionInput): Promise<CollectionItem> {
    if (!input.catalogId.trim()) {
      throw new ValidationError('カタログを選択してください');
    }
    if (!CONDITIONS.includes(input.condition)) {
      throw new ValidationError('コンディションを選択してください');
    }
    return this.repo.create(input);
  }
}

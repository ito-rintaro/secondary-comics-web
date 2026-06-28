import type { CollectionItem } from '../../domain/collection/CollectionItem';
import type { CollectionRepository } from '../../application/collection/ports/CollectionRepository';
import type { NewCollectionInput } from '../../application/collection/dto/NewCollectionInput';
import { NotImplementedError } from '../../application/collection/errors';
import { apiGet, apiPost } from '../http/apiClient';

/**
 * 本番実装：バックエンド API（dev）に接続する CollectionRepository。
 * 取得系（GET /collection）と新規追加（POST /collection）を実装する。
 * 編集・削除（update / delete / replaceAll）は今回スコープ外のため例外を投げる。
 *
 * userId はリクエストに含めない。Cognito の ID トークン（apiClient が付与）の
 * sub からサーバー側で本人のデータに絞り込まれる。
 */
export class CollectionRepositoryImpl implements CollectionRepository {
  /** GET /collection … ログイン中ユーザーの全アイテム配列。 */
  async list(): Promise<CollectionItem[]> {
    return apiGet<CollectionItem[]>('/collection');
  }

  /** 単体取得 API は未提供のため一覧から導出する（件数が増えたら専用 API へ）。 */
  async getById(id: string): Promise<CollectionItem | null> {
    const items = await this.list();
    return items.find((x) => x.id === id) ?? null;
  }

  /** POST /collection … catalogId と所有情報を送り、合成済みの CollectionItem を受け取る。 */
  async create(input: NewCollectionInput): Promise<CollectionItem> {
    return apiPost<CollectionItem>('/collection', input);
  }

  async save(): Promise<void> {
    throw new NotImplementedError('作品の編集 API はまだ提供されていません。');
  }

  async delete(): Promise<void> {
    throw new NotImplementedError('作品の削除 API はまだ提供されていません。');
  }

  async replaceAll(): Promise<void> {
    throw new NotImplementedError('インポート API はまだ提供されていません。');
  }
}

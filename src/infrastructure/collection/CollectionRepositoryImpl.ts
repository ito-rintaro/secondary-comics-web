import type { CollectionItem } from '../../domain/collection/CollectionItem';
import type { CollectionRepository } from '../../application/collection/ports/CollectionRepository';
import { NotImplementedError } from '../../application/collection/errors';
import { apiGet } from '../http/apiClient';

/**
 * 本番実装：バックエンド API（dev）に接続する CollectionRepository。
 * 現状バックエンドは GET /collection のみ提供のため、取得系だけを実装し、
 * 書き込み系（save / delete / replaceAll）はエンドポイント提供までは例外を投げる。
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

  async save(): Promise<void> {
    throw new NotImplementedError('作品の登録・編集 API はまだ提供されていません。');
  }

  async delete(): Promise<void> {
    throw new NotImplementedError('作品の削除 API はまだ提供されていません。');
  }

  async replaceAll(): Promise<void> {
    throw new NotImplementedError('インポート API はまだ提供されていません。');
  }
}

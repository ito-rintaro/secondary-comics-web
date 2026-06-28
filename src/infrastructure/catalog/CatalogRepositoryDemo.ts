import type { Catalog } from '../../domain/catalog/Catalog';
import type { CatalogRepository } from '../../application/catalog/ports/CatalogRepository';
import { NotImplementedError } from '../../application/collection/errors';

/**
 * デモ実装：カタログ基盤は実 API（GET /catalogs）側にしか無いため、
 * Demo モードでは未対応とする。新規作成は API モードでのみ動作する方針に合わせる。
 */
export class CatalogRepositoryDemo implements CatalogRepository {
  async list(): Promise<Catalog[]> {
    throw new NotImplementedError(
      'カタログの取得はデモモードでは利用できません。API モード（VITE_USE_API=true）でお試しください。',
    );
  }
}

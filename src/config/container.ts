import type { CollectionRepository } from '../application/collection/ports/CollectionRepository';
import { CreateCollectionItem } from '../application/collection/usecases/CreateCollectionItem';
import { DeleteCollectionItem } from '../application/collection/usecases/DeleteCollectionItem';
import { ExportCollection } from '../application/collection/usecases/ExportCollection';
import { ImportCollection } from '../application/collection/usecases/ImportCollection';
import { ListCollection } from '../application/collection/usecases/ListCollection';
import { SaveCollectionItem } from '../application/collection/usecases/SaveCollectionItem';
import type { CatalogRepository } from '../application/catalog/ports/CatalogRepository';
import { ListCatalogs } from '../application/catalog/usecases/ListCatalogs';
import type { MarketRepository } from '../application/market/ports/MarketRepository';
import { ListMarketRecords } from '../application/market/usecases/ListMarketRecords';
import { CollectionRepositoryDemo } from '../infrastructure/collection/CollectionRepositoryDemo';
import { CollectionRepositoryImpl } from '../infrastructure/collection/CollectionRepositoryImpl';
import { CatalogRepositoryDemo } from '../infrastructure/catalog/CatalogRepositoryDemo';
import { CatalogRepositoryImpl } from '../infrastructure/catalog/CatalogRepositoryImpl';
import { MarketRepositoryDemo } from '../infrastructure/market/MarketRepositoryDemo';
import { MarketRepositoryImpl } from '../infrastructure/market/MarketRepositoryImpl';

/**
 * Composition Root（合成の場所）。
 * ここだけが具体実装を import し、どの実装を使うかを決める唯一の分岐点。
 * VITE_USE_API === 'true' で実 API（GET /collection）に接続、それ以外は
 * ローカル開発用の Demo（localStorage）を使う。
 */
const collectionRepository: CollectionRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new CollectionRepositoryImpl()
    : new CollectionRepositoryDemo();

export const collectionUseCases = {
  list: new ListCollection(collectionRepository),
  create: new CreateCollectionItem(collectionRepository),
  save: new SaveCollectionItem(collectionRepository),
  remove: new DeleteCollectionItem(collectionRepository),
  exportAll: new ExportCollection(collectionRepository),
  importAll: new ImportCollection(collectionRepository),
};

const catalogRepository: CatalogRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new CatalogRepositoryImpl()
    : new CatalogRepositoryDemo();

export const catalogUseCases = {
  list: new ListCatalogs(catalogRepository),
};

const marketRepository: MarketRepository =
  import.meta.env.VITE_USE_API === 'true'
    ? new MarketRepositoryImpl()
    : new MarketRepositoryDemo();

export const marketUseCases = {
  list: new ListMarketRecords(marketRepository),
};

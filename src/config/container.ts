import type { CollectionRepository } from '../application/collection/ports/CollectionRepository';
import { DeleteCollectionItem } from '../application/collection/usecases/DeleteCollectionItem';
import { ExportCollection } from '../application/collection/usecases/ExportCollection';
import { ImportCollection } from '../application/collection/usecases/ImportCollection';
import { ListCollection } from '../application/collection/usecases/ListCollection';
import { SaveCollectionItem } from '../application/collection/usecases/SaveCollectionItem';
import { CollectionRepositoryDemo } from '../infrastructure/collection/CollectionRepositoryDemo';

/**
 * Composition Root（合成の場所）。
 * ここだけが具体実装を import し、どの実装を使うかを決める唯一の分岐点。
 * バックエンド実装時は VITE_USE_API を見て CollectionRepositoryImpl に差し替える。
 *
 *   const collectionRepository: CollectionRepository =
 *     import.meta.env.VITE_USE_API === 'true'
 *       ? new CollectionRepositoryImpl(httpClient)
 *       : new CollectionRepositoryDemo();
 */
const collectionRepository: CollectionRepository = new CollectionRepositoryDemo();

export const collectionUseCases = {
  list: new ListCollection(collectionRepository),
  save: new SaveCollectionItem(collectionRepository),
  remove: new DeleteCollectionItem(collectionRepository),
  exportAll: new ExportCollection(collectionRepository),
  importAll: new ImportCollection(collectionRepository),
};

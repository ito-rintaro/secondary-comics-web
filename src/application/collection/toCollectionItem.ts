import type { CollectionItem } from '../../domain/collection/CollectionItem';
import type { CollectionItemInput } from './dto/CollectionItemInput';

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/**
 * 入力DTO → ドメインエンティティへの変換。
 * 数値の正規化・トリム・flags の構造化を行い、MVP では出所を manual 固定にする。
 * （将来は updatedAt を Clock ポート経由にして時刻をテスト可能にできる。）
 */
export const toCollectionItem = (input: CollectionItemInput): CollectionItem => ({
  id: input.id || generateId(),
  title: input.title.trim(),
  author: input.author.trim(),
  publisher: input.publisher.trim(),
  volume: input.volume.trim(),
  year: input.year.trim(),
  condition: input.condition,
  qty: Math.max(1, Number(input.qty) || 1),
  cost: Number(input.cost) || 0,
  market: Number(input.market) || 0,
  marketSource: 'manual',
  flags: {
    firstEd: input.firstEd,
    obi: input.obi,
    special: input.special,
  },
  purchaseDate: input.purchaseDate,
  store: input.store.trim(),
  location: input.location.trim(),
  memo: input.memo.trim(),
  imageUrl: input.imageUrl,
  updatedAt: Date.now(),
});

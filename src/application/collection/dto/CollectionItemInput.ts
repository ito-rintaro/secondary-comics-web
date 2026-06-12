import type { Condition } from '../../../domain/collection/Condition';

/**
 * フォームからの入力DTO（まだ検証されていない生データ）。
 * フラグは UI のチェックボックスに合わせて平坦化。toCollectionItem でドメインに昇格させる。
 */
export interface CollectionItemInput {
  id?: string; // 既存編集時のみ
  title: string;
  author: string;
  publisher: string;
  volume: string;
  year: string;
  condition: Condition;
  qty: number;
  cost: number;
  market: number;
  purchaseDate: string;
  store: string;
  location: string;
  firstEd: boolean;
  obi: boolean;
  special: boolean;
  memo: string;
  imageUrl: string;
}

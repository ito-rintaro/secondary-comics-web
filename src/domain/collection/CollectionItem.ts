import type { Condition } from './Condition';
import type { ConditionFlags } from './ConditionFlags';

/** 相場の出所（03_data_model.md の market_source）。フェーズ移行で重要。 */
export type MarketSource = 'manual' | 'auto' | 'estimate';

/**
 * コレクションの所有品（エンティティ）。
 * デモの平坦な item を型付きドメインに引き上げたもの。
 */
export interface CollectionItem {
  id: string;
  title: string;
  author: string;
  publisher: string;
  volume: string;
  year: string;
  condition: Condition;
  qty: number; // 所有数（>= 1）
  cost: number; // 取得価格（1点・円）
  market: number; // 現在相場（1点・円）
  marketSource: MarketSource;
  flags: ConditionFlags;
  purchaseDate: string; // YYYY-MM-DD（未入力は ''）
  store: string;
  location: string;
  memo: string;
  imageUrl: string; // 今: dataURL / 将来: オブジェクトストレージURL
  updatedAt: number; // epoch ms
}

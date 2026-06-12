import type { Condition } from '../shared/Condition';
import type { ConditionFlags } from '../shared/ConditionFlags';

/**
 * マーケットの出品/相場（エンティティ）。
 * デモの MARKET（擬似生成）を型付きドメインに引き上げたもの。
 * price/history/change は生成方法（infrastructure）には依存しない事実だけを持つ。
 */
export interface MarketListing {
  id: string;
  title: string;
  author: string;
  publisher: string;
  volume: string;
  seller: string;
  condition: Condition;
  flags: ConditionFlags;
  history: number[]; // 直近12ヶ月の価格推移
  price: number; // 現在価格（history の末尾）
  change: number; // 期間変化率（(末-初)/初）
  listedAt: number; // 新着ソート用の連番
}

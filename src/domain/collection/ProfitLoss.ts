import type { CollectionItem } from './CollectionItem';

/** 含み損益 = (現在相場 - 取得価格) * 所有数（03_data_model.md 準拠） */
export const profitLoss = (it: CollectionItem): number =>
  (it.market - it.cost) * it.qty;

/** 評価額 = 現在相場 * 所有数 */
export const evaluation = (it: CollectionItem): number => it.market * it.qty;

/** 取得額 = 取得価格 * 所有数 */
export const acquisitionCost = (it: CollectionItem): number => it.cost * it.qty;

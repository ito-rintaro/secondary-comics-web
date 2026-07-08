import type { ConditionFlags } from '../shared/ConditionFlags';

/**
 * catalog 単位の相場サマリ（GET /market/summary が返す読み取りモデル）。
 * 相場一覧カード・価格チャートが消費する。price / change / history は
 * 成約ログ（MarketSale）を集計して導出した値（summaryFromSales）。
 *
 * 成約が 1 件以上ある catalog のみ存在する（0 件の catalog は含まれない）。
 * 出品者（seller）・個別 condition・listing 単位の id は catalog 集計のため持たない。
 */
export interface MarketSummary {
  catalogId: string; // 集計単位＝参照する Catalog の id（一覧の識別子）
  title: string; // 書誌（Catalog 由来）
  author: string;
  publisher: string;
  volume: string;
  flags: ConditionFlags;
  imageUrl: string; // S3 オブジェクトキー（空は画像なし）
  price: number; // 現在価格（= history 末尾）
  change: number; // 期間変化率（(末-初)/初）
  history: number[]; // 月次に畳んだ擬似価格系列。要素数12・末尾=当月
  sampleCount: number; // 集計に使った成約点数（相場の信頼度の目安）
  lastSoldAt: string; // 直近成約日 "YYYY-MM-DD"
}

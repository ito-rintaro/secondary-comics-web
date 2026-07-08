import type { Condition } from '../shared/Condition';
import type { ConditionFlags } from '../shared/ConditionFlags';

/**
 * マーケットの成約レコード（1 レコード = 1 価格の取引ログ）。
 * GET /market が返す成約イベント。相場（history/change）はこれを catalog 単位に
 * 畳んで導出する（summaryFromSales）。書誌は catalogId で Catalog を参照する。
 */
export interface MarketSale {
  id: string; // レコード識別子（システム生成。mk-xxx）
  title: string; // 書誌（Catalog 由来）
  author: string;
  publisher: string;
  volume: string;
  flags: ConditionFlags;
  imageUrl: string; // S3 オブジェクトキー（CloudFront images/ 配下）。空は画像なし
  catalogId: string; // 参照する Catalog の id（集計単位）
  condition: Condition; // この成約個体のコンディション
  price: number; // 単一の成約価格（円）
  soldAt: string; // 成約日 "YYYY-MM-DD"
  seller: string; // 販売元 / ショップ名（空文字可）
}
